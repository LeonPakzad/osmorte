const express = require('express');
const router = express.Router();

const {
    placeIndexView,
    placeView,
    placeEdit,
    placeFind,
    placeDelete,
    placeAdd 
} = require('../controllers/placeController');

router.get('/place-index', placeIndexView);
router.get('/place-find', placeFind);
router.get('/place-find/:box', placeFind);
router.get('/place-edit', placeEdit);
router.get('/place/:id', placeView);
router.get('/place-delete/:id', placeDelete);
router.get('/place-add/:params', placeAdd);

router.get('/', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("dashboard", {
    } );
});

router.get('/about', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("about", {
    } );
});

// get 404 error page for all urls that were not specified
router.get('*', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("error", {
    } );
});


module.exports = router;