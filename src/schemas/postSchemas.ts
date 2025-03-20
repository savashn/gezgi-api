import { z } from 'zod';

export const loginSchema = z.object({
	username: z.string(),
	password: z.string()
});

export const guideSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.'
	}),
	username: z.string().min(2, {
		message: 'Username must be at least 2 characters.'
	}),
	email: z
		.string()
		.email({ message: 'Invalid email address' })
		.min(5, { message: 'Email must be 8 or more characters long' }),
	phone: z.string(),
	passportNo: z.string().min(6, {
		message: 'Passport number must be at least 6 characters.'
	}),
	birth: z.string().min(10, {
		message: 'Birth date must be at least 10 characters.'
	}),
	nationalityId: z.number(),
	languageId: z.number(),
	intimate: z.string().min(2, {
		message: 'Intimate must be at least 2 characters.'
	}),
	intimatePhone: z.string(),
	intimacy: z.string().min(2, {
		message: 'Intimacy must be at least 2 characters.'
	}),
	isAdmin: z.boolean(),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters'
	}),
	rePassword: z.string().min(8, {
		message: 'Password must be at least 8 characters'
	})
});

export const tourSchema = z.object({
	tour: z.string(),
	cityId: z.number(),
	numberOfDays: z.number(),
	numberOfNights: z.number()
});

export const teamSchema = z.object({
	team: z.string().min(1, 'Team name cannot be empty'),
	tourId: z.number().int(),
	startsAt: z.string(),
	endsAt: z.string(),
	guideId: z.number().int().positive('Type a valid positive number'),
	flightOutwardNo: z.string().optional(),
	flightOutwardDeparture: z.string().optional(),
	flightOutwardDepartureAirport: z.number().optional(),
	flightOutwardLanding: z.string().optional(),
	flightOutwardLandingAirport: z.number().optional(),
	flightReturnNo: z.string().optional(),
	flightReturnDeparture: z.string().optional(),
	flightReturnDepartureAirport: z.number().optional(),
	flightReturnLanding: z.string().optional(),
	flightReturnLandingAirport: z.number().optional()
});

export const activitySchema = z.object({
	activity: z.string(),
	activityTime: z.string(),
	teamId: z.number().int(),
	hotelId: z.number().int().optional(),
	plateOfVehicleId: z.number().int().optional(),
	contactOfDriver: z.string().optional(),
	companyOfVehicle: z.number().int().optional(),
	restaurantId: z.number().int().optional(),
	airportId: z.number().int().optional()
});

export const touristSchema = z.object({
	name: z.string().optional(),
	birth: z.string().date().optional(),
	genderId: z.number().int().optional(),
	nationalityId: z.number().int().optional(),
	passportNo: z.string().min(6).optional(),
	email: z
		.string()
		.email({ message: 'Invalid email address' })
		.min(5, { message: 'Email must be 8 or more characters long' })
		.optional(),
	phone: z.string().optional(),
	address: z.string().optional(),
	intimate: z.string().optional(),
	intimacy: z.string().optional(),
	intimatePhone: z.string().optional(),
	teamId: z.number().int().positive(),
	amount: z.number().int().positive(),
	currencyId: z.number().int().positive(),
	paymentMethodId: z.number().int().positive(),
	isPayed: z.boolean()
});
