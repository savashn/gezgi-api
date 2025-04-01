import { Request, Response } from 'express';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import {
	Airports,
	Cities,
	Currencies,
	Genders,
	Guides,
	Housings,
	Languages,
	Nationalities,
	PaymentMethods,
	Restaurants,
	Tours,
	Vehicles
} from '../db/schemas';
import { eq } from 'drizzle-orm';

const db = drizzle();

export const adminTeam = async (req: Request, res: Response): Promise<void> => {
	const [tours, guides, airports] = await Promise.all([
		db.select().from(Tours),
		db.select().from(Guides),
		db.select().from(Airports)
	]);

	res.send({ tours, guides, airports });
};

export const adminActivity = async (req: Request, res: Response): Promise<void> => {
	const [housing, restaurant, vehicles, airports] = await Promise.all([
		db
			.select({
				id: Housings.id,
				city: Cities.city
			})
			.from(Housings)
			.innerJoin(Cities, eq(Housings.cityId, Cities.id)),

		db
			.select({
				id: Restaurants.id,
				restaurants: Restaurants.restaurant,
				city: Cities.city
			})
			.from(Restaurants)
			.innerJoin(Cities, eq(Restaurants.cityId, Cities.id)),

		db
			.select({
				id: Vehicles.id,
				company: Vehicles.company
			})
			.from(Vehicles),

		db.select().from(Airports)
	]);

	const response = {
		housing,
		restaurant,
		vehicles,
		airports
	};

	res.send(response);
};

export const adminTourist = async (req: Request, res: Response): Promise<void> => {
	const [genders, nationalities, currencies, paymentMethods] = await Promise.all([
		db.select().from(Genders),
		db.select().from(Nationalities),
		db.select().from(Currencies),
		db.select().from(PaymentMethods)
	]);

	const response = { genders, nationalities, currencies, paymentMethods };

	res.send(response);
};

export const adminGuides = async (req: Request, res: Response): Promise<void> => {
	const [languages, nationalities, guides] = await Promise.all([
		db.select().from(Languages),
		db.select().from(Nationalities),
		db
			.select({
				id: Guides.id,
				name: Guides.name,
				username: Guides.username,
				language: Languages.language,
				languageId: Languages.id,
				email: Guides.email,
				phone: Guides.phone,
				passportNo: Guides.passportNo,
				nationality: Nationalities.nationality,
				nationalityId: Nationalities.id,
				birth: Guides.birth,
				intimate: Guides.intimate,
				intimacy: Guides.intimacy,
				intimatePhone: Guides.intimatePhone,
				isAdmin: Guides.isAdmin
			})
			.from(Guides)
			.innerJoin(Languages, eq(Guides.languageId, Languages.id))
			.innerJoin(Nationalities, eq(Guides.nationalityId, Nationalities.id))
	]);

	res.send({ languages, nationalities, guides });
};

export const adminRestaurants = async (req: Request, res: Response): Promise<void> => {
	const [cities, restaurants] = await Promise.all([
		db.select().from(Cities),
		db
			.select({
				id: Restaurants.id,
				restaurant: Restaurants.restaurant,
				city: Cities.city,
				cityId: Restaurants.cityId,
				district: Restaurants.district,
				address: Restaurants.address,
				officer: Restaurants.officer,
				contactOfficer: Restaurants.contactOfficer,
				contactRestaurant: Restaurants.contactRestaurant
			})
			.from(Restaurants)
			.innerJoin(Cities, eq(Restaurants.cityId, Cities.id))
	]);

	const response = { cities, restaurants };
	res.send(response);
};

export const adminHousings = async (req: Request, res: Response): Promise<void> => {
	const [cities, housings] = await Promise.all([
		db.select().from(Cities),
		db
			.select({
				id: Housings.id,
				housing: Housings.housing,
				city: Cities.city,
				cityId: Housings.cityId,
				district: Housings.district,
				address: Housings.address,
				officer: Housings.officer,
				contactOfficer: Housings.contactOfficer,
				contactHousing: Housings.contactHousing
			})
			.from(Housings)
			.innerJoin(Cities, eq(Housings.cityId, Cities.id))
	]);

	const response = { cities, housings };
	res.send(response);
};

export const adminTours = async (req: Request, res: Response): Promise<void> => {
	const [cities, tours] = await Promise.all([
		db.select().from(Cities),
		db
			.select({
				id: Tours.id,
				tour: Tours.tour,
				city: Cities.city,
				cityId: Tours.cityId,
				numberOfDays: Tours.numberOfDays,
				numberOfNights: Tours.numberOfNights
			})
			.from(Tours)
			.innerJoin(Cities, eq(Tours.cityId, Cities.id))
	]);

	res.send({ cities, tours });
};

export const adminVehicles = async (req: Request, res: Response): Promise<void> => {
	const vehicles = await db.select().from(Vehicles);
	res.send(vehicles);
};

// BASICS:

export const adminCities = async (req: Request, res: Response): Promise<void> => {
	const cities = await db
		.select({
			id: Cities.id,
			value: Cities.city
		})
		.from(Cities);
	res.send(cities);
};

export const adminNationalities = async (req: Request, res: Response): Promise<void> => {
	const nationalities = await db
		.select({
			id: Nationalities.id,
			value: Nationalities.nationality
		})
		.from(Nationalities);
	res.send(nationalities);
};

export const adminCurrencies = async (req: Request, res: Response): Promise<void> => {
	const currencies = await db
		.select({
			id: Currencies.id,
			value: Currencies.currency
		})
		.from(Currencies);
	res.send(currencies);
};

export const adminAirports = async (req: Request, res: Response): Promise<void> => {
	const airports = await db
		.select({
			id: Airports.id,
			value: Airports.airport
		})
		.from(Airports);
	res.send(airports);
};

export const adminLanguages = async (req: Request, res: Response): Promise<void> => {
	const languages = await db
		.select({
			id: Languages.id,
			value: Languages.language
		})
		.from(Languages);

	res.send(languages);
};

export const adminPaymentMethods = async (req: Request, res: Response): Promise<void> => {
	const paymentMethods = await db
		.select({
			id: PaymentMethods.id,
			value: PaymentMethods.method
		})
		.from(PaymentMethods);

	res.send(paymentMethods);
};

export const adminGenders = async (req: Request, res: Response): Promise<void> => {
	const genders = await db
		.select({
			id: Genders.id,
			value: Genders.gender
		})
		.from(Genders);
	res.send(genders);
};
