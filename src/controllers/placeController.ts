import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch';
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

const placeDelete = async (_req: any, res: { redirect: (arg0: string) => void }) => {
    var _id:number = Number(_req.params.id); 
    
    await prisma.place.delete({
        where: {id: _id}
    })

    res.redirect("/place-index")
}

const placeFind = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    var _places = await fetchPlaceByBox(_req.params._box, "restaurant")
    console.log(_req.params._box)
    if(_places != null)
    {
        res.render("place/find", {
            places: _places
        } );
    }
    else 
    {
        res.render("place/find", {
        } );
    }
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

async function fetchPlaceByBox(_box:string, _place:string){

    const osmQuery = `
        [out:json][timeout:25];
        nwr["amenity"="place"]({{bbox}});
        out;
    `;

    osmQuery.replace('{{bbox}}', _box);
    osmQuery.replace('{{place}}', _place);

    const overpassURL = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(osmQuery)}`;

    return await fetch(overpassURL);
};

module.exports =  {
    placeIndexView,
    placeView,
    placeDelete,
    placeEdit,
    placeFind
};
