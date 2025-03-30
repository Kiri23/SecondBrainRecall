const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { logger } = require('./lib/loggingSystem');

// Define paths for Second Brain
const sourceDir = '/Users/christiannogueras/Downloads/Recall_export_2025-03-30T01-43-35';
const secondBrainDir = '/Users/christiannogueras/Documents/Personal projects/Side Project/SecondBrainRecall';
const targetDir = path.join(secondBrainDir, 'ProcessedFiles');

// Function to calculate file hash
function calculateFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

// Function to process a single file
function processFile(sourcePath, targetPath, fileHashes) {
    const sourceHash = calculateFileHash(sourcePath);
    const fileName = path.basename(sourcePath);
    
    // Check if we've seen this hash before
    if (fileHashes.has(sourceHash)) {
        const existingFile = fileHashes.get(sourceHash);
        logger.info(`Skipped duplicate file`, {
            file: path.relative(sourceDir, sourcePath),
            duplicateOf: path.relative(sourceDir, existingFile),
            reason: 'content identical'
        });
        return;
    }
    
    // If target exists, check if it's different
    if (fs.existsSync(targetPath)) {
        const targetHash = calculateFileHash(targetPath);
        
        if (sourceHash !== targetHash) {
            fs.copyFileSync(sourcePath, targetPath);
            logger.info(`Updated file`, {
                file: path.relative(sourceDir, sourcePath),
                reason: 'content changed'
            });
        } else {
            logger.debug(`Skipped file`, {
                file: path.relative(sourceDir, sourcePath),
                reason: 'content unchanged'
            });
        }
    } else {
        fs.copyFileSync(sourcePath, targetPath);
        logger.info(`Processed new file`, {
            file: path.relative(sourceDir, sourcePath)
        });
    }
    
    // Record this hash
    fileHashes.set(sourceHash, sourcePath);
}

// Function to process directory recursively
function processDirectory(sourcePath, targetPath, fileHashes) {
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
    }

    // Read directory contents
    const items = fs.readdirSync(sourcePath);

    items.forEach(item => {
        const sourceItemPath = path.join(sourcePath, item);
        const targetItemPath = path.join(targetPath, item);

        // Skip processFiles.js if it exists
        if (item === 'processFiles.js') return;

        const stats = fs.statSync(sourceItemPath);

        if (stats.isDirectory()) {
            // Recursive call for directories
            processDirectory(sourceItemPath, targetItemPath, fileHashes);
        } else if (stats.isFile()) {
            // Process files
            processFile(sourceItemPath, targetItemPath, fileHashes);
        }
    });
}

// Main processing function
function processFiles() {
    try {
        logger.info('Starting file processing', {
            sourceDir,
            targetDir
        });

        // Create target directory if it doesn't exist
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Map to track file hashes across all directories
        const fileHashes = new Map();

        // Start recursive processing from root
        processDirectory(sourceDir, targetDir, fileHashes);
        
        logger.info('Processing completed successfully', {
            targetDir,
            uniqueFiles: fileHashes.size
        });
    } catch (error) {
        logger.error('Error processing files', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
}

// Run the script
processFiles(); 