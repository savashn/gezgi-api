import { drizzle } from "drizzle-orm/vercel-postgres";
import { Router, Request, Response } from "express";
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
	// Tourists,
	Tours,
	Vehicles,
} from "../db/schemas";
import { eq } from "drizzle-orm";
import { admin } from "../middlewares/authenticator";

const router = Router();
const db = drizzle();

// POST İŞLEMİ YAPMADAN ÖNCE GÖRÜNECEK OLANDIR

router.get("/team", admin, async (req: Request, res: Response) => {
	const tours = await db.select().from(Tours);

	const guides = await db.select().from(Guides);

	const airports = await db.select().from(Airports);

	res.send({ tours, guides, airports });
});

// router.get("/team", admin, async (req: Request, res: Response) => { // BU YALNIZCA YENİ TURİST EKLERKEN Mİ ACABA
// 	const tourists = await db
// 		.select({
// 			id: Tourists.id,
// 			passportNo: Tourists.passportNo,
// 		})
// 		.from(Tourists);

// 	res.send(tourists);
// });

router.get("/activity", admin, async (req: Request, res: Response) => {
	const housing = await db
		.select({
			id: Housings.id,
			city: Cities.city,
		})
		.from(Housings)
		.innerJoin(Cities, eq(Housings.cityId, Cities.id));

	const restaurant = await db
		.select({
			id: Restaurants.id,
			restaurants: Restaurants.restaurant,
			city: Cities.city,
		})
		.from(Restaurants)
		.innerJoin(Cities, eq(Restaurants.cityId, Cities.id));

	const vehicles = await db
		.select({
			id: Vehicles.id,
			company: Vehicles.company,
		})
		.from(Vehicles);

	const airports = await db.select().from(Airports);

	const response = {
		housing,
		restaurant,
		vehicles,
		airports,
	};

	res.send(response);
});

router.get("/tourist", admin, async (req: Request, res: Response) => {
	const genders = await db.select().from(Genders);
	const nationalities = await db.select().from(Nationalities);
	const currencies = await db.select().from(Currencies);
	const paymentMethods = await db.select().from(PaymentMethods);

	const response = { genders, nationalities, currencies, paymentMethods };

	res.send(response);
});

router.get("/guides", admin, async (req: Request, res: Response) => {
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
				isAdmin: Guides.isAdmin,
			})
			.from(Guides)
			.innerJoin(Languages, eq(Guides.languageId, Languages.id))
			.innerJoin(Nationalities, eq(Guides.nationalityId, Nationalities.id)),
	]);

	res.send({ languages, nationalities, guides });
});

router.get("/restaurants", admin, async (req: Request, res: Response) => {
	const cities = await db.select().from(Cities);
	const restaurants = await db
		.select({
			id: Restaurants.id,
			restaurant: Restaurants.restaurant,
			city: Cities.city,
			cityId: Restaurants.cityId,
			district: Restaurants.district,
			address: Restaurants.address,
			officer: Restaurants.officer,
			contactOfficer: Restaurants.contactOfficer,
			contactRestaurant: Restaurants.contactRestaurant,
		})
		.from(Restaurants)
		.innerJoin(Cities, eq(Restaurants.cityId, Cities.id));

	const response = { cities, restaurants };

	res.send(response);
});

router.get("/housings", admin, async (req: Request, res: Response) => {
	const cities = await db.select().from(Cities);
	const housings = await db
		.select({
			id: Housings.id,
			housing: Housings.housing,
			city: Cities.city,
			cityId: Housings.cityId,
			district: Housings.district,
			address: Housings.address,
			officer: Housings.officer,
			contactOfficer: Housings.contactOfficer,
			contactHousing: Housings.contactHousing,
		})
		.from(Housings)
		.innerJoin(Cities, eq(Housings.cityId, Cities.id));

	const response = { cities, housings };

	res.send(response);
});

router.get("/tours", admin, async (req: Request, res: Response) => {
	const [cities, tours] = await Promise.all([
		db.select().from(Cities),
		db
			.select({
				id: Tours.id,
				tour: Tours.tour,
				city: Cities.city,
				cityId: Tours.cityId,
				numberOfDays: Tours.numberOfDays,
				numberOfNights: Tours.numberOfNights,
			})
			.from(Tours)
			.innerJoin(Cities, eq(Tours.cityId, Cities.id)),
	]);

	res.send({ cities, tours });
});

router.get("/vehicles", admin, async (req: Request, res: Response) => {
	const vehicles = await db.select().from(Vehicles);
	res.send(vehicles);
});

// BASICS:

router.get("/cities", admin, async (req: Request, res: Response) => {
	const cities = await db
		.select({
			id: Cities.id,
			value: Cities.city,
		})
		.from(Cities);
	res.send(cities);
});

router.get("/nationalities", admin, async (req: Request, res: Response) => {
	const nationalities = await db
		.select({
			id: Nationalities.id,
			value: Nationalities.nationality,
		})
		.from(Nationalities);
	res.send(nationalities);
});

router.get("/currencies", admin, async (req: Request, res: Response) => {
	const currencies = await db
		.select({
			id: Currencies.id,
			value: Currencies.currency,
		})
		.from(Currencies);
	res.send(currencies);
});

router.get("/airports", admin, async (req: Request, res: Response) => {
	const airports = await db
		.select({
			id: Airports.id,
			value: Airports.airport,
		})
		.from(Airports);
	res.send(airports);
});

router.get("/languages", admin, async (req: Request, res: Response) => {
	const languages = await db
		.select({
			id: Languages.id,
			value: Languages.language,
		})
		.from(Languages);

	res.send(languages);
});

router.get("/payment-methods", admin, async (req: Request, res: Response) => {
	const paymentMethods = await db
		.select({
			id: PaymentMethods.id,
			value: PaymentMethods.method,
		})
		.from(PaymentMethods);

	res.send(paymentMethods);
});

router.get("/genders", admin, async (req: Request, res: Response) => {
	const genders = await db
		.select({
			id: Genders.id,
			value: Genders.gender,
		})
		.from(Genders);
	res.send(genders);
});

export default router;
