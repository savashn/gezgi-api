import { Router } from 'express';
import { admin } from '../middlewares/authenticator';
import {
	activitySchema,
	guideSchema,
	loginSchema,
	teamSchema,
	touristSchema,
	tourSchema
} from '../schemas/postSchemas';
import validator from '../middlewares/validator';
import {
	login,
	postActivity,
	postAirport,
	postCity,
	postCurrency,
	postGender,
	postGuide,
	postHousing,
	postLanguage,
	postNationality,
	postPaymentMethod,
	postRestaurant,
	postTeam,
	postTour,
	postTourist,
	postVehicle
} from '../controllers/postControllers';

const router = Router();

router.post('/team', validator(teamSchema), admin, postTeam);
router.post('/activity', validator(activitySchema), admin, postActivity);
router.post('/tourist', validator(touristSchema), admin, postTourist);
router.post('/guide', validator(guideSchema), admin, postGuide);
router.post('/login', validator(loginSchema), login);
router.post('/cities', admin, postCity);
router.post('/restaurant', admin, postRestaurant);
router.post('/housing', admin, postHousing);
router.post('/vehicle', admin, postVehicle);
router.post('/nationalities', admin, postNationality);
router.post('/currencies', admin, postCurrency);
router.post('/airports', admin, postAirport);
router.post('/languages', admin, postLanguage);
router.post('/tour', validator(tourSchema), admin, postTour);
router.post('/payment-methods', admin, postPaymentMethod);
router.post('/genders', admin, postGender);

export default router;
