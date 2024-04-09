import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const placeIndexView = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    var _places = await prisma.place.findMany()
    res.render("place/index", 
        { 
            places: _places
        } 
    );
}

const placeView = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    var _id:number = Number(_req.params.id); 
    var _place = await prisma.place.findUnique({
        where: {id: _id}
    })

    res.render("place/view", {
        place: _place
    } );
    console.log(_id);
}
  
const placeEdit = (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    const { name, email, location, password, confirm } = _req.body;
    
    if (!prisma.place) {
        console.log("some fields are empty");
    }
    
    res.render("place/edit", {
        
    } );
}

const placeCreate = () => {

}

module.exports =  {
    placeIndexView,
    placeView,
    placeEdit
};