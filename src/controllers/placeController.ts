import { PrismaClient } from '@prisma/client'
import fetch from 'node-fetch';
const prisma = new PrismaClient()

//import mapping
import {mapping} from "../controllers/placeMapping"

// MARK: column definitions
const placeAttributes = [
    'id', 'name', 'node', 'updated',
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

const restaurantplaceAttributes   = placeAttributes.concat(restaurantCols);
const cafeplaceAttributes         = placeAttributes.concat(cafeCols);
const fastFoodplaceAttributes     = placeAttributes.concat(fastFoodCols);

const availablePlaceTypes= [
    "restaurant", "cafe", "fast_food"
]

// MARK: helpers
function getPlaceAttributesByAmenity(_amenity: string) {
    switch(_amenity)
    {
        case availablePlaceTypes[0]:
            return restaurantplaceAttributes;
        case availablePlaceTypes[1]:
            return cafeplaceAttributes;
        case availablePlaceTypes[2]:
            return fastFoodplaceAttributes;
    }
}

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

    var _places: any[] | null | undefined;
    // depending on if it is place or specified data, the ordering needs to be made accordingly 
    if(placeAttributes.indexOf(_req.query.orderby) != -1)
    {
        switch(_req.query.amenity)
        {
            case availablePlaceTypes[0]:
                _places = await prisma.osm_Place.findMany({
                    where: {
                        NOT: {
                            restaurant: null
                        }
                    },
                    orderBy: orderBy,
                    include: {
                        restaurant: true,
                    },
                });
            break;

            case availablePlaceTypes[1]:
                _places = await prisma.osm_Place.findMany({
                    where: {
                        NOT: {
                            cafe: null
                        }
                    },
                    orderBy: orderBy,
                    include: {
                        cafe: true,
                    },
                });
            break;

            case availablePlaceTypes[2]:
                _places = await prisma.osm_Place.findMany({
                    where: {
                        NOT: {
                            fast_food: null
                        }
                    },
                    orderBy: orderBy,
                    include: {
                        fast_food: true,
                    },
                });
            break;
        }
    }
    else 
    {
        switch(_req.query.amenity)
        {
            case availablePlaceTypes[0]:
                _places = await prisma.osm_Place.findMany({
                    where: {
                        NOT: {
                            restaurant: null
                        }
                    },
                    orderBy: {
                        restaurant: orderBy
                    },
                    include: {
                        restaurant: true,
                    },
                });
            break;

            case availablePlaceTypes[1]:
                _places = await prisma.osm_Place.findMany({
                    where: {
                        NOT: {
                            cafe: null
                        }
                    },
                    orderBy: {
                        cafe: orderBy
                    },
                    include: {
                        cafe: true,
                    },
                });
            break;
                
            case availablePlaceTypes[2]:
                _places = await prisma.osm_Place.findMany({
                    where: {
                        NOT: {
                            fast_food: null
                        }
                    },
                    orderBy: {
                        fast_food: orderBy
                    },
                    include: {
                        fast_food: true,
                    },
                });
            break;
        }
    }
    if(_places != null && _places != undefined)
    {
        const flattenedPlace = flattenArrayOfObjects(_places);
            
        res.render("place/index", 
        { 
            title: "Places",
            availablePlaceTypes: availablePlaceTypes,
            placeAttributes: getPlaceAttributesByAmenity(_req.query.amenity),
            places: flattenedPlace,
            input: {
                orderby: _req.query.orderby,
                orderdirection: _req.query.orderdirection,
                amenity: _req.query.amenity,
            },
        });
    }
    else
    {
        res.render("place/index", {
            title: "Places",
            availablePlaceTypes: availablePlaceTypes,
            placeAttributes: undefined,
            places: undefined,
            input: {
                amenity: _req.query.amenity,
            }
        });
    }
}

// MARK: view
const placeView = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    var _id:number = Number(_req.params.id); 
    var _place = await prisma.osm_Place.findUnique({
        where: {id: _id},
        include: {
            restaurant: true,
        },
    })

    res.render("place/view", 
    {
        title: "place: " + _place?.name,
        place: _place,
        placeOSM: undefined,
        placeAttributes: getPlaceAttributesByAmenity(_place!.amenity!.toString()),
    });
}

