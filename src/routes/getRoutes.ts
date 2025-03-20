import { Router } from 'express';
import { admin, allUsers, auth } from '../middlewares/authenticator';
import {
	getFilter,
	getGuide,
	getMain,
	getTeam,
	getTeamActivities,
	getTeams,
	getTeamTourists,
	getTourist,
	getTours
} from '../controllers/getControllers';

const router = Router();

router.get('/teams/:slug', allUsers, getTeam);
router.get('/teams/:slug/activities', getTeamActivities);
router.get('/teams/:slug/tourists', auth, getTeamTourists);
router.get('/guides/:username', auth, getGuide);
router.get('/teams', auth, getTeams);
router.get('/tourists/:id', auth, getTourist);
router.get('/tours', admin, getTours);
router.get('/main', auth, getMain);
router.get('/filter', auth, getFilter);

export default router;
