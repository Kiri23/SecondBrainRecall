const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

// Function to get file modification time
function getFileModTime(filePath) {
    const stats = fs.statSync(filePath);
    return stats.mtime.getTime();
}

// Function to process a single file
function processFile(sourcePath, targetPath) {
    const fileHash = calculateFileHash(sourcePath);
    
    if (fs.existsSync(targetPath)) {
        const sourceModTime = getFileModTime(sourcePath);
        const targetModTime = getFileModTime(targetPath);
        
        if (sourceModTime > targetModTime) {
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Updated: ${path.relative(sourceDir, sourcePath)} (newer version)`);
        } else {
            console.log(`Skipped: ${path.relative(sourceDir, sourcePath)} (target version is newer or same age)`);
        }
    } else {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Processed: ${path.relative(sourceDir, sourcePath)} (new file)`);
    }
}

// Function to process directory recursively
function processDirectory(sourcePath, targetPath) {
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
            processDirectory(sourceItemPath, targetItemPath);
        } else if (stats.isFile()) {
            // Process files
            processFile(sourceItemPath, targetItemPath);
        }
    });
}

// Main processing function
function processFiles() {
    try {
        // Create target directory if it doesn't exist
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Start recursive processing from root
        processDirectory(sourceDir, targetDir);
        
        console.log('\nProcessing completed successfully!');
        console.log(`Target location: ${targetDir}`);
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

// Run the script
processFiles(); 