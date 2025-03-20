import { Request, Response } from 'express';
import {
	Activities,
	Airports,
	Currencies,
	Genders,
	Guides,
	Housings,
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
import { count, desc, gt, gte, lt, lte, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { and, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

const db = drizzle();

export const getTeam = async (req: Request, res: Response): Promise<void> => {
	const OutwardDepartureAirport = alias(Airports, 'flight_outward_departure_airport');
	const OutwardLandingAirport = alias(Airports, 'flight_outward_landing_airport');
	const ReturnDepartureAirport = alias(Airports, 'flight_return_departure_airport');
	const ReturnLandingAirport = alias(Airports, 'flight_return_landing_airport');

	const teams = await db
		.select({
			id: Teams.id,
			team: Teams.team,
			tour: Tours.tour,
			tourId: Tours.id,
			numberOfDays: Tours.numberOfDays,
			numberOfNights: Tours.numberOfNights,
			startsAt: Teams.startsAt,
			endsAt: Teams.endsAt,
			guide: Guides.name,
			guideId: Guides.id,
			guideSlug: Guides.username,
			flightOutwardNo: Teams.flightOutwardNo,
			flightOutwardDeparture: Teams.flightOutwardDeparture,
			flightOutwardDepartureAirport: OutwardDepartureAirport.airport,
			flightOutwardDepartureAirportId: OutwardDepartureAirport.id,
			flightOutwardLanding: Teams.flightOutwardLanding,
			flightOutwardLandingAirport: OutwardLandingAirport.airport,
			flightOutwardLandingAirportId: OutwardLandingAirport.id,
			flightReturnNo: Teams.flightReturnNo,
			flightReturnDeparture: Teams.flightReturnDeparture,
			flightReturnDepartureAirport: ReturnDepartureAirport.airport,
			flightReturnDepartureAirportId: ReturnDepartureAirport.id,
			flightReturnLanding: Teams.flightReturnLanding,
			flightReturnLandingAirport: ReturnLandingAirport.airport,
			flightReturnLandingAirportId: ReturnLandingAirport.id
		})
		.from(Teams)
		.innerJoin(Guides, eq(Teams.guideId, Guides.id))
		.innerJoin(Tours, eq(Teams.tourId, Tours.id))
		.leftJoin(
			OutwardDepartureAirport,
			eq(Teams.flightOutwardDepartureAirport, OutwardDepartureAirport.id)
		)
		.leftJoin(
			OutwardLandingAirport,
			eq(Teams.flightOutwardLandingAirport, OutwardLandingAirport.id)
		)
		.leftJoin(
			ReturnDepartureAirport,
			eq(Teams.flightOutwardLandingAirport, ReturnDepartureAirport.id)
		)
		.leftJoin(ReturnLandingAirport, eq(Teams.flightOutwardLandingAirport, ReturnLandingAirport.id))
		.where(eq(Teams.team, req.params.slug))
		.limit(1);

	const team = teams[0];

	if (!team) {
		res.status(404).send('Not found');
		return;
	}

	const activities = await db
		.select({
			id: Activities.id,
			activity: Activities.activity,
			activityTime: Activities.activityTime,
			teamId: Activities.teamId,
			hotelId: Housings.id,
			hotel: Housings.housing,
			plateOfVehicle: Activities.plateOfVehicle,
			contactOfDriver: Activities.contactOfDriver,
			companyOfVehicleId: Activities.companyOfVehicle,
			companyOfVehicle: Vehicles.company,
			restaurantId: Restaurants.id,
			restaurant: Restaurants.restaurant,
			airportId: Airports.id,
			airport: Airports.airport
		})
		.from(Activities)
		.leftJoin(Housings, eq(Activities.hotelId, Housings.id))
		.leftJoin(Vehicles, eq(Activities.companyOfVehicle, Vehicles.id))
		.leftJoin(Restaurants, eq(Activities.restaurantId, Restaurants.id))
		.leftJoin(Airports, eq(Activities.airportId, Airports.id))
		.where(eq(Activities.teamId, team.id));

	if (!req.user) {
		res.send({ team, activities });
		return;
	}

	if (req.user && req.user.isAdmin === true) {
		const tours = await db.select().from(Tours);
		const guides = await db.select().from(Guides);
		const airports = await db.select().from(Airports);
		const restaurants = await db.select().from(Restaurants);
		const vehicles = await db
			.select({
				id: Vehicles.id,
				company: Vehicles.company
			})
			.from(Vehicles);
		const housings = await db.select().from(Housings);

		res.send({
			team,
			activities,
			tours,
			guides,
			airports,
			restaurants,
			vehicles,
			housings
		});
		return;
	} else if (req.user && req.user.id === team.guideId) {
		res.send({ team, activities });
		return;
	} else {
		res.status(404).send('not found');
		return;
	}
};

export const getTeamActivities = async (req: Request, res: Response): Promise<void> => {
	const teams = await db
		.select({
			id: Teams.id,
			team: Teams.team
		})
		.from(Teams)
		.where(eq(Teams.team, req.params.slug));

	const team = teams[0];

	if (teams.length > 0) {
		const activities = await db
			.select({
				activityId: Activities.id,
				activity: Activities.activity,
				activityTime: Activities.activityTime,
				teamId: Activities.teamId,
				hotel: Housings.housing,
				plateIfVehicle: Activities.plateOfVehicle,
				contactOfDriver: Activities.contactOfDriver,
				companyOfVehicle: Vehicles.company,
				restaurant: Restaurants.restaurant,
				airport: Airports.airport
			})
			.from(Activities)
			.leftJoin(Vehicles, eq(Activities.companyOfVehicle, Vehicles.id))
			.leftJoin(Restaurants, eq(Activities.restaurantId, Restaurants.id))
			.leftJoin(Housings, eq(Activities.hotelId, Housings.id))
			.leftJoin(Airports, eq(Activities.airportId, Airports.id))
			.where(eq(Activities.teamId, team.id));

		const response = { team, activities };
		res.send(response);
		return;
	} else {
		res.status(404).send('not found');
		return;
	}
};

export const getTeamTourists = async (req: Request, res: Response): Promise<void> => {
	if (!req.user) {
		res.send('You are not allowed to see this page');
		return;
	}

	const teams = await db
		.select({
			id: Teams.id,
			team: Teams.team
		})
		.from(Teams)
		.where(eq(Teams.team, req.params.slug));

	const team = teams[0];

	if (teams.length > 0) {
		const tourists = await db
			.select({
				id: Tourists.id,
				name: Tourists.name,
				birth: Tourists.birth,
				genderId: Tourists.genderId,
				gender: Genders.gender,
				nationalityId: Tourists.nationalityId,
				nationality: Nationalities.nationality,
				passportNo: Tourists.passportNo,
				email: Tourists.email,
				phone: Tourists.phone,
				address: Tourists.address,
				intimate: Tourists.intimate,
				intimacy: Tourists.intimacy,
				intimatePhone: Tourists.intimatePhone,
				amount: TouristsPayments.amount,
				isPayed: TouristsPayments.isPayed,
				currency: Currencies.currency,
				currencyId: Currencies.id,
				paymentMethod: PaymentMethods.method,
				paymentMethodId: PaymentMethods.id
			})
			.from(Tourists)
			.leftJoin(TouristTeams, eq(Tourists.id, TouristTeams.touristId))
			.leftJoin(Nationalities, eq(Tourists.nationalityId, Nationalities.id))
			.leftJoin(Genders, eq(Tourists.genderId, Genders.id))
			.leftJoin(
				TouristsPayments,
				and(
					eq(TouristsPayments.touristId, Tourists.id),
					eq(TouristsPayments.teamId, TouristTeams.teamId)
				)
			)
			.leftJoin(PaymentMethods, eq(PaymentMethods.id, TouristsPayments.paymentMethodId))
			.leftJoin(Currencies, eq(Currencies.id, TouristsPayments.currencyId))
			.where(eq(TouristTeams.teamId, team.id));

		if (req.user && req.user.isAdmin === true) {
			const [nationalities, genders, currencies, paymentMethods] = await Promise.all([
				db.select().from(Nationalities),
				db.select().from(Genders),
				db.select().from(Currencies),
				db.select().from(PaymentMethods)
			]);

			res.send({
				team,
				tourists,
				nationalities,
				genders,
				currencies,
				paymentMethods
			});
			return;
		} else {
			res.send({ team, tourists });
			return;
		}
	}
};

export const getGuide = async (req: Request, res: Response): Promise<void> => {
	if (!req.user) {
		res.send('You are not allowed to see this page');
		return;
	}

	if (req.user.isAdmin === true) {
		const guide = await db.select().from(Guides).where(eq(Guides.username, req.params.slug));
		res.send(guide[0]);
		return;
	} else {
		const guide = await db
			.select()
			.from(Guides)
			.where(and(eq(Guides.username, req.params.slug), eq(Guides.id, req.user.id)));

		res.send(guide[0]);
		return;
	}
};

export const getTeams = async (req: Request, res: Response): Promise<void> => {
	if (!req.user) {
		res.status(401).send('You are not allowed to see this page');
		return;
	}

	const today = new Date().toISOString().split('T')[0];

	if (req.user.isAdmin === true) {
		const teams = await db
			.select({
				id: Teams.id,
				team: Teams.team,
				tourId: Teams.tourId,
				tour: Tours.tour,
				tourDays: Tours.numberOfDays,
				tourNights: Tours.numberOfNights,
				startsAt: Teams.startsAt,
				endsAt: Teams.endsAt,
				guideId: Teams.guideId,
				guide: Guides.name,
				guideSlug: Guides.username
			})
			.from(Teams)
			.leftJoin(Tours, eq(Teams.tourId, Tours.id))
			.innerJoin(Guides, eq(Teams.guideId, Guides.id))
			.where(sql`${today} BETWEEN DATE(${Teams.startsAt}) AND DATE(${Teams.endsAt})`);

		if (teams.length === 0) {
			res.status(404).send('Not found.');
			return;
		}

		res.status(200).send(teams);
		return;
	} else {
		const teams = await db
			.select({
				id: Teams.id,
				team: Teams.team,
				tourId: Teams.tourId,
				tour: Tours.tour,
				tourDays: Tours.numberOfDays,
				tourNights: Tours.numberOfNights,
				startsAt: Teams.startsAt,
				endsAt: Teams.endsAt,
				guideId: Teams.guideId
			})
			.from(Teams)
			.leftJoin(Tours, eq(Teams.tourId, Tours.id))
			.where(
				and(
					sql`${today} BETWEEN DATE(${Teams.startsAt}) AND DATE(${Teams.endsAt})`,
					eq(Teams.guideId, req.user.id)
				)
			);

		if (teams.length === 0) {
			res.status(404).send('Not found.');
			return;
		}

		res.status(200).send(teams);
		return;
	}
};

export const getTourist = async (req: Request, res: Response): Promise<void> => {
	const id: number = parseInt(req.params.id, 10);

	const tourists = await db
		.select({
			name: Tourists.name,
			birth: Tourists.birth,
			gender: Genders.gender,
			genderId: Genders.id,
			nationality: Nationalities.nationality,
			nationalityId: Nationalities.id,
			passportNo: Tourists.passportNo,
			email: Tourists.email,
			phone: Tourists.phone,
			address: Tourists.address,
			intimate: Tourists.intimate,
			intimacy: Tourists.intimacy,
			intimatePhone: Tourists.intimatePhone
		})
		.from(Tourists)
		.leftJoin(Genders, eq(Tourists.genderId, Genders.id))
		.leftJoin(Nationalities, eq(Tourists.nationalityId, Nationalities.id))
		.where(eq(Tourists.id, id))
		.limit(1);

	res.send(tourists[0]);
};

export const getTours = async (req: Request, res: Response): Promise<void> => {
	const tours = await db.select().from(Tours);
	res.send(tours);
};

export const getMain = async (req: Request, res: Response): Promise<void> => {
	if (!req.user) {
		res.status(401).send('You are not allowed to see this page');
		return;
	}

	const page = parseInt((req.query.page as string) || '1', 10);
	const pageSize = parseInt((req.query.pageSize as string) || '5', 10);

	const teamCount = await db.select({ count: count() }).from(Teams);

	const totalCount = teamCount[0];

	const teams = await db
		.select({
			id: Teams.id,
			team: Teams.team,
			tourId: Teams.tourId,
			tour: Tours.tour,
			tourDays: Tours.numberOfDays,
			tourNights: Tours.numberOfNights,
			startsAt: Teams.startsAt,
			endsAt: Teams.endsAt,
			guideId: Guides.id,
			guide: Guides.name,
			guideSlug: Guides.username
		})
		.from(Teams)
		.leftJoin(Tours, eq(Teams.tourId, Tours.id))
		.leftJoin(Guides, eq(Teams.guideId, Guides.id))
		.where(req.user.isAdmin === false ? eq(Teams.guideId, req.user.id) : undefined)
		.orderBy(desc(Teams.startsAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	const reply = {
		teams,
		totalCount
	};

	if (req.user.isAdmin === true) {
		const guides = await db
			.select({
				id: Guides.id,
				guide: Guides.name
			})
			.from(Guides);

		const adminReply = {
			...reply,
			guides
		};

		res.send(adminReply);
		return;
	}

	res.send(reply);
};

export const getFilter = async (req: Request, res: Response): Promise<void> => {
	if (!req.user) {
		res.send('You are not allowed to see this page');
		return;
	}

	const today = new Date().toISOString().split('T')[0];

	const { guide, startDate, endDate, isToday, upcoming, past } = req.query;

	const page = parseInt((req.query.page as string) || '1', 10);
	const pageSize = parseInt((req.query.pageSize as string) || '5', 10);

	let guideId: number | undefined = undefined;

	if (guide) {
		guideId = parseInt(guide as string, 10);
	}

	const totalCountQuery = await db
		.select({ count: count() })
		.from(Teams)
		.leftJoin(Tours, eq(Teams.tourId, Tours.id))
		.where(
			and(
				guideId ? eq(Teams.guideId, guideId) : undefined,
				startDate ? gte(Teams.startsAt, sql`${startDate}`) : undefined,
				endDate ? lte(Teams.endsAt, sql`${endDate}`) : undefined,
				isToday ? sql`DATE(${Teams.startsAt}) = ${today}` : undefined,
				upcoming ? gt(Teams.startsAt, sql`${upcoming}`) : undefined,
				past ? lt(Teams.startsAt, sql`${past}`) : undefined
			)
		);

	const totalCount = totalCountQuery[0]?.count || 0;

	const teams = await db
		.select({
			id: Teams.id,
			team: Teams.team,
			tourId: Teams.tourId,
			tour: Tours.tour,
			tourDays: Tours.numberOfDays,
			tourNights: Tours.numberOfNights,
			startsAt: Teams.startsAt,
			endsAt: Teams.endsAt
		})
		.from(Teams)
		.leftJoin(Tours, eq(Teams.tourId, Tours.id))
		.where(
			and(
				guideId ? eq(Teams.guideId, guideId) : undefined,
				startDate ? gte(Teams.startsAt, sql`${startDate}`) : undefined,
				endDate ? lte(Teams.endsAt, sql`${endDate}`) : undefined,
				isToday ? sql`DATE(${Teams.startsAt}) = ${today}` : undefined,
				upcoming ? gt(Teams.startsAt, sql`${upcoming}`) : undefined,
				past ? lt(Teams.startsAt, sql`${past}`) : undefined
			)
		)
		.orderBy(desc(Teams.startsAt))
		.limit(pageSize)
		.offset((page - 1) * pageSize);

	res.send({
		totalCount,
		teams
	});
};
