import { Router } from 'express';
import { admin } from '../middlewares/authenticator';
import {
	deleteActivity,
	deleteAirport,
	deleteCity,
	deleteCurrency,
	deleteGender,
	deleteGuide,
	deleteHousing,
	deleteLanguage,
	deleteNationality,
	deletePaymentMethod,
	deleteRestaurant,
	deleteTeam,
	deleteTour,
	deleteTourist,
	deleteVehicle
} from '../controllers/deleteControllers';

const router = Router();

router.delete('/teams/:slug', admin, deleteTeam);
router.delete('/teams/:slug/activity/:id', admin, deleteActivity);
router.delete('/teams/:slug/tourist/:id', admin, deleteTourist);
router.delete('/cities/:slug', admin, deleteCity);
router.delete('/guides/:id', admin, deleteGuide);
router.delete('/tours/:id', admin, deleteTour);
router.delete('/restaurants/:id', admin, deleteRestaurant);
router.delete('/housings/:id', admin, deleteHousing);
router.delete('/vehicles/:id', admin, deleteVehicle);
router.delete('/nationalities/:id', admin, deleteNationality);
router.delete('/currencies/:id', admin, deleteCurrency);
router.delete('/airports/:id', admin, deleteAirport);
router.delete('/languages/:id', admin, deleteLanguage);
router.delete('/genders/:id', admin, deleteGender);
router.delete('/payment-methods/:id', admin, deletePaymentMethod);

export default router;
