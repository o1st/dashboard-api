import { Logger } from "tslog";

export class LoggerService<T> {
    public logger: Logger<T>;

    constructor() {
        this.logger = new Logger<T>({
            hideLogPositionForProduction: true
        });
    }

    log(...args: unknown[]) {
        this.logger.info(...args);
    }

    error(...args: unknown[]) {
        this.logger.error(...args);
    }

    warn(...args: unknown[]) {
        this.logger.warn(...args);
    }
}