// MARK: update preview
async function placeUpdatePreview(_req: any, res: { render: (arg0: string, arg1: {}) => void; }) {

    var _id:number = Number(_req.params.id); 

    var _place = await prisma.osm_Place.findFirst({
        where: {id: _id},
        include: {
            restaurant: true
        }
    })
    
    if(_place != null)
    {
        try
        {
            var osmQuery = `
                [out:json][timeout:25];
                node(id:placeID); out;
            `;
            let node:string = _place.node.toString();
            
            var editedOSMQuery = osmQuery.replace('placeID', node);
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(editedOSMQuery)}`)
            
            var placeResponse = await response.json();

            var placeResponseArray: any;

            switch(_place.amenity)
            {
                case availablePlaceTypes[0]:
                    placeResponseArray = mapping.mapRestaurant(placeResponse);
                break;
                case availablePlaceTypes[1]:
                    placeResponseArray = mapping.mapCafe(placeResponse);
                break;
                case availablePlaceTypes[2]:
                    placeResponseArray = mapping.mapFastFood(placeResponse);
                break;
            }
        }
        catch(error)
        {
            console.log(error)
        }
    }
    else
    {
        console.log("error, place not found")
    }

    var _flattenedPlace = flattenObject(_place);       
    placeResponseArray[0].id      = _place?.id;
    placeResponseArray[0].node      = _place?.node;
    placeResponseArray[0].updated = placeResponse.osm3s.timestamp_osm_base

    res.render("place/view", {
        title: "place: " + _place?.name,
        place: _flattenedPlace,
        placeAttributes: getPlaceAttributesByAmenity(_place!.amenity!.toString()),
        placeOSM: placeResponseArray[0]
    } );
}

const placeUpdate = async (_req: any, res: { redirect: (arg0: string) => void }) => {


    res.redirect("/place-index");

}

// MARK: delete
const placeDelete = async (_req: any, res: { redirect: (arg0: string) => void }) => {
    var _id:number = Number(_req.params.id); 
    
    await prisma.osm_Restaurant.delete({
        where: {fk_placeId: _id}
    })

    await prisma.osm_Place.delete({
        where: {id: _id}
    })
    res.redirect("/place-index")
}

// MARK: find
const placeFind = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {

    const downloadedPlaces = await prisma.osm_Place.findMany({
        select: {
            node: true,
        },
    });
    const downloadedPlacesNodes = downloadedPlaces.map(item => item.node)

    if(_req.query.box != undefined && _req.query.box != '')
    {
        var osmQuery = `
            [out:json][timeout:25];
            nwr["amenity"="placetype"]({{bbox}});
            out;
        `;
        
        var boxedOSMQuery = osmQuery.replace('{{bbox}}', _req.query.box);
        var placedOSMQuery = boxedOSMQuery.replace('placetype', _req.query.amenity);

        try{
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(placedOSMQuery)}`)
            
            var placeResponse = await response.json();
            
            var placeArray: any;
            switch(_req.query.amenity)
            {
                case availablePlaceTypes[0]:
                    placeArray = mapping.mapRestaurant(placeResponse);
                break;
                case availablePlaceTypes[1]:
                    placeArray = mapping.mapCafe(placeResponse);
                break;
                case availablePlaceTypes[2]:
                    placeArray = mapping.mapFastFood(placeResponse);
                break;
            }
            
            res.render("place/find", {
                title: "Found Places",
                places: placeArray,
                boxerror: false,
                placeAttributes: getPlaceAttributesByAmenity(_req.query.amenity),
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
            placeAttributes: undefined,
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
    
    var placeExists: object | null = await prisma.osm_Place.findFirst({
        where: {node: place.id}
    })

    if(placeExists == null)
    {
        switch(place.amenity)
        {
            case availablePlaceTypes[0]:
                await prisma.osm_Place.create({
                    data: {
                        node:               place.id                == '-' ? null : place.id,
                        name:               place.name              == '-' ? null : place.name,
                        amenity:            "restaurant",
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
            break;

            case availablePlaceTypes[1]:
                await prisma.osm_Place.create({
                    data: {
                        node:               place.id                == '-' ? null : place.id,
                        name:               place.name              == '-' ? null : place.name,
                        amenity:            "cafe",
                        lat:                place.lat               == '-' ? null : place.lat,
                        long:               place.long              == '-' ? null : place.long,        
                        city:               place.city              == '-' ? null : place.city,   
                        housenumber:        place.housenumber       == '-' ? null : Number(place.housenumber),
                        postcode:           place.postcode          == '-' ? null : Number(place.postcode),
                        street:             place.street            == '-' ? null : place.street,
                        
                        cafe: {
                            create: {
                                operator:           place.operator          == '-' ? null : place.operator,
                                website:            place.website           == '-' ? null : place.website,
                                phone:              place.phone             == '-' ? null : place.phone,
                                opening_hours:      place.opening_hours     == '-' ? null : place.opening_hours,
                                brand:              place.brand             == '-' ? null : place.brand,
                                
                                smoking:            place.smoking           == '-' ? undefined : Boolean(place.smoking),
                                self_service:       place.self_service      == '-' ? undefined : Boolean(place.self_service),

                                wheelchair:         place.wheelchair        == '-' ? null : place.wheelchair,
                                outdoor_seating:    place.outdoor_seating   == '-' ? undefined : Boolean(place.outdoor_seating),
                                indoor_seating:     place.indoor_seating    == '-' ? undefined : Boolean(place.indoor_seating),
                                dog:                place.dog               == '-' ? null : place.dog,
            
                                cuisine:            place.cuisine           == '-' ? null : place.cuisine,
                                organic:            place.organic           == '-' ? null : place.organic,
                                takeaway:           place.takeaway          == '-' ? null : place.takeaway,
                                ice_cream:          place.ice_cream         == '-' ? null : place.ice_cream,
                                bakery:             place.bakery            == '-' ? undefined : Boolean(place.bakery),
                                pastry:             place.pastry            == '-' ? undefined : Boolean(place.pastry),

                                diet_kosher:        place.diet_kosher       == '-' ? undefined : Boolean(place.diet_kosher),
                                diet_diabetes:      place.diet_diabetes     == '-' ? undefined : Boolean(place.diet_diabetes),
                                diet_halal:         place.diet_halal        == '-' ? undefined : Boolean(place.diet_halal),
                                diet_vegan:         place.diet_vegan        == '-' ? undefined : Boolean(place.diet_vegan),
                                diet_vegetarian:    place.diet_vegetarian   == '-' ? undefined : Boolean(place.diet_vegetarian)
                            } 
                        }
                    },
                })
            break;

            case availablePlaceTypes[2]:
                await prisma.osm_Place.create({
                    data: {
                        node:               place.id                == '-' ? null : place.id,
                        name:               place.name              == '-' ? null : place.name,
                        amenity:            "fast_food",
                        lat:                place.lat               == '-' ? null : place.lat,
                        long:               place.long              == '-' ? null : place.long,        
                        city:               place.city              == '-' ? null : place.city,   
                        housenumber:        place.housenumber       == '-' ? null : Number(place.housenumber),
                        postcode:           place.postcode          == '-' ? null : Number(place.postcode),
                        street:             place.street            == '-' ? null : place.street,
                        
                        fast_food: {
                            create: {
                                operator:           place.operator          == '-' ? null : place.operator,
                                website:            place.website           == '-' ? null : place.website,
                                phone:              place.phone             == '-' ? null : place.phone,
                                brand:              place.brand             == '-' ? null : place.brand,
                                
                                cuisine:            place.cuisine           == '-' ? null : place.cuisine,
                                organic:            place.organic           == '-' ? null : place.organic,
                                takeaway:           place.takeaway          == '-' ? null : place.takeaway,
                                delivery:           place.delivery          == '-' ? null : place.delivery,
                                
                                drive_through:      place.drive_through     == '-' ? undefined : Boolean(place.drive_through),
                                drive_in:           place.drive_in          == '-' ? undefined : Boolean(place.drive_in),
                                opening_hours:      place.opening_hours     == '-' ? null : place.opening_hours,

                                wheelchair:         place.wheelchair        == '-' ? null : place.wheelchair,
                                outdoor_seating:    place.outdoor_seating   == '-' ? undefined : Boolean(place.outdoor_seating),
                                capacity:           place.wheelchair        == '-' ? null : place.capacity,
                                dog:                place.dog               == '-' ? null : place.dog,
            
                                ice_cream:          place.ice_cream         == '-' ? null : place.ice_cream,
                                bakery:             place.bakery            == '-' ? undefined : Boolean(place.bakery),
                                pastry:             place.pastry            == '-' ? undefined : Boolean(place.pastry),

                                diet_kosher:        place.diet_kosher       == '-' ? undefined : Boolean(place.diet_kosher),
                                diet_diabetes:      place.diet_diabetes     == '-' ? undefined : Boolean(place.diet_diabetes),
                                diet_halal:         place.diet_halal        == '-' ? undefined : Boolean(place.diet_halal),
                                diet_vegan:         place.diet_vegan        == '-' ? undefined : Boolean(place.diet_vegan),
                                diet_vegetarian:    place.diet_vegetarian   == '-' ? undefined : Boolean(place.diet_vegetarian)
                            } 
                        }
                    },
                })
            break;
        }
        res.redirect("/place-index")
    }
    else
    {
        res.redirect("/place-find")
    }
}

const placeEdit = (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => 
{
    if (!prisma.osm_Place) {
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
    placeAdd,
    placeUpdate,
    placeUpdatePreview,
};
