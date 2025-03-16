import { Router, Request, Response } from "express";
import { drizzle } from "drizzle-orm/vercel-postgres";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { admin } from "../middlewares/authenticator";
import { z } from "zod";
import { activitySchema, guideSchema, loginSchema, teamSchema, touristSchema, tourSchema } from "../schemas/postSchemas";
import validator from "../middlewares/validator";
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
	Vehicles,
} from "../db/schemas";

const router = Router();
const db = drizzle();

router.post("/team", validator(teamSchema), admin, async (req: Request, res: Response) => {
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
		flightReturnLandingAirport,
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
		flightReturnLandingAirport,
	};

	const response = await db.insert(Teams).values(theTeam).returning();
	res.status(201).send(response[0]);
});

router.post("/activity", validator(activitySchema), admin, async (req: Request, res: Response) => {
	const activity: typeof Activities.$inferInsert = {
		activity: req.body.activity,
		teamId: req.body.teamId,
		activityTime: req.body.activityTime,
		hotelId: req.body.hotelId,
		plateOfVehicle: req.body.plateOfVehicle,
		companyOfVehicle: req.body.companyOfVehicle,
		contactOfDriver: req.body.contactOfDriver,
		restaurantId: req.body.restaurantId,
		airportId: req.body.airportId,
	};

	const response = await db.insert(Activities).values(activity).returning({ id: Activities.id });

	res.status(201).json({ id: response[0].id });
});

router.post("/tourist", validator(touristSchema), admin, async (req: Request, res: Response) => {
	let tourist;

	const existingTourist = await db
		.select({
			id: Tourists.id,
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
			intimatePhone: req.body.intimatePhone,
		};

		const tourists = await db.insert(Tourists).values(touristModel).returning();
		tourist = tourists[0];
	} else {
		tourist = {
			id: existingTourist[0].id,
		};
	}

	const teamModel: typeof TouristTeams.$inferInsert = {
		teamId: req.body.teamId,
		touristId: tourist.id,
	};

	await db.insert(TouristTeams).values(teamModel);

	const touristPayment: typeof TouristsPayments.$inferInsert = {
		teamId: req.body.teamId,
		touristId: tourist.id,
		amount: req.body.amount,
		currencyId: req.body.currencyId,
		paymentMethodId: req.body.paymentMethodId,
		isPayed: req.body.isPayed,
	};

	await db.insert(TouristsPayments).values(touristPayment);

	res.status(201).send("Success!");
});

router.post("/guide", validator(guideSchema), admin, async (req: Request, res: Response) => {
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
		isAdmin: req.body.isAdmin,
	};

	await db.insert(Guides).values(guide);

	res.status(201).json({ success: true });
});

router.post("/login", validator(loginSchema), async (req: Request, res: Response) => {
	const user = await db
		.select({
			id: Guides.id,
			name: Guides.name,
			username: Guides.username,
			password: Guides.password,
			isAdmin: Guides.isAdmin,
		})
		.from(Guides)
		.where(eq(Guides.username, req.body.username))
		.limit(1);

	if (user.length === 0 || !(await bcrypt.compare(req.body.password, user[0].password))) {
		res.status(400).send("Invalid username or password");
		return;
	}

	const token: string = jwt.sign({ id: user[0].id, name: user[0].name, isAdmin: user[0].isAdmin }, process.env.JWT_SECRET as string, {
		expiresIn: "1d",
	});

	res.status(200).send(token);
});

router.post("/city", admin, async (req: Request, res: Response) => {
	if (req.user?.isAdmin === false) {
		res.status(400).send("Not allowed");
		return;
	}

	const city: typeof Cities.$inferInsert = {
		city: req.body.city,
	};

	const response = await db.insert(Cities).values(city);

	res.send(response);
});

router.post("/restaurant", admin, async (req: Request, res: Response) => {
	const restaurant: typeof Restaurants.$inferInsert = {
		restaurant: req.body.restaurant,
		cityId: req.body.cityId,
		district: req.body.district,
		address: req.body.address,
		officer: req.body.officer,
		contactOfficer: req.body.contactOfficer,
		contactRestaurant: req.body.contactRestaurant,
	};

	const response = await db.insert(Restaurants).values(restaurant);

	res.send(response);
});

router.post("/housing", admin, async (req: Request, res: Response) => {
	const housing: typeof Housings.$inferInsert = {
		housing: req.body.housing,
		cityId: req.body.cityId,
		district: req.body.district,
		address: req.body.address,
		officer: req.body.officer,
		contactOfficer: req.body.contactOfficer,
		contactHousing: req.body.contactHousing,
	};

	const response = await db.insert(Housings).values(housing);

	res.send(response);
});

router.post("/vehicle", admin, async (req: Request, res: Response) => {
	const vehicle: typeof Vehicles.$inferInsert = {
		company: req.body.company,
		contactCompany: req.body.contactCompany,
		officer: req.body.officer,
		contactOfficer: req.body.contactOfficer,
	};

	const response = await db.insert(Vehicles).values(vehicle);

	res.send(response);
});

router.post("/nationality", admin, async (req: Request, res: Response) => {
	const nationality: typeof Nationalities.$inferInsert = {
		nationality: req.body.nationality,
	};

	const response = await db.insert(Nationalities).values(nationality);

	res.send(response);
});

router.post("/currency", admin, async (req: Request, res: Response) => {
	const currency: typeof Currencies.$inferInsert = {
		currency: req.body.currency,
	};

	const response = await db.insert(Currencies).values(currency);

	res.send(response);
});

router.post("/airport", admin, async (req: Request, res: Response) => {
	const airport: typeof Airports.$inferInsert = {
		airport: req.body.airport,
	};

	const response = await db.insert(Airports).values(airport);

	res.send(response);
});

router.post("/language", admin, async (req: Request, res: Response) => {
	const language: typeof Languages.$inferInsert = {
		language: req.body.language,
	};

	const response = await db.insert(Languages).values(language);

	res.send(response);
});

router.post("/tour", validator(tourSchema), admin, async (req: Request, res: Response) => {
	const tour: typeof Tours.$inferInsert = {
		tour: req.body.tour,
		cityId: req.body.cityId,
		numberOfDays: req.body.numberOfDays,
		numberOfNights: req.body.numberOfNights,
	};

	await db.insert(Tours).values(tour);

	res.json({ success: true });
});

router.post("/payment-method", admin, async (req: Request, res: Response) => {
	const method: typeof PaymentMethods.$inferInsert = {
		method: req.body.method,
	};

	const newMethod = await db.insert(PaymentMethods).values(method).returning();

	res.send(newMethod[0]);
});

router.post("/gender", admin, async (req: Request, res: Response) => {
	const genderSchema = z.string();
	genderSchema.parse(req.body.gender);

	const gender: typeof Genders.$inferInsert = {
		gender: req.body.gender,
	};

	const newGender = await db.insert(Genders).values(gender).returning();

	res.send(newGender[0]);
});

export default router;
