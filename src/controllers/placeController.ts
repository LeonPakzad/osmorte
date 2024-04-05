const placeIndexView = (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("place/index", {
    } );
}

const placeView = (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("place/view", {
    } );
}

const placeEdit = (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    res.render("place/edit", {
    } );
}

module.exports =  {
    placeIndexView,
    placeView,
    placeEdit
};