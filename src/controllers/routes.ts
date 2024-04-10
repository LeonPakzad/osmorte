const express = require('express');
const {placeIndexView, placeView, placeEdit } = require('../controllers/placeController');
const router = express.Router();

router.get('/place-index', placeIndexView);
router.get('/place-edit', placeEdit);
router.get('/place/:id', placeView);

router.get('/', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("dashboard", {
    } );
});

router.get('/about', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("about", {
    } );
});

module.exports = router;