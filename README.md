# Second Brain Recall

A file processing system for Second Brain with a flexible logging system.

## Logging System

The project includes a custom logging system with the following features:

- Multiple transport types (Console and File)
- Configurable log levels
- Structured logging with metadata
- JSON and text format support
- Easy to extend with new transports

### Log Levels

- `error`: Critical errors that need immediate attention
- `warn`: Warning messages for potential issues
- `info`: General information about the process
- `debug`: Detailed information for debugging

### Usage

```javascript
const { logger } = require("./lib/loggingSystem");

// Basic logging
logger.info("Processing started");
logger.error("An error occurred", { error: "details" });

// Logging with metadata
logger.info("File processed", {
    file: "example.md",
    size: 1024,
    type: "markdown",
});
```

### Configuration

The logging system can be configured through the following options:

```javascript
const { Logger } = require("./lib/loggingSystem");

const logger = new Logger({
    level: "info", // Set minimum log level
    format: "json", // 'json' or 'text'
    logFile: "./logs/app.log", // Custom log file path
});
```

### Transports

#### Console Transport

Outputs logs to the console with level filtering.

#### File Transport

Writes logs to a file with level filtering and automatic file rotation.

## Project Structure

```
SecondBrainRecall/
├── lib/
│   └── loggingSystem.js    # Logging system module
├── ProcessedFiles/         # Processed files directory
├── logs/                   # Log files directory
├── processFiles.js         # Main processing script
└── package.json           # Project configuration
```

## Installation

```bash
yarn install
```

## Usage

```bash
yarn start
```

## License

ISC
