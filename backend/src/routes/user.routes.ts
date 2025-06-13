import{ NextFunction, Router, Request, Response } from 'express';
import passport from 'passport';
import { handleGoogleCallback, updateProfile,getUserProfile } from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
    session: false ,
    failureRedirect:`/auth/failure`
}),
    handleGoogleCallback);

router.get('/auth/failure', (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}?auth=failed&error=${encodeURIComponent('Authentication failed')}`);
});

router.put('/profile', authenticateJWT, updateProfile);
router.get('/profile',authenticateJWT,getUserProfile)

export default router;
