const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Define paths for Second Brain
const sourceDir = '/Users/christiannogueras/Downloads/Recall_export_2025-03-30T01-44-52/Technology/Programming';
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

// Function to check if directories are identical
function areDirectoriesIdentical(dir1, dir2) {
    const files1 = fs.readdirSync(dir1);
    const files2 = fs.readdirSync(dir2);
    
    if (files1.length !== files2.length) return false;
    
    for (const file of files1) {
        if (file === 'processFiles.js') continue;
        const file1Path = path.join(dir1, file);
        const file2Path = path.join(dir2, file);
        
        if (!fs.existsSync(file2Path)) return false;
        
        const hash1 = calculateFileHash(file1Path);
        const hash2 = calculateFileHash(file2Path);
        
        if (hash1 !== hash2) return false;
    }
    
    return true;
}

// Main processing function
function processFiles() {
    // Create Second Brain directory if it doesn't exist
    if (!fs.existsSync(secondBrainDir)) {
        fs.mkdirSync(secondBrainDir, { recursive: true });
    }

    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Check if target directory is identical to source
    if (fs.existsSync(targetDir) && areDirectoriesIdentical(sourceDir, targetDir)) {
        console.log('All files are already processed and up to date in Second Brain.');
        return;
    }

    // Read all files from source directory
    const files = fs.readdirSync(sourceDir);
    const processedFiles = new Set();
    const fileHashes = new Map();
    const fileNameMap = new Map(); // Track files by name

    // Process each file
    files.forEach(file => {
        // Skip the script itself
        if (file === 'processFiles.js') return;

        const sourcePath = path.join(sourceDir, file);
        
        // Skip if it's a directory
        if (fs.statSync(sourcePath).isDirectory()) return;

        const fileHash = calculateFileHash(sourcePath);
        const targetPath = path.join(targetDir, file);

        // Check if file with same name exists in target
        if (fs.existsSync(targetPath)) {
            const sourceModTime = getFileModTime(sourcePath);
            const targetModTime = getFileModTime(targetPath);
            
            if (sourceModTime > targetModTime) {
                // Source file is newer, update it
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`Updated: ${file} (newer version)`);
            } else {
                // Target file is newer or same age, keep it
                console.log(`Skipped: ${file} (target version is newer or same age)`);
            }
        } else {
            // New file, copy it
            fs.copyFileSync(sourcePath, targetPath);
            console.log(`Processed: ${file} (new file)`);
        }

        fileHashes.set(fileHash, file);
        processedFiles.add(file);
        fileNameMap.set(file, fileHash);
    });

    console.log(`\nSummary:`);
    console.log(`- Total files processed: ${processedFiles.size}`);
    console.log(`- Location: ${targetDir}`);
}

// Run the script
try {
    processFiles();
} catch (error) {
    console.error('Error processing files:', error);
} 