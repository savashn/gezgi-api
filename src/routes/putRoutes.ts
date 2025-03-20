import { Router } from 'express';
import { admin } from '../middlewares/authenticator';
import {
	putActivities,
	putAirports,
	putCities,
	putCurrencies,
	putGenders,
	putGuides,
	putHousings,
	putLanguages,
	putNationalities,
	putPaymentMethods,
	putRestaurants,
	putTeam,
	putTourists,
	putTours,
	putVehicles
} from '../controllers/putControllers';

const router = Router();

router.put('/teams/:slug', admin, putTeam);
router.put('/activities/:id', admin, putActivities);
router.put('/tourists/:id', admin, putTourists);
router.put('/guides/:id', putGuides);
router.put('/tours', admin, putTours);
router.put('/cities', admin, putCities);
router.put('/restaurants', admin, putRestaurants);
router.put('/housings', admin, putHousings);
router.put('/vehicles', admin, putVehicles);
router.put('/nationalities', admin, putNationalities);
router.put('/currencies', admin, putCurrencies);
router.put('/airports', admin, putAirports);
router.put('/languages', admin, putLanguages);
router.put('/genders', admin, putGenders);
router.put('/payment-methods', admin, putPaymentMethods);

export default router;
