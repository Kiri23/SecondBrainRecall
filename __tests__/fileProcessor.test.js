import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { FileProcessor } from '../lib/fileProcessor.js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

describe('FileProcessor', () => {
    let processor;
    let mockLogger;
    let mockHashUpdate;
    let mockHashDigest;
    
    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Setup mock logger
        mockLogger = {
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn()
        };
        
        // Setup mock hash functions
        mockHashUpdate = jest.fn().mockReturnThis();
        mockHashDigest = jest.fn().mockReturnValue('test-hash');
        
        // Mock fs functions
        jest.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('test content'));
        jest.spyOn(fs, 'existsSync').mockReturnValue(false);
        jest.spyOn(fs, 'copyFileSync').mockImplementation(() => {});
        jest.spyOn(fs, 'statSync').mockReturnValue({ mtime: { getTime: () => 1000 } });
        
        // Mock crypto functions
        jest.spyOn(crypto, 'createHash').mockReturnValue({
            update: mockHashUpdate,
            digest: mockHashDigest
        });
        
        // Initialize processor with mock logger
        processor = new FileProcessor({
            sourceDir: '/source',
            targetDir: '/target',
            logger: mockLogger
        });
    });
    
    describe('calculateFileHash', () => {
        it('should calculate MD5 hash of file content', () => {
            const filePath = '/test/file.txt';
            const mockContent = Buffer.from('test content');
            fs.readFileSync.mockReturnValue(mockContent);
            
            const hash = processor.calculateFileHash(filePath);
            
            expect(fs.readFileSync).toHaveBeenCalledWith(filePath);
            expect(crypto.createHash).toHaveBeenCalledWith('md5');
            expect(mockHashUpdate).toHaveBeenCalledWith(mockContent);
            expect(mockHashDigest).toHaveBeenCalledWith('hex');
            expect(hash).toBe('test-hash');
        });

        it('should calculate real MD5 hash of content', () => {
            // Create a temporary file with known content
            const content = 'Hello, World!';
            const expectedHash = '65a8e27d8879283831b664bd8b7f0ad4';
            
            // Mock fs to return our test content
            fs.readFileSync.mockReturnValue(Buffer.from(content));
            
            // Restore crypto mock to use real implementation
            jest.spyOn(crypto, 'createHash').mockRestore();
            
            const hash = processor.calculateFileHash('/test/file.txt');
            
            expect(hash).toBe(expectedHash);
            
            // Restore crypto mock
            jest.spyOn(crypto, 'createHash').mockReturnValue({
                update: mockHashUpdate,
                digest: mockHashDigest
            });
        });
    });
    
    describe('processFile', () => {
        it('should skip duplicate files with same content', () => {
            // Setup
            const fileHashes = new Map();
            const existingFile = '/source/existing.txt';
            fileHashes.set('test-hash', existingFile);
            
            // Mock hash calculation
            processor.calculateFileHash = jest.fn().mockReturnValue('test-hash');
            
            // Process new file with same hash
            const newFile = '/source/new.txt';
            processor.processFile(newFile, '/target/new.txt', fileHashes);
            
            // Verify
            expect(mockLogger.info).toHaveBeenCalledWith('Skipped duplicate file', {
                file: path.relative('/source', newFile),
                duplicateOf: path.relative('/source', existingFile),
                reason: 'content identical'
            });
            expect(fs.copyFileSync).not.toHaveBeenCalled();
        });
        
        it('should copy new files', () => {
            // Setup
            const fileHashes = new Map();
            const sourcePath = '/source/new.txt';
            const targetPath = '/target/new.txt';
            
            // Mock hash calculation
            processor.calculateFileHash = jest.fn().mockReturnValue('new-hash');
            fs.existsSync.mockReturnValue(false);
            
            // Process new file
            processor.processFile(sourcePath, targetPath, fileHashes);
            
            // Verify
            expect(fs.copyFileSync).toHaveBeenCalledWith(sourcePath, targetPath);
            expect(mockLogger.info).toHaveBeenCalledWith('Processed new file', {
                file: path.relative('/source', sourcePath),
                modTime: new Date(1000).toISOString()
            });
            expect(fileHashes.get('new-hash')).toBe(sourcePath);
        });
        
        it('should update existing files with different content', () => {
            // Setup
            const fileHashes = new Map();
            const sourcePath = '/source/file.txt';
            const targetPath = '/target/file.txt';
            
            // Mock hash calculations
            processor.calculateFileHash = jest.fn()
                .mockReturnValueOnce('source-hash')  // Source file hash
                .mockReturnValueOnce('target-hash'); // Target file hash
            
            // Mock file modification times
            fs.statSync
                .mockReturnValueOnce({ mtime: { getTime: () => 2000 } })  // Source file is newer
                .mockReturnValueOnce({ mtime: { getTime: () => 1000 } }); // Target file is older
            
            fs.existsSync.mockReturnValue(true);
            
            // Process file
            processor.processFile(sourcePath, targetPath, fileHashes);
            
            // Verify
            expect(fs.copyFileSync).toHaveBeenCalledWith(sourcePath, targetPath);
            expect(mockLogger.info).toHaveBeenCalledWith('Updated file with newer version', {
                file: path.relative('/source', sourcePath),
                reason: 'newer version available',
                sourceModTime: new Date(2000).toISOString(),
                targetModTime: new Date(1000).toISOString()
            });
            expect(fileHashes.get('source-hash')).toBe(sourcePath);
        });

        it('should handle files with same name but different content', () => {
            const sourcePath = '/source/same-name.md';
            const targetPath = '/target/same-name.md';
            
            // Mock hash calculations to return different hashes
            processor.calculateFileHash = jest.fn()
                .mockReturnValueOnce('hash1')  // First version hash
                .mockReturnValueOnce('hash2'); // Second version hash
            
            // Mock file modification times
            fs.statSync
                .mockReturnValueOnce({ mtime: { getTime: () => 1000 } })  // First version timestamp
                .mockReturnValueOnce({ mtime: { getTime: () => 2000 } }); // Second version timestamp (newer)
            
            fs.existsSync
                .mockReturnValueOnce(false)  // First time file doesn't exist
                .mockReturnValueOnce(true);  // Second time file exists
            
            // Process file twice with different content
            processor.processFile(sourcePath, targetPath, new Map());
            processor.processFile(sourcePath, targetPath, new Map());
            
            // Verify that:
            // 1. File was copied twice because the second version was newer
            expect(fs.copyFileSync).toHaveBeenCalledTimes(2);
            
            // 2. First operation was logged as processed
            expect(mockLogger.info).toHaveBeenCalledWith('Processed new file', {
                file: path.relative('/source', sourcePath),
                modTime: new Date(1000).toISOString()
            });
            
            // 3. Second operation was logged as updated with newer version
            expect(mockLogger.info).toHaveBeenCalledWith('Updated file with newer version', {
                file: path.relative('/source', sourcePath),
                reason: 'newer version available',
                sourceModTime: new Date(2000).toISOString(),
                targetModTime: new Date(1000).toISOString()
            });
        });

        it('should keep existing file when new version is older', () => {
            const sourcePath = '/source/same-name.md';
            const targetPath = '/target/same-name.md';
            
            // Mock hash calculations to return different hashes
            processor.calculateFileHash = jest.fn()
                .mockReturnValueOnce('hash1')  // First version hash
                .mockReturnValueOnce('hash2')  // Second version hash (different from first)
                .mockReturnValueOnce('hash1'); // Target file hash (same as first)
            
            // Mock file modification times (new version is older)
            fs.statSync
                .mockReturnValueOnce({ mtime: { getTime: () => 2000 } })  // First version timestamp (newer)
                .mockReturnValueOnce({ mtime: { getTime: () => 1000 } })  // Second version timestamp (older)
                .mockReturnValueOnce({ mtime: { getTime: () => 2000 } }); // Target file timestamp for second process
            
            fs.existsSync
                .mockReturnValueOnce(false)  // First time file doesn't exist
                .mockReturnValueOnce(true);  // Second time file exists
            
            // Process file twice with different content
            const fileHashes = new Map();
            processor.processFile(sourcePath, targetPath, fileHashes);
            processor.processFile(sourcePath, targetPath, fileHashes);
            
            // Verify that:
            // 1. File was copied only once because the second version was older
            expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
            
            // 2. Verify all logger calls in order
            expect(mockLogger.info.mock.calls).toEqual([
                ['Processed new file', {
                    file: path.relative('/source', sourcePath),
                    modTime: new Date(2000).toISOString()
                }],
                ['Skipped older version of file', {
                    file: path.relative('/source', sourcePath),
                    reason: 'older version',
                    sourceModTime: new Date(1000).toISOString(),
                    targetModTime: new Date(2000).toISOString()
                }]
            ]);
        });
    });

    describe('content-based duplicate detection', () => {
        it('should detect duplicates based on content, not filename', () => {
            // Setup: Two files with same content but different names
            const file1Path = '/source/file1.md';
            const file2Path = '/source/file2.md';
            const targetPath = '/target/file1.md';
            
            // Mock hash calculation to return same hash for both files
            const sameHash = 'same-content-hash';
            processor.calculateFileHash = jest.fn()
                .mockReturnValue(sameHash);  // Same hash for all calls
            
            // Mock file modification times
            fs.statSync
                .mockReturnValue({ mtime: { getTime: () => 1000 } });  // Same timestamp for all files
            
            fs.existsSync.mockReturnValue(false);
            
            // Process first file
            const fileHashes = new Map();
            processor.processFile(file1Path, targetPath, fileHashes);
            
            // Process second file (should be detected as duplicate)
            processor.processFile(file2Path, '/target/file2.md', fileHashes);
            
            // Verify that:
            // 1. Only the first file was copied
            expect(fs.copyFileSync).toHaveBeenCalledTimes(1);
            expect(fs.copyFileSync).toHaveBeenCalledWith(file1Path, targetPath);
            
            // 2. Second file was logged as duplicate
            expect(mockLogger.info).toHaveBeenCalledWith('Skipped duplicate file', {
                file: path.relative('/source', file2Path),
                duplicateOf: path.relative('/source', file1Path),
                reason: 'content identical'
            });
        });
    });
}); 