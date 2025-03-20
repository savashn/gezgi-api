import {
	integer,
	pgTable,
	varchar,
	text,
	serial,
	timestamp,
	boolean,
	date,
	primaryKey
} from 'drizzle-orm/pg-core';

export const Airports = pgTable('airports', {
	id: serial('id').primaryKey(),
	airport: varchar({ length: 255 }).notNull()
});

export const Currencies = pgTable('currencies', {
	id: serial('id').primaryKey(),
	currency: varchar({ length: 50 }).notNull()
});

export const Nationalities = pgTable('nationalities', {
	id: serial('id').primaryKey(),
	nationality: varchar({ length: 255 }).notNull()
});

export const Genders = pgTable('genders', {
	id: serial('id').primaryKey(),
	gender: varchar({ length: 100 }).notNull()
});

export const Cities = pgTable('cities', {
	id: serial('id').primaryKey(),
	city: varchar({ length: 255 }).notNull()
});

export const Restaurants = pgTable('restaurants', {
	id: serial('id').primaryKey(),
	restaurant: varchar({ length: 255 }).notNull(),
	cityId: integer('city_id')
		.notNull()
		.references(() => Cities.id),
	district: varchar({ length: 255 }),
	address: text('address'),
	officer: varchar({ length: 255 }),
	contactOfficer: varchar({ length: 255 }),
	contactRestaurant: varchar({ length: 255 })
});

export const Housings = pgTable('housings', {
	id: serial('id').primaryKey(),
	housing: varchar({ length: 255 }).notNull(),
	cityId: integer('city_id')
		.notNull()
		.references(() => Cities.id),
	district: varchar({ length: 255 }),
	address: text('address'),
	officer: varchar({ length: 255 }),
	contactOfficer: varchar({ length: 255 }),
	contactHousing: varchar({ length: 255 })
});

export const Vehicles = pgTable('vehicles', {
	id: serial('id').primaryKey(),
	company: varchar({ length: 255 }),
	contactCompany: varchar({ length: 255 }),
	officer: varchar({ length: 255 }),
	contactOfficer: varchar({ length: 255 })
});

export const Languages = pgTable('languages', {
	id: serial('id').primaryKey(),
	language: varchar({ length: 255 })
});

export const Guides = pgTable('guides', {
	id: serial('id').primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	username: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	languageId: integer('language_id')
		.notNull()
		.references(() => Languages.id),
	birth: date({ mode: 'string' }),
	nationalityId: integer('nationality_id')
		.notNull()
		.references(() => Nationalities.id),
	passportNo: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 100 }).notNull(),
	intimate: varchar({ length: 255 }),
	intimacy: varchar({ length: 255 }),
	intimatePhone: varchar({ length: 255 }),
	isAdmin: boolean('is_admin').default(false).notNull()
});

export const Tours = pgTable('tours', {
	id: serial('id').primaryKey(),
	tour: varchar({ length: 255 }).notNull(),
	cityId: integer('cityId')
		.notNull()
		.references(() => Cities.id),
	numberOfDays: integer('number_of_days').notNull(),
	numberOfNights: integer('number_of_nights').notNull()
});

export const Teams = pgTable('teams', {
	id: serial('id').primaryKey(),
	team: varchar({ length: 255 }).notNull(),
	tourId: integer('tour_id')
		.notNull()
		.references(() => Tours.id),
	startsAt: timestamp('starts_at', { mode: 'string' }).notNull(),
	endsAt: timestamp('ends_at', { mode: 'string' }).notNull(),
	guideId: integer('guide_id')
		.notNull()
		.references(() => Guides.id),
	flightOutwardNo: varchar({ length: 255 }),
	flightOutwardDeparture: timestamp('flight_outward_departure', {
		mode: 'string'
	}),
	flightOutwardDepartureAirport: integer('flight_outward_departure_airport').references(
		() => Airports.id
	),
	flightOutwardLanding: timestamp('flight_outward_landing', { mode: 'string' }),
	flightOutwardLandingAirport: integer('flight_outward_landing_airport').references(
		() => Airports.id
	),
	flightReturnNo: varchar({ length: 255 }),
	flightReturnDeparture: timestamp('flight_return_departure', {
		mode: 'string'
	}),
	flightReturnDepartureAirport: integer('flight_return_departure_airport').references(
		() => Airports.id
	),
	flightReturnLanding: timestamp('flight_return_landing', { mode: 'string' }),
	flightReturnLandingAirport: integer('flight_return_landing_airport').references(() => Airports.id)
});

export const Activities = pgTable('activities', {
	id: serial('id').primaryKey(),
	activity: text('activity').notNull(),
	teamId: integer('team_id')
		.notNull()
		.references(() => Teams.id),
	activityTime: timestamp('activity_time', { mode: 'string' }),
	hotelId: integer('hotel_id').references(() => Housings.id),
	plateOfVehicle: varchar({ length: 200 }),
	contactOfDriver: varchar({ length: 200 }),
	companyOfVehicle: integer('company_of_vehicle').references(() => Vehicles.id),
	restaurantId: integer('restaurant_id').references(() => Restaurants.id),
	airportId: integer('airport_id').references(() => Airports.id)
});

export const PaymentMethods = pgTable('payment_methods', {
	id: serial('id').primaryKey(),
	method: varchar({ length: 100 })
});

export const Tourists = pgTable('tourists', {
	id: serial('id').primaryKey(),
	name: varchar({ length: 255 }).notNull(),
	birth: date({ mode: 'string' }),
	genderId: integer('gender_id')
		.notNull()
		.references(() => Genders.id),
	nationalityId: integer('nationality_id')
		.notNull()
		.references(() => Nationalities.id),
	passportNo: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 100 }).notNull(),
	address: text('address'),
	intimate: varchar({ length: 255 }),
	intimacy: varchar({ length: 255 }),
	intimatePhone: varchar({ length: 255 })
});

export const TouristTeams = pgTable(
	'tourist_teams',
	{
		touristId: integer('tourist_id')
			.notNull()
			.references(() => Tourists.id, { onDelete: 'cascade' }),
		teamId: integer('team_id')
			.notNull()
			.references(() => Teams.id, { onDelete: 'cascade' })
	},
	(t) => ({
		pk: primaryKey({ columns: [t.touristId, t.teamId] })
	})
);

export const TouristsPayments = pgTable('tourists_payments', {
	id: serial('id').primaryKey(),
	teamId: integer('team_id')
		.notNull()
		.references(() => Teams.id, { onDelete: 'cascade' }),
	touristId: integer('tourist_id')
		.notNull()
		.references(() => Tourists.id, { onDelete: 'cascade' }),
	amount: integer('amount'),
	currencyId: integer('currency_id').references(() => Currencies.id),
	paymentMethodId: integer('payment_method_id').references(() => PaymentMethods.id),
	isPayed: boolean('is_payed').default(false).notNull()
});
