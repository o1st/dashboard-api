import { Logger } from 'tslog';
import { ILogger } from './logger.service.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class LoggerService<T> implements ILogger {
	public logger: Logger<T>;

	constructor() {
		this.logger = new Logger<T>({
			hideLogPositionForProduction: true,
		});
	}

	log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
