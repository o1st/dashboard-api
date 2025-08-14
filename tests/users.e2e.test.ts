import { App } from '../src/app';
import { bootstrapResult } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await bootstrapResult;
	application = app;
});

afterAll(() => {
	application.close();
});

describe('Users E2E', () => {
	test('creates user failed', async () => {
		const response = await request(application.app).post('/users/register').send({
			email: 'test@example.com',
			password: 'password',
		});

		expect(response.statusCode).toBe(422);
	});
});
