const express = require('express');
const router = express.Router();

const {
    placeIndexView,
    placeView,
    placeEdit,
    placeFind,
    placeDelete,
    placeAdd,
    placeUpdate,
    placeUpdatePreview
} = require('../controllers/placeController');

function checkAdmin(req: { user: { role: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }, next: () => void) 
{
    next();
    // todo: authentication

    // if (req.user && req.user.role === 'admin') 
    // {
    //     next();
    // } 
    // else 
    // {
    //     res.status(403).json({ message: 'Access denied' });
    // }
}
router.get('/place-index', checkAdmin, placeIndexView);
router.get('/place-index/:params', checkAdmin, placeIndexView);

router.get('/place-find', checkAdmin, placeFind);
router.get('/place-find/:box', checkAdmin, placeFind);

router.get('/place-edit', checkAdmin, placeEdit);
router.get('/place/:params', checkAdmin, placeView);

router.get('/place-update/:params', checkAdmin, placeUpdate);
router.get('/place-update-preview/:params', checkAdmin, placeUpdatePreview);

router.get('/place-delete/:id', checkAdmin, placeDelete);
router.get('/place-add/:params', checkAdmin, placeAdd);

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