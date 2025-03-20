import { Request, Response } from 'express';
import {
	Activities,
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
	Teams,
	Tourists,
	TouristsPayments,
	Tours,
	Vehicles
} from '../db/schemas';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const db = drizzle();

export const putTeam = async (req: Request, res: Response): Promise<void> => {
	const updatedTeam = await db
		.update(Teams)
		.set({
			team: req.body.team,
			tourId: req.body.tourId,
			startsAt: req.body.startsAt,
			endsAt: req.body.endsAt,
			guideId: req.body.guideId,
			flightOutwardNo: req.body.flightOutwardNo,
			flightOutwardDeparture: req.body.flightOutwardDeparture,
			flightOutwardDepartureAirport: req.body.flightOutwardDepartureAirport,
			flightOutwardLanding: req.body.flightOutwardLanding,
			flightOutwardLandingAirport: req.body.flightOutwardLandingAirport,
			flightReturnNo: req.body.flightReturnNo,
			flightReturnDeparture: req.body.flightReturnDeparture,
			flightReturnDepartureAirport: req.body.flightReturnDepartureAirport,
			flightReturnLanding: req.body.flightReturnLanding,
			flightReturnLandingAirport: req.body.flightReturnLandingAirport
		})
		.where(eq(Teams.team, req.params.slug))
		.returning();

	if (updatedTeam.length === 0) {
		console.log('An error occured while updating team');
		res.status(500).send('An error occured while updating team');
		return;
	}

	res.send('The team has been updated successfuly!');
};

export const putActivities = async (req: Request, res: Response): Promise<void> => {
	const id: number = parseInt(req.params.id, 10);

	await db
		.update(Activities)
		.set({
			activity: req.body.activity,
			activityTime: req.body.activityTime,
			hotelId: req.body.hotelId,
			plateOfVehicle: req.body.plateIfVehicle,
			contactOfDriver: req.body.contactOfDriver,
			companyOfVehicle: req.body.companyOfVehicle,
			restaurantId: req.body.restaurantId,
			airportId: req.body.airportId
		})
		.where(eq(Activities.id, id));

	res.send('The activity has been updated successfully');
};

export const putTourists = async (req: Request, res: Response): Promise<void> => {
	const id: number = parseInt(req.params.id, 10);

	await Promise.all([
		db
			.update(Tourists)
			.set({
				name: req.body.name,
				birth: req.body.birth,
				genderId: req.body.genderId,
				nationalityId: req.body.nationalityId,
				passportNo: req.body.passportNo,
				email: req.body.email,
				phone: req.body.phone,
				address: req.body.address,
				intimate: req.body.intimate,
				intimacy: req.body.intimacy,
				intimatePhone: req.body.intimatePhone
			})
			.where(eq(Tourists.id, id)),

		db
			.update(TouristsPayments)
			.set({
				amount: req.body.amount,
				isPayed: req.body.isPayed,
				currencyId: req.body.currencyId
			})
			.where(eq(TouristsPayments.touristId, id))
	]);

	res.send('The tourist has been updated successfuly!');
};

export const putGuides = async (req: Request, res: Response): Promise<void> => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	const id: number = parseInt(req.params.id, 10);

	const updated = await db
		.update(Guides)
		.set({
			name: req.body.name,
			username: req.body.username,
			password: hashedPassword,
			languageId: req.body.languageId,
			birth: req.body.birth,
			nationalityId: req.body.nationalityId,
			passportNo: req.body.passportNo,
			email: req.body.email,
			phone: req.body.phone,
			intimate: req.body.intimate,
			intimacy: req.body.intimacy,
			intimatePhone: req.body.intimatePhone,
			isAdmin: req.body.isAdmin
		})
		.where(eq(Guides.id, id))
		.returning();

	if (updated.length > 0) {
		res.send('The guide has been updated successfuly!');
		return;
	} else {
		res.status(500).send('An error has occured');
		return;
	}
};

export const putTours = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Tours)
		.set({
			tour: req.body.tour,
			cityId: req.body.cityId,
			numberOfDays: req.body.numberOfDays,
			numberOfNights: req.body.numberOfNights
		})
		.where(eq(Tours.id, req.body.id));

	res.send('The tour has been updated successfuly!');
};

export const putCities = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Cities)
		.set({
			city: req.body.city
		})
		.where(eq(Cities.id, req.body.id));

	res.json({ success: true });
};

export const putRestaurants = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Restaurants)
		.set({
			restaurant: req.body.restaurant,
			cityId: req.body.cityId,
			district: req.body.district,
			address: req.body.address,
			officer: req.body.officer,
			contactOfficer: req.body.contactOfficer,
			contactRestaurant: req.body.contactRestaurant
		})
		.where(eq(Restaurants.id, req.body.id));

	res.send('The restaurant has been updated successfully');
};

export const putHousings = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Housings)
		.set({
			housing: req.body.housing,
			cityId: req.body.cityId,
			district: req.body.district,
			address: req.body.address,
			officer: req.body.officer,
			contactOfficer: req.body.contactOfficer,
			contactHousing: req.body.contactHousing
		})
		.where(eq(Housings.id, req.body.id));

	res.send('The housing has been updated successfully');
};

export const putVehicles = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Vehicles)
		.set({
			company: req.body.company,
			contactCompany: req.body.contactCompany,
			officer: req.body.officer,
			contactOfficer: req.body.contactOfficer
		})
		.where(eq(Vehicles.id, req.body.id));

	res.send('The vehicle has been updated successfuly!');
};

export const putNationalities = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Nationalities)
		.set({
			nationality: req.body.nationality
		})
		.where(eq(Nationalities.id, req.body.id));

	res.json({ success: true });
};

export const putCurrencies = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Currencies)
		.set({
			currency: req.body.currency
		})
		.where(eq(Currencies.id, req.body.id));

	res.json({ success: true });
};

export const putAirports = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Airports)
		.set({
			airport: req.body.airport
		})
		.where(eq(Airports.id, req.body.id));

	res.json({ success: true });
};

export const putLanguages = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Languages)
		.set({
			language: req.body.language
		})
		.where(eq(Languages.id, req.body.id));

	res.json({ success: true });
};

export const putGenders = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(Genders)
		.set({
			gender: req.body.gender
		})
		.where(eq(Genders.id, req.body.id));

	res.json({ success: true });
};

export const putPaymentMethods = async (req: Request, res: Response): Promise<void> => {
	await db
		.update(PaymentMethods)
		.set({
			method: req.body.method
		})
		.where(eq(PaymentMethods.id, req.body.id));

	res.json({ success: true });
};
