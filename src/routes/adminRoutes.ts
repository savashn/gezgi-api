import { Router } from 'express';
import { admin } from '../middlewares/authenticator';
import {
	adminActivity,
	adminAirports,
	adminCities,
	adminCurrencies,
	adminGenders,
	adminGuides,
	adminHousings,
	adminLanguages,
	adminNationalities,
	adminPaymentMethods,
	adminRestaurants,
	adminTeam,
	adminTourist,
	adminTours,
	adminVehicles
} from '../controllers/adminControllers';

const router = Router();

// Before performing the POST operation, those will be visible

router.get('/team', admin, adminTeam);
router.get('/activity', admin, adminActivity);
router.get('/tourist', admin, adminTourist);
router.get('/guides', admin, adminGuides);
router.get('/restaurants', admin, adminRestaurants);
router.get('/housings', admin, adminHousings);
router.get('/tours', admin, adminTours);
router.get('/vehicles', admin, adminVehicles);

// BASICS:

router.get('/cities', admin, adminCities);
router.get('/nationalities', admin, adminNationalities);
router.get('/currencies', admin, adminCurrencies);
router.get('/airports', admin, adminAirports);
router.get('/languages', admin, adminLanguages);
router.get('/payment-methods', admin, adminPaymentMethods);
router.get('/genders', admin, adminGenders);

export default router;
