import request from 'supertest';
import app from '../../api/index';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
// import { eq, InferSelectModel } from "drizzle-orm";
// import { Activities, Teams, TouristsPayments, TouristTeams } from "../db/schemas";
import { Teams } from '../db/schemas';
// import { drizzle } from "drizzle-orm/vercel-postgres";
import { InferSelectModel } from 'drizzle-orm';

// const db = drizzle();

type Team = InferSelectModel<typeof Teams>;

describe('Get all teams', () => {
	it('Should create a team for today', async () => {
		const now = new Date().toISOString();
		const twoDaysLaterDate = new Date();
		twoDaysLaterDate.setDate(twoDaysLaterDate.getDate() + 2);
		const twoDaysLater = twoDaysLaterDate.toISOString();

		const newTeam = {
			team: 'TESTTEAM',
			tourId: 1,
			startsAt: now,
			endsAt: twoDaysLater,
			guideId: 6,
			flightOutwardNo: 'TR123',
			flightOutwardDeparture: '2025-06-01T08:00:00Z',
			flightOutwardDepartureAirport: 2,
			flightOutwardLanding: '2025-06-01T12:00:00Z',
			flightOutwardLandingAirport: 3,
			flightReturnNo: 'TR456',
			flightReturnDeparture: '2025-06-10T14:00:00Z',
			flightReturnDepartureAirport: 3,
			flightReturnLanding: '2025-06-10T18:00:00Z',
			flightReturnLandingAirport: 2
		};

		const response = await request(app)
			.post('/post/team')
			.send(newTeam)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
		expect(response.body.tourId).toBe(1);
		expect(response.body).not.toBeNull();
	});

	it('Should return 400 for a request with incomplete data', async () => {
		const incompleteTeam = {
			team: 'TESTTEAM'
		};

		const response = await request(app)
			.post('/post/team')
			.send(incompleteTeam)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(response.status).toBe(400);
		expect(response.body).toHaveProperty('errors');
		expect(response.body).toHaveProperty('success', false);
	});

	it('Should return every team for admin', async () => {
		const response = await request(app)
			.get('/teams')
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toBeGreaterThan(0);

		response.body.forEach((team: Team[]) => {
			expect(team).toHaveProperty('guideSlug');
			expect(team).toHaveProperty('id');
		});
	});

	it('Should return only guide\'s teams', async () => {
		const response = await request(app)
			.get('/teams')
			.set('x-auth-token', process.env.GUIDE_TEST_TOKEN as string);

		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toBeGreaterThan(0);

		response.body.forEach((team: Team[]) => {
			expect(team).not.toHaveProperty('guideSlug');
			expect(team).toHaveProperty('id');
		});
	});

	it('Should return 401 if user is not authenticated', async () => {
		const response = await request(app).get('/teams');
		expect(response.status).toBe(401);
	});

	it('Should delete the team created in test', async () => {
		const response = await request(app)
			.delete('/delete/teams/TESTTEAM')
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(response.status).toBe(204);
	});
});

describe('Get a team only and its activities', () => {
	let testTeamId: number;
	let testTeamSlug: string;
	let testActivityId: number;
	let testTouristId: number;

	beforeAll(async () => {
		const now = new Date().toISOString();
		const twoDaysLaterDate = new Date();
		twoDaysLaterDate.setDate(twoDaysLaterDate.getDate() + 2);
		const twoDaysLater = twoDaysLaterDate.toISOString();

		const testTeam: typeof Teams.$inferInsert = {
			team: 'TESTTEAM',
			tourId: 1,
			startsAt: now,
			endsAt: twoDaysLater,
			guideId: 6,
			flightOutwardNo: 'TR123',
			flightOutwardDeparture: '2025-06-01T08:00:00Z',
			flightOutwardDepartureAirport: 2,
			flightOutwardLanding: '2025-06-01T12:00:00Z',
			flightOutwardLandingAirport: 3,
			flightReturnNo: 'TR456',
			flightReturnDeparture: '2025-06-10T14:00:00Z',
			flightReturnDepartureAirport: 3,
			flightReturnLanding: '2025-06-10T18:00:00Z',
			flightReturnLandingAirport: 2
		};

		const team = await request(app)
			.post('/post/team')
			.send(testTeam)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		testTeamId = team.body.id;
		testTeamSlug = team.body.team;
	});

	it('Should return a team info for a tourist', async () => {
		const response = await request(app).get('/teams/TESTTEAM');

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('id');
		expect(response.body).toHaveProperty('team');
		expect(response.body).toHaveProperty('guide');
		expect(response.body).toHaveProperty('flightOutwardDepartureAirport');
		expect(response.body).toHaveProperty('flightOutwardDeparture');
		expect(response.body).toHaveProperty('flightReturnLandingAirport');
	});

	it('Should return 404 for an invalid slug', async () => {
		const response = await request(app).get('/teams/unknown');

		expect(response.status).toBe(404);
		expect(response.text).toBe('Not found');
	});

	it('Should create a new activity', async () => {
		const now = new Date().toISOString();

		const testActivity = {
			activity: 'Test Activity',
			teamId: testTeamId,
			activityTime: now,
			hotelId: 1
		};

		const res = await request(app)
			.post('/post/activity')
			.send(testActivity)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('id');
		testActivityId = res.body.id;
	});

	it('Should delete the test activity', async () => {
		const res = await request(app)
			.delete(`/delete/teams/${testTeamSlug}/activity/${testActivityId}`)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(res.status).toBe(204);
	});

	it('Should create a new tourist', async () => {
		const testTourist = {
			name: 'Test Tourist',
			birth: '2000-10-10',
			genderId: 1,
			nationalityId: 1,
			passportNo: 'PASS123123',
			email: 'example@example.com',
			phone: '55555',
			address: 'test address',
			intimate: 'test intimate',
			intimacy: 'test intimacy',
			intimatePhone: '4444',
			teamId: testTeamId,
			isMissing: true,
			amount: 200,
			currencyId: 1,
			paymentMethodId: 1,
			isPayed: false
		};

		const res = await request(app)
			.post('/post/tourist')
			.send(testTourist)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('tourist');
		expect(res.body).toHaveProperty('team');
		expect(res.body).toHaveProperty('payment');

		testTouristId = res.body.tourist.id;
	});

	it('Should add a new tourist to existing team, but shouldn\'t create a new one', async () => {
		const testTourist = {
			// id: testTouristId,  bu sorun oluyor, bunun yerine baştan bir gezgin daha eklemek gerek
			id: 1,
			teamId: testTeamId,
			isMissing: false,
			amount: 200,
			currencyId: 1,
			paymentMethodId: 1,
			isPayed: true
		};

		const res = await request(app)
			.post('/post/tourist')
			.send(testTourist)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(res.status).toBe(201);
		expect(res.body).toHaveProperty('tourist');
		expect(res.body).toHaveProperty('team');
		expect(res.body).toHaveProperty('payment');
	});

	it('Should delete the test tourist', async () => {
		const res = await request(app)
			.delete(`/delete/teams/${testTeamSlug}/tourist/${testTouristId}`)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);

		expect(res.status).toBe(204);
	});

	afterAll(async () => {
		await request(app)
			.delete(`/delete/team/${testTeamSlug}`)
			.set('x-auth-token', process.env.ADMIN_TEST_TOKEN as string);
	});
});
