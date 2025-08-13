import { inject, injectable } from 'inversify';
// import { PrismaClient } from '../generated/prisma';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.service.interface';
import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.Logger) private logger: ILogger) {
		this.client = new PrismaClient();
	}

	async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('[PrismaService] Successfully connected to Database');
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error('[PrismaService] Express error connecting to Database:', error.message);
			} else {
				this.logger.error('[PrismaService] Error connecting to Database:', error);
			}
			throw error;
		}
	}

	async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
