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
	Tours,
	Vehicles
} from '../db/schemas';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { and, eq } from 'drizzle-orm';

const db = drizzle();

export const deleteTeam = async (req: Request, res: Response): Promise<void> => {
	const deletedTeam = await db.delete(Teams).where(eq(Teams.team, req.params.slug)).returning();

	if (deletedTeam.length === 0) {
		res.status(500).send('An error occured while deleting the team');
		return;
	}

	res.status(204).send();
};

export const deleteActivity = async (req: Request, res: Response): Promise<void> => {
	const id: number = parseInt(req.params.id, 10);

	const team = await db
		.select({ id: Teams.id })
		.from(Teams)
		.limit(1)
		.where(eq(Teams.team, req.params.slug));

	if (team.length === 0) {
		res.status(404).send('Not found');
		return;
	}

	const del = await db
		.delete(Activities)
		.where(and(eq(Activities.id, id), eq(Activities.teamId, team[0].id)))
		.returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting activity');
		return;
	}

	res.status(204).send();
};

export const deleteTourist = async (req: Request, res: Response): Promise<void> => {
	const id: number = parseInt(req.params.id, 10);

	const team = await db
		.select({ id: Teams.id })
		.from(Teams)
		.limit(1)
		.where(eq(Teams.team, req.params.slug));

	if (team.length === 0) {
		res.status(404).send('Not found');
		return;
	}

	const delTourist = await db.delete(Tourists).where(eq(Tourists.id, id)).returning();

	if (delTourist.length === 0) {
		res.status(500).send('No tourist has been deleted');
		return;
	}

	res.status(204).send();
};

export const deleteCity = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);
	const delGuide = await db.delete(Cities).where(eq(Cities.id, id)).returning();

	if (delGuide.length === 0) {
		res.status(500).send('An error has occured while deleting city');
		return;
	}

	res.json({ success: true });
};

export const deleteGuide = async (req: Request, res: Response): Promise<void> => {
	const id: number = parseInt(req.params.id, 10);

	const delGuide = await db
		.delete(Guides)
		.where(eq(Guides.id, id))
		.returning({ name: Guides.name });

	if (delGuide.length === 0) {
		res.status(500).send('An error has occured while deleting guide');
		return;
	}

	res.status(204).send();
};

export const deleteTour = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const delTour = await db.delete(Tours).where(eq(Tours.id, id)).returning();

	if (delTour.length === 0) {
		res.status(500).send('An error has occured while deleting tour');
		return;
	}

	res.json({ success: true });
};

export const deleteRestaurant = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const del = await db.delete(Restaurants).where(eq(Restaurants.id, id)).returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting restaurant');
		return;
	}

	res.json({ success: true });
};

export const deleteHousing = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const del = await db.delete(Housings).where(eq(Housings.id, id)).returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting housing');
		return;
	}

	res.json({ success: true });
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const del = await db.delete(Vehicles).where(eq(Vehicles.id, id)).returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting vehicles');
		return;
	}

	res.json({ success: true });
};

export const deleteNationality = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const del = await db.delete(Nationalities).where(eq(Nationalities.id, id)).returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting nationalities');
		return;
	}

	res.json({ success: true });
};

export const deleteCurrency = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const del = await db.delete(Currencies).where(eq(Currencies.id, id)).returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting currencies');
		return;
	}

	res.json({ success: true });
};

export const deleteAirport = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const del = await db.delete(Airports).where(eq(Airports.id, id)).returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting airports');
		return;
	}

	res.json({ success: true });
};

export const deleteLanguage = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const del = await db.delete(Languages).where(eq(Languages.id, id)).returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting languages');
		return;
	}

	res.json({ success: true });
};

export const deleteGender = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const del = await db.delete(Genders).where(eq(Genders.id, id)).returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting genders');
		return;
	}

	res.json({ success: true });
};

export const deletePaymentMethod = async (req: Request, res: Response): Promise<void> => {
	const id = parseInt(req.params.id, 10);

	const del = await db.delete(PaymentMethods).where(eq(PaymentMethods.id, id)).returning();

	if (del.length === 0) {
		res.status(500).send('An error has occured while deleting payment method');
		return;
	}

	res.json({ success: true });
};
