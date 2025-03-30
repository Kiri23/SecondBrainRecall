const fs = require('fs');
const path = require('path');

class Logger {
    constructor(options = {}) {
        this.transports = [];
        this.level = options.level || 'info';
        this.format = options.format || 'text';
        this.logFile = options.logFile || path.join(process.cwd(), 'logs', 'app.log');
        
        // Ensure logs directory exists
        const logsDir = path.dirname(this.logFile);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    addTransport(transport) {
        this.transports.push(transport);
    }

    formatMessage(level, message, meta = {}) {
        const timestamp = new Date().toISOString();
        const baseMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        
        if (this.format === 'json') {
            return JSON.stringify({
                timestamp,
                level,
                message,
                ...meta
            });
        }
        
        return baseMessage;
    }

    log(level, message, meta = {}) {
        const formattedMessage = this.formatMessage(level, message, meta);
        
        this.transports.forEach(transport => {
            if (transport.shouldLog(level)) {
                transport.log(formattedMessage);
            }
        });
    }

    info(message, meta = {}) {
        this.log('info', message, meta);
    }

    error(message, meta = {}) {
        this.log('error', message, meta);
    }

    debug(message, meta = {}) {
        this.log('debug', message, meta);
    }

    warn(message, meta = {}) {
        this.log('warn', message, meta);
    }
}

class ConsoleTransport {
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };
    }

    shouldLog(level) {
        return this.levels[level] <= this.levels[this.level];
    }

    log(message) {
        console.log(message);
    }
}

class FileTransport {
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.logFile = options.logFile || path.join(process.cwd(), 'logs', 'app.log');
        this.levels = {
            error: 0,
            warn: 1,
            info: 2,
            debug: 3
        };
    }

    shouldLog(level) {
        return this.levels[level] <= this.levels[this.level];
    }

    log(message) {
        fs.appendFileSync(this.logFile, message + '\n');
    }
}

// Create and export default logger instance
const logger = new Logger();
logger.addTransport(new ConsoleTransport());
logger.addTransport(new FileTransport());

module.exports = {
    Logger,
    ConsoleTransport,
    FileTransport,
    logger
}; 