// Enhanced Logging System
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];

  private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
    return {
      level,
      message,
      timestamp: new Date(),
      context,
      error
    };
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : '';
    const errorStr = entry.error ? ` | Error: ${entry.error.message}` : '';
    
    return `[${timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${contextStr}${errorStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment && level === 'debug') {
      return false;
    }
    return true;
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createLogEntry('info', message, context);
    this.logs.push(entry);
    console.info(this.formatMessage(entry));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createLogEntry('warn', message, context);
    this.logs.push(entry);
    console.warn(this.formatMessage(entry));
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createLogEntry('error', message, context, error);
    this.logs.push(entry);
    console.error(this.formatMessage(entry));
    
    // In production, you might want to send this to an external service
    if (!this.isDevelopment) {
      this.sendToExternalService(entry);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createLogEntry('debug', message, context);
    this.logs.push(entry);
    console.debug(this.formatMessage(entry));
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // Placeholder for external logging service integration
    // This could be Sentry, LogRocket, or any other service
    try {
      // await externalLoggingService.send(entry);
    } catch (error) {
      console.error('Failed to send log to external service:', error);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = new Logger();