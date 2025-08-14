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

	test('login successful', async () => {
		const response = await request(application.app).post('/users/login').send({
			email: 'test22@mail.ru',
			password: 'somepass',
		});

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('token');
		expect(response.body.token).toBeDefined();
	});

	test('login failed', async () => {
		const response = await request(application.app).post('/users/login').send({
			email: 'test24@mail.ru',
			password: 'wrongpassword',
		});

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty('err');
		expect(response.body.err).toBeDefined();
	});

	test('info successful', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'test22@mail.ru',
			password: 'somepass',
		});

		const response = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.token}`);

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty('email');
		expect(response.body.email).toBe('test22@mail.ru');
	});

	test('info failed', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'test22@mail.ru',
			password: 'somepass',
		});

		const response = await request(application.app)
			.get('/users/info')
			.set('Authorization', `Bearer ${login.body.token}1`);

		expect(response.statusCode).toBe(401);
		expect(response.body).toHaveProperty('err');
		expect(response.body.err).toBeDefined();
	});
});
