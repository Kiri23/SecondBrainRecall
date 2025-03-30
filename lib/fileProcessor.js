import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class FileProcessor {
    constructor(options = {}) {
        this.sourceDir = options.sourceDir || process.cwd();
        this.targetDir = options.targetDir || path.join(process.cwd(), 'ProcessedFiles');
        this.logger = options.logger;
        this.onProgress = options.onProgress || (() => {});
        this.stats = {
            processed: 0,
            updated: 0,
            skipped: 0,
            duplicates: 0,
            errors: 0
        };
    }

    calculateFileHash(filePath) {
        const fileBuffer = fs.readFileSync(filePath);
        const hashSum = crypto.createHash('md5');
        hashSum.update(fileBuffer);
        return hashSum.digest('hex');
    }

    getFileModTime(filePath) {
        const stats = fs.statSync(filePath);
        return stats.mtime.getTime();
    }

    processFile(sourcePath, targetPath, fileHashes) {
        try {
            const sourceHash = this.calculateFileHash(sourcePath);
            const sourceModTime = this.getFileModTime(sourcePath);
            const sourceFileName = path.basename(sourcePath);
            
            // Check if we've seen this hash before
            if (fileHashes.has(sourceHash)) {
                const existingFile = fileHashes.get(sourceHash);
                this.stats.duplicates++;
                this.logger?.info('Skipped duplicate file', {
                    file: path.relative(this.sourceDir, sourcePath),
                    duplicateOf: path.relative(this.sourceDir, existingFile),
                    reason: 'content identical'
                });
                return;
            }
            
            // If target exists, check if it's different
            if (fs.existsSync(targetPath)) {
                const targetHash = this.calculateFileHash(targetPath);
                const targetModTime = this.getFileModTime(targetPath);
                
                // If files have the same name but different content
                if (sourceHash !== targetHash) {
                    // Keep the most recent version
                    if (sourceModTime > targetModTime) {
                        fs.copyFileSync(sourcePath, targetPath);
                        this.stats.updated++;
                        this.logger?.info('Updated file with newer version', {
                            file: path.relative(this.sourceDir, sourcePath),
                            reason: 'newer version available',
                            sourceModTime: new Date(sourceModTime).toISOString(),
                            targetModTime: new Date(targetModTime).toISOString()
                        });
                    } else {
                        this.stats.skipped++;
                        this.logger?.info('Skipped older version of file', {
                            file: path.relative(this.sourceDir, sourcePath),
                            reason: 'older version',
                            sourceModTime: new Date(sourceModTime).toISOString(),
                            targetModTime: new Date(targetModTime).toISOString()
                        });
                    }
                } else {
                    this.stats.skipped++;
                    this.logger?.debug('Skipped file', {
                        file: path.relative(this.sourceDir, sourcePath),
                        reason: 'content unchanged'
                    });
                }
            } else {
                fs.copyFileSync(sourcePath, targetPath);
                this.stats.processed++;
                this.logger?.info('Processed new file', {
                    file: path.relative(this.sourceDir, sourcePath),
                    modTime: new Date(sourceModTime).toISOString()
                });
            }
            
            // Record this hash
            fileHashes.set(sourceHash, sourcePath);
            this.onProgress(this.stats);
        } catch (error) {
            this.stats.errors++;
            this.logger?.error('Error processing file', {
                file: path.relative(this.sourceDir, sourcePath),
                error: error.message
            });
            throw error;
        }
    }

    processDirectory(sourcePath, targetPath, fileHashes) {
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
        }

        const items = fs.readdirSync(sourcePath);

        items.forEach(item => {
            const sourceItemPath = path.join(sourcePath, item);
            const targetItemPath = path.join(targetPath, item);

            const stats = fs.statSync(sourceItemPath);

            if (stats.isDirectory()) {
                this.processDirectory(sourceItemPath, targetItemPath, fileHashes);
            } else if (stats.isFile()) {
                this.processFile(sourceItemPath, targetItemPath, fileHashes);
            }
        });
    }

    validatePaths() {
        if (!fs.existsSync(this.sourceDir)) {
            throw new Error(`Source directory does not exist: ${this.sourceDir}`);
        }

        const sourceStat = fs.statSync(this.sourceDir);
        if (!sourceStat.isDirectory()) {
            throw new Error(`Source path is not a directory: ${this.sourceDir}`);
        }
    }

    process() {
        try {
            this.validatePaths();

            this.logger?.info('Starting file processing', {
                sourceDir: this.sourceDir,
                targetDir: this.targetDir
            });

            if (!fs.existsSync(this.targetDir)) {
                fs.mkdirSync(this.targetDir, { recursive: true });
            }

            // Map to track file hashes across all directories
            const fileHashes = new Map();

            this.processDirectory(this.sourceDir, this.targetDir, fileHashes);
            
            this.logger?.info('Processing completed successfully', {
                ...this.stats,
                uniqueFiles: fileHashes.size,
                targetDir: this.targetDir
            });

            return this.stats;
        } catch (error) {
            this.logger?.error('Error processing files', {
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }
} 