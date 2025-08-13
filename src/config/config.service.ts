import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.service.interface';
import { TYPES } from '../types';
import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import 'reflect-metadata';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;

	constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {
		const result: DotenvConfigOutput = config();

		if (result.error) {
			this.logger.error('Failed to load .env file');
		} else {
			this.logger.log('.env file loaded successfully');
			this.config = result.parsed;
		}
	}

	get(key: string): string {
		return this.config[key];
	}
}
