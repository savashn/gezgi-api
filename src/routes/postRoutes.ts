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
router.post('/city', admin, postCity);
router.post('/restaurant', admin, postRestaurant);
router.post('/housing', admin, postHousing);
router.post('/vehicle', admin, postVehicle);
router.post('/nationality', admin, postNationality);
router.post('/currency', admin, postCurrency);
router.post('/airport', admin, postAirport);
router.post('/language', admin, postLanguage);
router.post('/tour', validator(tourSchema), admin, postTour);
router.post('/payment-method', admin, postPaymentMethod);
router.post('/gender', admin, postGender);

export default router;
