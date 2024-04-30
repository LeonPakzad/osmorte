const express = require('express');
const router = express.Router();

const {
    placeIndexView,
    placeView,
    placeEdit,
    placeFind,
    placeDelete,
    placeAdd,
    placeUpdate
} = require('../controllers/placeController');

router.get('/place-index', placeIndexView);
router.get('/place-index/:params', placeIndexView);
router.get('/place-find', placeFind);
router.get('/place-find/:box', placeFind);
router.get('/place-edit', placeEdit);
router.get('/place/:id', placeView);
router.get('/place-update/:id', placeUpdate);
router.get('/place-delete/:id', placeDelete);
router.get('/place-add/:params', placeAdd);

router.get('/', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("dashboard", {
        title: "Dashboard",

    } );
});

// get 404 error page for all urls that were not specified
router.get('*', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("error", {
        title: "404",

    } );
});


module.exports = router;