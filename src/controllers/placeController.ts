import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch';
const prisma = new PrismaClient()


const _restaurantRows = [  
    'ID', 'name', 'email', 'operator', 'website', 'opening hours', 
    'lat', 'long', 'city', 'postcode', 'street', 'housenumber',
    'wheelchair','outdoor_seating','dog',
    'cuisine','lunch','organic','takeaway',
    'diet_kosher','diet_diabetes','diet_halal','diet_vegan','diet_vegetarian',   
];

const placeIndexView = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {

    var _places = await prisma.place.findMany({
        include: {
            restaurant: true,
        },
    })

    res.render("place/index", 
    { 
        title: "Places",
        places: _places,
        placerows: _restaurantRows
    });
}

const placeView = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    var _id:number = Number(_req.params.id); 
    var _place = await prisma.place.findUnique({
        where: {id: _id}
    })

    res.render("place/view", 
    {
        title: "place: " + _place?.name,
        place: _place
    });
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
        var placedOSMQuery = boxedOSMQuery.replace('place', _req.query.amenity);

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
                
                    if (value.startsWith('http://')) {
                        value = value.substring(7);
                    } else if (value.startsWith('https://')) {
                        value = value.substring(8);
                    }
                    
                    tags[alteredKey] = value;
                }

                return {
                    id:                 element.id,
                    name:               tags.name               == undefined ? '-' : tags.name,
                    email:              tags.email              == undefined ? '-' : tags.email, 
                    operator:           tags.operator           == undefined ? '-' : tags.operator,
                    website:            tags.website            == undefined ? '-' : tags.website,
                    opening_hours:      tags.opening_hours      == undefined ? '-' : tags.opening_hours,
                    
                    lat:                element.lat             == undefined ? '-' : element.lat,
                    long:               element.lon             == undefined ? '-' : element.lon,
                    city:               tags.city               == undefined ? '-' : tags.city,
                    postcode:           tags.postcode           == undefined ? '-' : tags.postcode,
                    street:             tags.street             == undefined ? '-' : tags.street,
                    housenumber:        tags.housenumber        == undefined ? '-' : tags.housenumber, 
                    
                    wheelchair:         tags.wheelchair         == undefined ? '-' : tags.wheelchair,
                    outdoor_seating:    tags.outdoor_seating    == undefined ? '-' : tags.outdoor_seating,
                    dog:                tags.dog                == undefined ? '-' : tags.dog,
                    
                    cuisine:            tags.cuisine            == undefined ? '-' : tags.cuisine,
                    lunch:              tags.lunch              == undefined ? '-' : tags.lunch,
                    organic:            tags.organic            == undefined ? '-' : tags.organic,
                    takeaway:           tags.takeaway           == undefined ? '-' : tags.takeaway,
                    
                    diet_kosher:        tags.diet_kosher        == undefined ? '-' : tags.diet_kosher,
                    diet_diabetes:      tags.diet_diabetes      == undefined ? '-' : tags.diet_diabetes,
                    diet_halal:         tags.diet_halal         == undefined ? '-' : tags.diet_halal,
                    diet_vegan:         tags.diet_vegan         == undefined ? '-' : tags.diet_vegan,   
                    diet_vegetarian:    tags.diet_vegetarian    == undefined ? '-' : tags.diet_vegetarian,
                };
            });

            var _placeRows : string[] = [];

            //only refresh placerows if they are not definet yet
            if(_req.placeRows == undefined)
            {
                _placeRows = _restaurantRows;
            }
            else 
            {
                _placeRows = _req.placeRows;
            }
                    
            res.render("place/find", {
                title: "Found Places",
                input: _req.query.box,
                places: placeArray,
                placerows: _placeRows
            } );


        } catch(error)
        {
            console.log(error)
        }
    }
    else 
    {
        res.render("place/find", {
            title: "Find Places",
            places: undefined,
            placerows: undefined,
            input: _req.query.box, 
        } );
    }
}

// MARK: add Place
async function placeAdd(_req: any, res: { redirect: (arg0: string) => void})
{
    const place = JSON.parse(decodeURIComponent(_req.params.params))
    
    await prisma.place.create({
        data: {
            node:               place.id                == '-' ? null : place.id,
            name:               place.name              == '-' ? null : place.name,
            lat:                place.lat               == '-' ? null : place.lat,
            long:               place.long              == '-' ? null : place.long,        
            city:               place.city              == '-' ? null : place.city,   
            housenumber:        place.housenumber       == '-' ? null : Number(place.housenumber),
            postcode:           place.postcode          == '-' ? null : Number(place.postcode),
            street:             place.street            == '-' ? null : place.street,
            
            restaurant: {
                create: {
                    email:              place.fk_place          == '-' ? null : place.fk_place,
                    operator:           place.operator          == '-' ? null : place.operator,
                    website:            place.website           == '-' ? null : place.website,
                    opening_hours:      place.opening_hours     == '-' ? null : place.opening_hours,
                    
                    wheelchair:         place.wheelchair        == '-' ? null : place.wheelchair,
                    outdoor_seating:    place.outdoor_seating   == '-' ? undefined : Boolean(place.outdoor_seating),
                    dog:                place.dog               == '-' ? null : place.dog,
  
                    cuisine:            place.cuisine           == '-' ? null : place.cuisine,
                    lunch:              place.lunch             == '-' ? null : place.lunch,
                    organic:            place.organic           == '-' ? null : place.organic,
                    takeaway:           place.takeaway          == '-' ? null : place.takeaway,
                    diet_kosher:        place.diet_kosher       == '-' ? undefined : Boolean(place.diet_kosher),
                    diet_diabetes:      place.diet_diabetes     == '-' ? undefined : Boolean(place.diet_diabetes),
                    diet_halal:         place.diet_halal        == '-' ? undefined : Boolean(place.diet_halal),
                    diet_vegan:         place.diet_vegan        == '-' ? undefined : Boolean(place.diet_vegan),
                    diet_vegetarian:    place.diet_vegetarian   == '-' ? undefined : Boolean(place.diet_vegetarian)
                } 
            }
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
