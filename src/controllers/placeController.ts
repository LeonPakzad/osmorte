import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch';
const prisma = new PrismaClient()

// MARK: column definitions
const placeCols = [
    'id', 'name',
    'lat', 'long', 'city', 'postcode', 'street', 'housenumber',
];

const restaurantCols = [  
    'email', 'operator', 'website', 'opening_hours', 
    'wheelchair','outdoor_seating','dog',
    'cuisine','lunch','organic','takeaway',
    'diet_kosher','diet_diabetes','diet_halal','diet_vegan','diet_vegetarian',   
];

const cafeCols = [  
    'operator', 'website', 'phone', 'opening_hours', 'brand', 'smoking', 'self_service',
    'wheelchair','outdoor_seating', 'indoor_seating', 'dog',
    'cuisine','organic','takeaway', 'ice_cream', 'bakery', 'pastry',
    'diet_kosher','diet_diabetes','diet_halal','diet_vegan','diet_vegetarian',   
];

const fastFoodCols= [
    'operator', 'website', 'phone', 'brand', 
    'cuisine','organic','takeaway', 'delivery',
    'drive_through', 'drive_in', 'opening_hours', 
    'wheelchair','outdoor_seating', 'capacity', 'dog',
    'diet_kosher','diet_diabetes','diet_halal','diet_vegan','diet_vegetarian',   
];

const restaurantPlaceCols   = placeCols.concat(restaurantCols);
const cafePlaceCols         = placeCols.concat(cafeCols);
const fastFoodPlaceCols     = placeCols.concat(fastFoodCols);


// MARK: mapping
interface TagMap {
    [key: string]: string;
}

function mapRestaurant(restaurantObject: { elements: { type: any; id: any; lat: any; lon: any; tags: any; }[]; }) {
    return restaurantObject.elements.map((element: { type: any; id: any; lat: any; lon: any; tags: any; }) => 
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
            lat:                element.lat             == undefined ? '-' : element.lat,
            long:               element.lon             == undefined ? '-' : element.lon,
            city:               tags.city               == undefined ? '-' : tags.city,
            postcode:           tags.postcode           == undefined ? '-' : tags.postcode,
            street:             tags.street             == undefined ? '-' : tags.street,
            housenumber:        tags.housenumber        == undefined ? '-' : tags.housenumber, 

            email:              tags.email              == undefined ? '-' : tags.email, 
            operator:           tags.operator           == undefined ? '-' : tags.operator,
            website:            tags.website            == undefined ? '-' : tags.website,
            opening_hours:      tags.opening_hours      == undefined ? '-' : tags.opening_hours,
            
            
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
}

// MARK: helpers
interface FlattenedObject {
    [key: string]: any;
}

function flattenArrayOfObjects(arr: any[]): FlattenedObject[] {
    return arr.map((obj: any) => {
        return flattenObject(obj);
    });
}

function flattenObject(obj: any): FlattenedObject {
    return Object.keys(obj).reduce((acc: FlattenedObject, key: string) => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const flattened = flattenObject(obj[key]);
            return { ...acc, ...flattened };
        } else {
            return { ...acc, [key]: obj[key] };
        }
    }, {});
}

// MARK: index 
const placeIndexView = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {

    const orderBy: Record<string, string> = {};
    orderBy[_req.query.orderby as string] = _req.query.orderdirection as string;

    var _places;

    if(placeCols.indexOf(_req.query.orderby) != -1)
    {
        _places = await prisma.oSM_Place.findMany({
            orderBy: orderBy,
            include: {
                restaurant: true,
            },
        });
    }
    else 
    {
        _places = await prisma.oSM_Place.findMany({
            orderBy: {
                restaurant: orderBy
            },
            include: {
                restaurant: true,
            },
        });
    }
    
    const flattenedPlace = flattenArrayOfObjects(_places);

    res.render("place/index", 
    { 
        title: "Places",
        places: flattenedPlace,
        placecols: restaurantPlaceCols,
        input: {
            orderby: _req.query.orderby,
            orderdirection: _req.query.orderdirection
        },
    });
}

const placeView = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    var _id:number = Number(_req.params.id); 
    var _place = await prisma.oSM_Place.findUnique({
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
    
    await prisma.oSM_Restaurant.delete({
        where: {fk_placeId: _id}
    })

    await prisma.oSM_Place.delete({
        where: {id: _id}
    })
    res.redirect("/place-index")
}

// MARK: find
const placeFind = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {

    const downloadedPlaces = await prisma.oSM_Place.findMany({
        select: {
            node: true,
        },
    });
    const downloadedPlacesNodes = downloadedPlaces.map(item => item.node)

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
            
            var placeArray = mapRestaurant(placeResponse);

            var _placeCols : string[] = [];
            switch(_req.query.amenity)
            {
                case 'restaurant':
                    _placeCols = restaurantPlaceCols;
                    break;
                case 'cafe':
                    _placeCols = cafePlaceCols;
                    break;
                case 'fast_food':
                    _placeCols = fastFoodPlaceCols;
                    break;
            }
                        
            res.render("place/find", {
                title: "Found Places",
                places: placeArray,
                boxerror: false,
                placecols: _placeCols,
                downloadedPlaces: downloadedPlacesNodes,
                input: { 
                    latitude: _req.query.latitude,
                    longitude: _req.query.longitude,
                    radius: _req.query.radius,
                    amenity: _req.query.amenity,
                    box: _req.query.box,
                },
            } );
        } 
        catch(error)
        {
            console.log(error)
        }
    }
    else 
    {
        res.render("place/find", {
            title: "Find Places",
            places: undefined,
            placecols: undefined,
            boxerror: _req.query.box === undefined ? false : true,
            downloadedPlaces: downloadedPlacesNodes,
            input: { 
                latitude: _req.query.latitude,
                longitude: _req.query.longitude,
                radius: _req.query.radius,
                amenity: _req.query.amenity,
                box: _req.query.box,
            },
        } );
    }
}

// MARK: add
async function placeAdd(_req: any, res: { redirect: (arg0: string) => void})
{
    const place = JSON.parse(decodeURIComponent(_req.params.params))
    
    var placeExists: object | null = await prisma.oSM_Place.findFirst({
        where: {node: place.id}
    })

    if(placeExists == null)
    {
        await prisma.oSM_Place.create({
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
                        email:              place.email             == '-' ? null : place.email,
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
    else
    {
        res.redirect("/place-find")
    }
}

const placeEdit = (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => 
{
    if (!prisma.oSM_Place) {
        console.log("some fields are empty");
    }
    
    res.render("place/edit", {
        
    } );
}

// MARK: function export
module.exports =  {
    placeIndexView,
    placeView,
    placeDelete,
    placeEdit,
    placeFind,
    placeAdd
};
