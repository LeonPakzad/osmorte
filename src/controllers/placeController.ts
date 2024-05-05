import fetch from 'node-fetch';

import {mapping} from "../controllers/placeMapping"

// import places
import { restaurant } from '../controllers/places/restaurantController';
import { cafe } from '../controllers/places/cafeController';
import { fastfood } from '../controllers/places/fastfoodController';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// MARK: place attribute definitions
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
    'operator', 'website', 'phone', 'brand', 'opening_hours', 

    'smoking', 'self_service',
    'wheelchair','outdoor_seating', 'indoor_seating', 'dog',

    'cuisine', 'organic','takeaway', 
    'ice_cream', 'bakery', 'pastry',

    'diet_kosher','diet_diabetes','diet_halal','diet_vegan','diet_vegetarian',   
];

const fastFoodCols= [
    'operator', 'website', 'phone', 'brand', 'opening_hours',

    'drive_through', 'drive_in',
    'wheelchair','outdoor_seating', 'capacity', 'dog',

    'cuisine','organic','takeaway', 'delivery',
    'ice_cream', 'bakery', 'pastry',

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

function flattenArrayOfObjects(array: any[]): FlattenedObject[] {
    return array.map((object: any) => {
        return flattenObject(object);
    });
}

function flattenObject(object: any, parentId?: string): FlattenedObject {

    const flattenedObject: FlattenedObject = {};

    // Iterate over each key in the input object.
    Object.keys(object).forEach((key: string) => {

        // Check if the current key is "id" and if a parentId is provided. If so, construct a composite key.
        if (key === 'id' && parentId) 
        {
            flattenedObject[`${parentId}_${key}`] = object[key];
        }

        // If the current value is an object and not null, and it's not an instance of Date, recurse into it.
        else if (typeof object[key] === 'object' && object[key] !== null && !(object[key] instanceof Date)) 
        {
            const flattened = flattenObject(object[key], key);
            Object.assign(flattenedObject, flattened);
        }
        else 
        {
            flattenedObject[key] = object[key];
        }
    });

    return flattenedObject;
}

function convertToReadableDate(dateString: string): string {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    return date.toLocaleString('en-US', options);
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
                _places = await restaurant.placeReadMany(orderBy, true);
            break;

            case availablePlaceTypes[1]:
                _places = await cafe.placeReadMany(orderBy, true);

            break;

            case availablePlaceTypes[2]:
                _places = await fastfood.placeReadMany(orderBy, true);

            break;
        }
    }
    else 
    {
        switch(_req.query.amenity)
        {
            case availablePlaceTypes[0]:
                _places = await restaurant.placeReadMany(orderBy, false);
            break;

            case availablePlaceTypes[1]:
                _places = await cafe.placeReadMany(orderBy, false);
            break;
                
            case availablePlaceTypes[2]:
                _places = await fastfood.placeReadMany(orderBy, false);
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
    var place: any;
    var req = JSON.parse(decodeURIComponent(_req.params.params))
    var amenity:string = req.amenity;
    var id:number = Number(req.id); 

    try 
    {
        switch(amenity)
        {
            case availablePlaceTypes[0]:
                place = await restaurant.placeReadOne(id);
            break;
            case availablePlaceTypes[1]:
                place = await cafe.placeReadOne(id)
            break;
            case availablePlaceTypes[2]:
                place = await fastfood.placeReadOne(id)
            break;
        }
    }
    catch(error)
    {
        console.log(error);
    }

    res.render("place/view", 
    {
        title: "place: " + place.name,
        place: flattenObject(place),
        placeOSM: undefined,
        placeAttributes: getPlaceAttributesByAmenity(place.amenity.toString()),
    });
}

// MARK: update preview
async function placeUpdatePreview(_req: any, res: { render: (arg0: string, arg1: {}) => void; }) {

    var _place: any;
    var req = JSON.parse(decodeURIComponent(_req.params.params))
    var amenity:string = req.amenity;
    var id:number = Number(req.id); 
    
    try 
    {
        switch(amenity)
        {
            case availablePlaceTypes[0]:
                _place = await restaurant.placeReadOne(id);
            break;
            case availablePlaceTypes[1]:
                _place = await cafe.placeReadOne(id)
            break;
            case availablePlaceTypes[2]:
                _place = await fastfood.placeReadOne(id)
            break;
        }
    }
    catch(error)
    {
        console.log(error);
    }
    
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
    placeResponseArray[0].node    = _place?.node;
    placeResponseArray[0].updated = convertToReadableDate(placeResponse.osm3s.timestamp_osm_base)

    res.render("place/view", {
        title: "place: " + _place?.name,
        place: _flattenedPlace,
        placeAttributes: getPlaceAttributesByAmenity(_place!.amenity!.toString()),
        placeOSM: placeResponseArray[0]
    } );
}

// MARK: update
const placeUpdate = async (_req: any, res: { redirect: (arg0: string) => void }) => {

    const place = JSON.parse(decodeURIComponent(_req.params.params))
    try {
        switch(place.amenity)
        {
            case availablePlaceTypes[0]:
                restaurant.placeUpdate(place);
            break;
            case availablePlaceTypes[1]:
                cafe.placeUpdate(place)
            break;
            case availablePlaceTypes[2]:
                fastfood.placeUpdate(place)
            break;
        }
    }
    catch(error)
    {
        console.log(error)
    }
    res.redirect("/place/"+_req.params.params);
}

// MARK: delete
const placeDelete = async (_req: any, res: { redirect: (arg0: string) => void }) => {

    const place = JSON.parse(decodeURIComponent(_req.params.params))
    try 
    {
        await prisma.osm_Place.delete({
            where: {id: place.id}
        })
    }
    catch(error)
    {
        console.log(error)
    }

    res.redirect("/place-index?amenity="+place.amenity)
}

const placeDeleteByAmenity = async (_req: any, res: { redirect: (arg0: string) => void }) => {

    const place = JSON.parse(decodeURIComponent(_req.params.params))
    try {
        switch(place.amenity)
        {
            case availablePlaceTypes[0]:
                restaurant.placeDeleteAll();
            break;
            case availablePlaceTypes[1]:
                cafe.placeDeleteAll()
            break;
            case availablePlaceTypes[2]:
                fastfood.placeDeleteAll()
            break;
        }
    }
    catch(error)
    {
        console.log(error)
    }
    res.redirect("/place-index?amenity="+place.amenity);
}

const placeDeleteAll = async (_req: any, res: { redirect: (arg0: string) => void }) => {

    try 
    {
        await prisma.osm_Place.deleteMany({})
    }
    catch(error)
    {
        console.log(error)
    }

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

    if(_req.query.box != undefined && _req.query.box != '' && _req.query.box != null)
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
                await restaurant.placeCreate(place);
            break;

            case availablePlaceTypes[1]:
                await cafe.placeCreate(place)
            break;

            case availablePlaceTypes[2]:
                await fastfood.placeCreate(place)
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
    placeDeleteByAmenity,
    placeDeleteAll,
    placeEdit,
    placeFind,
    placeAdd,
    placeUpdate,
    placeUpdatePreview,
};
