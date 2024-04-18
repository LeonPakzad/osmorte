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
}

const placeDelete = async (_req: any, res: { redirect: (arg0: string) => void }) => {
    var _id:number = Number(_req.params.id); 
    
    await prisma.place.delete({
        where: {id: _id}
    })
    res.redirect("/place-index")
}

// MARK: placeFind
const placeFind = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    if(_req.query.box != undefined && _req.query.box != '')
    {
        var osmQuery = `
        [out:json][timeout:25];
        nwr["amenity"="place"]({{bbox}});
        out;
        `;
        
        var boxedOSMQuery = osmQuery.replace('{{bbox}}', _req.query.box);
        var placedOSMQuery = boxedOSMQuery.replace('place', 'restaurant');

        try{
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(placedOSMQuery)}`)
            
            var placeResponse = await response.json();
            
            interface TagMap {
                [key: string]: string;
            }


            const placeArray = placeResponse.elements.map((element: { type: any; id: any; lat: any; lon: any; tags: any; }) => 
            {

                // sanitize restaurant tags
                const tags: TagMap = {};
                for (const key in element.tags) {
                    let alteredKey = key.startsWith('addr:') ? key.substring(5) : key;
                    let value = element.tags[key];
                
                    console.log(value);
                    if (value.startsWith('http://')) {
                        value = value.substring(7);
                    } else if (value.startsWith('https://')) {
                        value = value.substring(8);
                    }
                    
                    tags[alteredKey] = value;
                }

                return {
                    id:                 element.id,
                    lat:                element.lat             == undefined ? '-' : element.lat,
                    long:               element.lon             == undefined ? '-' : element.lon,
                    name:               tags.name               == undefined ? '-' : tags.name,
                    fk_place:           tags.fk_place           == undefined ? '-' : tags.fk_place, 
                    website:            tags.website            == undefined ? '-' : tags.website,
                    email:              tags.email              == undefined ? '-' : tags.email, 
                    opening_hours:      tags.opening_hours      == undefined ? '-' : tags.opening_hours,
                    city:               tags.city               == undefined ? '-' : tags.city,
                    postcode:           tags.postcode           == undefined ? '-' : tags.postcode,
                    street:             tags.street             == undefined ? '-' : tags.street,
                    housenumber:        tags.housenumber        == undefined ? '-' : tags.housenumber,
                    cuisine:            tags.cuisine            == undefined ? '-' : tags.cuisine,
                    diet_vegan:         tags.diet_vegan         == undefined ? '-' : tags.diet_vegan,   
                    diet_vegetarian:    tags.diet_vegetarian    == undefined ? '-' : tags.diet_vegetarian,
                };
            });

            res.render("place/find", {
                input: _req.query.box,
                places: placeArray
            } );

        } catch(error)
        {
            console.log(error)
        }
    }
    else 
    {
        res.render("place/find", {
            places: undefined,
            input: _req.query.box
        } );
    }
}

// MARK: add Place
async function placeAdd(_req: any, res: { redirect: (arg0: string) => void})
{
    const place = JSON.parse(_req.params.params)
    
    await prisma.place.create({
        data: {
            fk_place:           place.fk_place          == '-' ? null : place.fk_place,
            node:               place.id                == '-' ? null : place.id,
            name:               place.name              == '-' ? null : place.name,
            email:              place.email             == '-' ? null : place.email,
            website:            place.website           == '-' ? null : place.website,
            opening_hours:      place.opening_hours     == '-' ? null : place.opening_hours,
            lat:                place.lat               == '-' ? null : place.lat,
            long:               place.long              == '-' ? null : place.long,        
            city:               place.city              == '-' ? null : place.city,   
            housenumber:        place.housenumber       == '-' ? null : Number(place.housenumber),
            postcode:           place.postcode          == '-' ? null : Number(place.postcode),
            street:             place.street            == '-' ? null : place.street,
            cuisine:            place.cuisine           == '-' ? null : place.cuisine,
            diet_vegan:         place.diet_vegan        == '-' ? undefined : Boolean(place.diet_vegan),
            diet_vegetarian:    place.diet_vegetarian   == '-' ? undefined : Boolean(place.diet_vegetarian)
        },
    })

    res.redirect("/place-index")
}

const placeEdit = (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => 
{
    const { name, email, location, password, confirm } = _req.body;
    
    if (!prisma.place) {
        console.log("some fields are empty");
    }
    
    res.render("place/edit", {
        
    } );
}

const placeCreate = () => {

}

function fetchPlaceByBox(_box:string, _place:string)
{
    var osmQuery = `
    [out:json][timeout:25];
    nwr["amenity"="place"]({{bbox}});
    out;
    `;
    
    var boxedOSMQuery = osmQuery.replace('{{bbox}}', _box);
    var placedOSMQuery = boxedOSMQuery.replace('place', _place);

    return fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(placedOSMQuery)}`);
};

// MARK: Exports
module.exports =  {
    placeIndexView,
    placeView,
    placeDelete,
    placeEdit,
    placeFind,
    placeAdd
};
