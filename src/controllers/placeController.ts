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

const availablePlaceTypes= [
    "restaurant", "cafe", "fast_food"
]

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
            amenity:            'restaurant',
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

function getPlaceColsByAmenity(_amenity: string) {
    switch(_amenity)
    {
        case availablePlaceTypes[0]:
            return restaurantPlaceCols;
        case availablePlaceTypes[1]:
            return cafePlaceCols;
        case availablePlaceTypes[2]:
            return fastFoodPlaceCols;
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
    if(placeCols.indexOf(_req.query.orderby) != -1)
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
            placecols: getPlaceColsByAmenity(_req.query.amenity),
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
            placecols: undefined,
            places: undefined,
            input: {
                amenity: _req.query.amenity,
            }
            });
    }
}

const placeView = async (_req: any, res: { render: (arg0: string, arg1: {}) => void; }) => {
    var _id:number = Number(_req.params.id); 
    var _place = await prisma.osm_Place.findUnique({
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
        nwr["amenity"="place"]({{bbox}});
        out;
        `;
        
        var boxedOSMQuery = osmQuery.replace('{{bbox}}', _req.query.box);
        var placedOSMQuery = boxedOSMQuery.replace('place', _req.query.amenity);

        try{
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(placedOSMQuery)}`)
            
            var placeResponse = await response.json();
            
            var placeArray = mapRestaurant(placeResponse);

            res.render("place/find", {
                title: "Found Places",
                places: placeArray,
                boxerror: false,
                placecols: getPlaceColsByAmenity(_req.query.amenity),
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
    
    var placeExists: object | null = await prisma.osm_Place.findFirst({
        where: {node: place.id}
    })

    if(placeExists == null)
    {
        console.log(_req.query.amenity)
        switch(place.amenity)
        {
            case availablePlaceTypes[0]:
                await prisma.osm_Place.create({
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
            break;

            case availablePlaceTypes[1]:
                await prisma.osm_Place.create({
                    data: {
                        node:               place.id                == '-' ? null : place.id,
                        name:               place.name              == '-' ? null : place.name,
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
    placeAdd
};
