Mejores opciones existen. Archivado por el momento 

Czkawka — escrito en Rust, multiplataforma, tiene CLI y GUI. Encuentra duplicados, carpetas vacías, imágenes similares, y más. GitHub Es probablemente el más completo y activo.

dedup (Go) — CLI que deduplica archivos en directorios usando hash MD5/SHA, con opciones de --dryrun, --keep, y --merge. GitHub Literalmente lo mismo que tu proyecto hace.

rmlint — herramienta de línea de comandos para encontrar y eliminar archivos duplicados y "lint" como archivos vacíos, symlinks rotos, etc. TecMint

fdupes, jdupes — los clásicos de Linux para deduplicación por hash.

# Second Brain Recall

A file processing system that helps you manage and deduplicate your Second Brain
knowledge base. It processes files while keeping your folder structure and
prevents duplicate content, even when files have different names.

## Features

- 🔄 **Smart Deduplication**: Uses MD5 hashing to detect duplicate content
- 📁 **Preserves Structure**: Keeps your original folder hierarchy
- 📝 **Flexible Logging**: Custom logging system with console and file options
- 🛠️ **CLI Interface**: Command-line interface with interactive prompts
- 🔍 **Detailed Tracking**: Logs file processing operations and duplicates

## Use Cases

- Process knowledge bases from Obsidian or other Second Brain tools
- Clean up duplicate content in your digital notes
- Keep a single source of truth for your knowledge base
- Organize exported content from note-taking tools 

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/SecondBrainRecall.git

# Navigate to the project directory
cd SecondBrainRecall

# Install dependencies
yarn install

# Install globally (requires sudo on Unix-based systems)
sudo npm link
```

## Usage

You can use Second Brain Recall in two ways:

### As a Binary

```bash
# Run with default options
second-brain-recall

# Run with specific source and target directories
second-brain-recall /path/to/source /path/to/target

# Run with custom logging options
second-brain-recall --log-level debug --log-format json --log-file ./logs/processing.log
```

### As a Local Script

```bash
# Run with default options
yarn start

# Run with specific source and target directories
yarn start --source /path/to/source --target /path/to/target

# Run with custom logging options
yarn start --log-level debug --log-format json --log-file ./logs/processing.log
```

### CLI Options

- `--source`: Source directory containing your Second Brain files
- `--target`: Target directory for processed files
- `--log-level`: Set logging level (error, warn, info, debug)
- `--log-format`: Choose log format (json or text)
- `--log-file`: Specify custom log file path
- `--dry-run`: Preview changes without making them

## Logging System

The project includes a logging system with:

- Console and file logging
- Configurable log levels
- Structured logging with metadata
- JSON and text format support

### Log Levels

- `error`: Critical errors that need immediate attention
- `warn`: Warning messages for potential issues
- `info`: General information about the process
- `debug`: Detailed information for debugging

### Usage Example

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

## Project Structure

```
SecondBrainRecall/
├── lib/
│   └── loggingSystem.js    # Logging system module
├── ProcessedFiles/         # Processed files directory
├── logs/                   # Log files directory
├── processFiles.js         # Main processing script
├── cli.js                  # CLI entry point
└── package.json           # Project configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major
changes, please open an issue first to discuss what you would like to change.

## License

ISC

## Author

Christian Nogueras

## Acknowledgments

- Inspired by the Second Brain methodology and digital note-taking tools
- Built with Node.js and Commander.js
