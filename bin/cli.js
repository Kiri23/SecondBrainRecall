#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { FileProcessor } from '../lib/fileProcessor.js';
import { Logger, ConsoleTransport, FileTransport } from '../lib/loggingSystem.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

// Configure CLI
program
    .name('second-brain-recall')
    .description('Process and organize Second Brain files')
    .version('1.0.0')
    .argument('[source]', 'Source directory (defaults to current directory)')
    .argument('[target]', 'Target directory (defaults to ./ProcessedFiles)')
    .option('--console', 'Enable console logging', true)
    .option('--no-console', 'Disable console logging')
    .option('--file', 'Enable file logging', true)
    .option('--no-file', 'Disable file logging')
    .option('--log-file <path>', 'Custom log file path')
    // Phase 2 options (placeholders)
    .option('--log-level <level>', 'Set logging level (info, debug, error, warn)', 'info')
    .option('--format <format>', 'Set log format (json, text)', 'text')
    .option('--dry-run', 'Preview changes without making them')
    .action(async (source, target, options) => {
        try {
            // Configure logger based on options
            const logger = new Logger({
                level: options.logLevel,
                format: options.format,
                logFile: options.logFile
            });

            if (options.console) {
                logger.addTransport(new ConsoleTransport({ level: options.logLevel }));
            }

            if (options.file) {
                logger.addTransport(new FileTransport({
                    level: options.logLevel,
                    logFile: options.logFile
                }));
            }

            // If no source/target provided, show file picker
            if (!source || !target) {
                const answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'source',
                        message: 'Enter source directory path:',
                        default: process.cwd(),
                        validate: (input) => fs.existsSync(input) || 'Directory does not exist'
                    },
                    {
                        type: 'input',
                        name: 'target',
                        message: 'Enter target directory path:',
                        default: path.join(process.cwd(), 'ProcessedFiles')
                    }
                ]);

                source = answers.source;
                target = answers.target;
            }

            // Initialize file processor
            const processor = new FileProcessor({
                sourceDir: source,
                targetDir: target,
                logger,
                onProgress: (stats) => {
                    // Simple progress indicator
                    process.stdout.write(chalk.green(
                        `\rProcessed: ${stats.processed}, Updated: ${stats.updated}, Skipped: ${stats.skipped}, Errors: ${stats.errors}`
                    ));
                }
            });

            // Process files
            if (options.dryRun) {
                logger.info('Dry run mode - no changes will be made');
                // TODO: Implement dry run logic in Phase 2
            } else {
                const stats = await processor.process();
                console.log('\n'); // New line after progress indicator
                logger.info('Processing completed', stats);
            }
        } catch (error) {
            console.error(chalk.red('Error:'), error.message);
            process.exit(1);
        }
    });

// Parse command line arguments
program.parse(); 