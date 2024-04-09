const express = require('express');
const {placeIndexView, placeView, placeEdit } = require('../controllers/placeController');
const router = express.Router();

router.get('/placeIndex', placeIndexView);
router.get('/placeEdit', placeEdit);
router.get('/place/:id', placeView);

router.get('/', (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("dashboard", {
    } );
});

module.exports = router;