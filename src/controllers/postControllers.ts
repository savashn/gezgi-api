import { Request, Response } from 'express';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
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
	TouristTeams,
	Tours,
	Vehicles
} from '../db/schemas';

const db = drizzle();

export const postTeam = async (req: Request, res: Response): Promise<void> => {
	const {
		team,
		tourId,
		startsAt,
		endsAt,
		guideId,
		flightOutwardNo,
		flightOutwardDeparture,
		flightOutwardDepartureAirport,
		flightOutwardLanding,
		flightOutwardLandingAirport,
		flightReturnNo,
		flightReturnDeparture,
		flightReturnDepartureAirport,
		flightReturnLanding,
		flightReturnLandingAirport
	} = req.body;

	const theTeam: typeof Teams.$inferInsert = {
		team,
		tourId,
		startsAt,
		endsAt,
		guideId,
		flightOutwardNo,
		flightOutwardDeparture,
		flightOutwardDepartureAirport,
		flightOutwardLanding,
		flightOutwardLandingAirport,
		flightReturnNo,
		flightReturnDeparture,
		flightReturnDepartureAirport,
		flightReturnLanding,
		flightReturnLandingAirport
	};

	const response = await db.insert(Teams).values(theTeam).returning();
	res.status(201).send(response[0]);
};

export const postActivity = async (req: Request, res: Response): Promise<void> => {
	const activity: typeof Activities.$inferInsert = {
		activity: req.body.activity,
		teamId: req.body.teamId,
		activityTime: req.body.activityTime,
		hotelId: req.body.hotelId,
		plateOfVehicle: req.body.plateOfVehicle,
		companyOfVehicle: req.body.companyOfVehicleId,
		contactOfDriver: req.body.contactOfDriver,
		restaurantId: req.body.restaurantId,
		airportId: req.body.airportId
	};

	const response = await db.insert(Activities).values(activity).returning({ id: Activities.id });
	res.status(201).json({ id: response[0].id });
};

export const postTourist = async (req: Request, res: Response): Promise<void> => {
	let tourist;

	const existingTourist = await db
		.select({
			id: Tourists.id
		})
		.from(Tourists)
		.where(eq(Tourists.passportNo, req.body.passportNo));

	if (existingTourist.length === 0) {
		const touristModel: typeof Tourists.$inferInsert = {
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
		};

		const tourists = await db.insert(Tourists).values(touristModel).returning();
		tourist = tourists[0];
	} else {
		tourist = {
			id: existingTourist[0].id
		};
	}

	const teamModel: typeof TouristTeams.$inferInsert = {
		teamId: req.body.teamId,
		touristId: tourist.id
	};

	await db.insert(TouristTeams).values(teamModel);

	const touristPayment: typeof TouristsPayments.$inferInsert = {
		teamId: req.body.teamId,
		touristId: tourist.id,
		amount: req.body.amount,
		currencyId: req.body.currencyId,
		paymentMethodId: req.body.paymentMethodId,
		isPayed: req.body.isPayed
	};

	await db.insert(TouristsPayments).values(touristPayment);

	res.status(201).send('Success!');
};

export const postGuide = async (req: Request, res: Response): Promise<void> => {
	const hashedPassword = await bcrypt.hash(req.body.password, 10);

	const guide: typeof Guides.$inferInsert = {
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
	};

	await db.insert(Guides).values(guide);

	res.status(201).json({ success: true });
};

export const login = async (req: Request, res: Response): Promise<void> => {
	const user = await db
		.select({
			id: Guides.id,
			name: Guides.name,
			username: Guides.username,
			password: Guides.password,
			isAdmin: Guides.isAdmin
		})
		.from(Guides)
		.where(eq(Guides.username, req.body.username))
		.limit(1);

	if (user.length === 0 || !(await bcrypt.compare(req.body.password, user[0].password))) {
		res.status(400).send('Invalid username or password');
		return;
	}

	const token: string = jwt.sign(
		{ id: user[0].id, name: user[0].name, isAdmin: user[0].isAdmin },
		process.env.JWT_SECRET as string,
		{
			expiresIn: '1d'
		}
	);

	res.status(200).send(token);
};

export const postCity = async (req: Request, res: Response): Promise<void> => {
	const city: typeof Cities.$inferInsert = {
		city: req.body.value
	};

	const response = await db.insert(Cities).values(city);

	res.send(response);
};

export const postRestaurant = async (req: Request, res: Response): Promise<void> => {
	const restaurant: typeof Restaurants.$inferInsert = {
		restaurant: req.body.restaurant,
		cityId: req.body.cityId,
		district: req.body.district,
		address: req.body.address,
		officer: req.body.officer,
		contactOfficer: req.body.contactOfficer,
		contactRestaurant: req.body.contactRestaurant
	};

	const response = await db.insert(Restaurants).values(restaurant);

	res.send(response);
};

export const postHousing = async (req: Request, res: Response): Promise<void> => {
	const housing: typeof Housings.$inferInsert = {
		housing: req.body.housing,
		cityId: req.body.cityId,
		district: req.body.district,
		address: req.body.address,
		officer: req.body.officer,
		contactOfficer: req.body.contactOfficer,
		contactHousing: req.body.contactHousing
	};

	const response = await db.insert(Housings).values(housing);

	res.send(response);
};

export const postVehicle = async (req: Request, res: Response): Promise<void> => {
	const vehicle: typeof Vehicles.$inferInsert = {
		company: req.body.company,
		contactCompany: req.body.contactCompany,
		officer: req.body.officer,
		contactOfficer: req.body.contactOfficer
	};

	const response = await db.insert(Vehicles).values(vehicle);

	res.send(response);
};

export const postNationality = async (req: Request, res: Response): Promise<void> => {
	const nationality: typeof Nationalities.$inferInsert = {
		nationality: req.body.value
	};

	const response = await db.insert(Nationalities).values(nationality);

	res.send(response);
};

export const postCurrency = async (req: Request, res: Response): Promise<void> => {
	const currency: typeof Currencies.$inferInsert = {
		currency: req.body.value
	};

	const response = await db.insert(Currencies).values(currency);

	res.send(response);
};

export const postAirport = async (req: Request, res: Response): Promise<void> => {
	const airport: typeof Airports.$inferInsert = {
		airport: req.body.value
	};

	const response = await db.insert(Airports).values(airport);

	res.send(response);
};

export const postLanguage = async (req: Request, res: Response): Promise<void> => {
	const language: typeof Languages.$inferInsert = {
		language: req.body.value
	};

	const response = await db.insert(Languages).values(language);

	console.log(response);
	console.log(req.body);

	res.send(response);
};

export const postTour = async (req: Request, res: Response): Promise<void> => {
	const tour: typeof Tours.$inferInsert = {
		tour: req.body.tour,
		cityId: req.body.cityId,
		numberOfDays: req.body.numberOfDays,
		numberOfNights: req.body.numberOfNights
	};

	await db.insert(Tours).values(tour);

	res.json({ success: true });
};

export const postPaymentMethod = async (req: Request, res: Response): Promise<void> => {
	const method: typeof PaymentMethods.$inferInsert = {
		method: req.body.value
	};

	const newMethod = await db.insert(PaymentMethods).values(method).returning();

	res.send(newMethod[0]);
};

export const postGender = async (req: Request, res: Response): Promise<void> => {
	const gender: typeof Genders.$inferInsert = {
		gender: req.body.value
	};

	const newGender = await db.insert(Genders).values(gender).returning();

	res.send(newGender[0]);
};
