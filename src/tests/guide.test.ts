import request from 'supertest';
import app from '../../api/index';
import { describe, it, expect } from '@jest/globals';

describe('POST /guide', () => {
	it('Should create a guide', async () => {
		const newGuide = {
			name: 'New Test Guide',
			username: 'newtestguide',
			password: 'newtestguide',
			languageId: 1,
			birth: '2001-02-02',
			nationalityId: 1,
			passportNo: '123123123',
			email: 'example@example.com',
			phone: 555555555,
			intimate: 'test intimate',
			intimacy: 'testing intimacy',
			intimatePhone: 55555555,
			isAdmin: false
		};

		const res = await request(app)
			.post('/post/guide')
			.send(newGuide)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(res.status).toBe(201);
		expect(res.body).toEqual({ success: true });
	});

	it('Should login', async () => {
		const user = {
			username: 'testguide',
			password: 'testguide'
		};

		const res = await request(app).post('/post/login').send(user);

		expect(res.status).toBe(200);
		expect(typeof res.text).toBe('string');
	});

	it('Should delete the guide created in test', async () => {
		const res = await request(app)
			.delete('/delete/guides/newtestguide')
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(res.status).toBe(200);
		expect(res.body).toEqual({
			success: true,
			guide: { name: 'New Test Guide' }
		});
		expect(res.body).toHaveProperty('guide');
		expect(res.body.guide).toHaveProperty('name');
		expect(typeof res.body.guide.name).toBe('string');
	});
});
