const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
import { auth } from '../controllers/auth';

const {
    placeIndexView,
    placeView,
    placeFind,
    placeDelete,
    placeDeleteByAmenity,
    placeDeleteAll,
    placeAdd,
    placeUpdate,
    placeUpdatePreview
} = require('../controllers/placeController');

dotenv.config();
router.use(cookieParser());

router.post('/login', auth.login);

// Osmorte Tool routes
router.get('/', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("dashboard", {
        title: "Dashboard",
    } );
});

router.get('/place-index', auth.verifyToken, placeIndexView);
router.get('/place-index/:params', auth.verifyToken, placeIndexView);

router.get('/place-find', placeFind);
router.get('/place-find/:box', placeFind);

router.get('/place/:params', auth.verifyToken, placeView);

router.get('/place-update/:params', auth.verifyToken, placeUpdate);
router.get('/place-update-preview/:params', auth.verifyToken, placeUpdatePreview);

router.get('/place-delete/:params', auth.verifyToken, placeDelete);
router.get('/places-delete/:params', auth.verifyToken, placeDeleteByAmenity);
router.get('/places-delete-all/', auth.verifyToken, placeDeleteAll);

router.get('/place-add/:params', auth.verifyToken, placeAdd);

// get 404 error page for all urls that were not specified
router.get('*', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("error", {
        title: "404",
    } );
});
  
module.exports = router;