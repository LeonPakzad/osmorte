import fetch from 'node-fetch';

// import places
import { atm } from '../controllers/places/atmController';
import { bar } from '../controllers/places/barController';
import { cafe } from '../controllers/places/cafeController';
import { doctors } from '../controllers/places/doctorsController';
import { fastfood } from '../controllers/places/fastfoodController';
import { restaurant } from '../controllers/places/restaurantController';
import { school } from '../controllers/places/schoolController';
import { university } from '../controllers/places/universityController';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// MARK: place attribute definitions
const placeAttributes = [
    'id', 'name', 'node', 'updated',
    'lat', 'long', 'city', 'postcode', 'street', 'housenumber',
];

const atmCols = [
    'description','operator', 'brand', 
    'network', 'level', 'cash_in',
    'indoor', 'man_made', 'opening_hours', 'wheelchair', 'surveillence',
];

const barCols = [
    'email', 'operator', 'website', 'opening_hours', 

    'smoking', 'internet_access',

    'wheelchair','outdoor_seating','dog',
    'cuisine','lunch','organic','takeaway',

    'brewery', 

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

const doctorsCols = [
    'operator','website','phone', 'opening_hours', 'brand',         
    'healthcare','speciality', 'emergency',     
];

const fastFoodCols= [
    'operator', 'website', 'phone', 'brand', 'opening_hours',

    'drive_through', 'drive_in',
    'wheelchair','outdoor_seating', 'capacity', 'dog',

    'cuisine','organic','takeaway', 'delivery',
    'ice_cream', 'bakery', 'pastry',

    'diet_kosher','diet_diabetes','diet_halal','diet_vegan','diet_vegetarian',   
];

const restaurantCols = [  
    'email', 'operator', 'website', 'opening_hours', 

    'wheelchair','outdoor_seating','dog',
    'cuisine','lunch','organic','takeaway',

    'diet_kosher','diet_diabetes','diet_halal','diet_vegan','diet_vegetarian',   
];

const schoolCols = [
    'old_name', 
    'description', 'note', 'email', 'operator', 'website', 'phone', 'opening_hours', 
    
    'grades', 'isced',

    'wheelchair',
    'wikipedia',
];

const universityCols = [
    'description', 'email', 'operator', 'website', 'phone',
    'internet_access', 'internet_access_fee',
    'office',
    'wheelchair',
    'wikipedia',
];

const atmPlaceAttributes            = placeAttributes.concat(atmCols);
const barPlaceAttributes            = placeAttributes.concat(barCols);
const cafePlaceAttributes           = placeAttributes.concat(cafeCols);
const doctorsPlaceAttributes        = placeAttributes.concat(doctorsCols);
const fastFoodPlaceAttributes       = placeAttributes.concat(fastFoodCols);
const restaurantPlaceAttributes     = placeAttributes.concat(restaurantCols);
const schoolPlaceAttributes         = placeAttributes.concat(schoolCols);
const universityPlaceAttributes     = placeAttributes.concat(universityCols);

const availablePlaceTypes= [
    "atm",
    "bar",
    "cafe",
    "doctors",
    "fast_food",
    "restaurant",
    "school",
    "university",
];

// MARK: helpers
function getPlaceAttributesByAmenity(_amenity: string) {
    switch(_amenity)
    {
        case availablePlaceTypes[0]:
            return atmPlaceAttributes;
        case availablePlaceTypes[1]:
            return barPlaceAttributes;
        case availablePlaceTypes[2]:
            return cafePlaceAttributes;
        case availablePlaceTypes[3]:
            return doctorsPlaceAttributes;
        case availablePlaceTypes[4]:
            return fastFoodPlaceAttributes;
        case availablePlaceTypes[5]:
            return restaurantPlaceAttributes;
        case availablePlaceTypes[6]:
            return schoolPlaceAttributes;
        case availablePlaceTypes[7]:
            return universityPlaceAttributes;
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
                _places = await atm.placeReadMany(orderBy, true);
            break;
            case availablePlaceTypes[1]:
                _places = await bar.placeReadMany(orderBy, true);
            break;
            case availablePlaceTypes[2]:
                _places = await cafe.placeReadMany(orderBy, true);
            break;
            case availablePlaceTypes[3]:
                _places = await doctors.placeReadMany(orderBy, true);
            break;
            case availablePlaceTypes[4]:
                _places = await fastfood.placeReadMany(orderBy, true);
            break;
            case availablePlaceTypes[5]:
                _places = await restaurant.placeReadMany(orderBy, true);
            break;
            case availablePlaceTypes[6]:
                _places = await school.placeReadMany(orderBy, true);
            break;
            case availablePlaceTypes[7]:
                _places = await university.placeReadMany(orderBy, true);
            break;
        }
    }
    else 
    {
        switch(_req.query.amenity)
        {
            case availablePlaceTypes[0]:
                _places = await atm.placeReadMany(orderBy, false);
            break;
            case availablePlaceTypes[1]:
                _places = await bar.placeReadMany(orderBy, false);
            break;
            case availablePlaceTypes[2]:
                _places = await cafe.placeReadMany(orderBy, false);
            break;
            case availablePlaceTypes[3]:
                _places = await doctors.placeReadMany(orderBy, false);
            break;
            case availablePlaceTypes[4]:
                _places = await fastfood.placeReadMany(orderBy, false);
            break;          
            case availablePlaceTypes[5]:
                _places = await restaurant.placeReadMany(orderBy, false);
            break;
            case availablePlaceTypes[6]:
                _places = await school.placeReadMany(orderBy, false);
            break;
            case availablePlaceTypes[7]:
                _places = await university.placeReadMany(orderBy, false);
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
                place = await atm.placeReadOne(id);
            break;
            case availablePlaceTypes[1]:
                place = await bar.placeReadOne(id);
            break;
            case availablePlaceTypes[2]:
                place = await cafe.placeReadOne(id)
            break;
            case availablePlaceTypes[3]:
                place = await doctors.placeReadOne(id)
            break;
            case availablePlaceTypes[4]:
                place = await fastfood.placeReadOne(id)
            break;
            case availablePlaceTypes[5]:
                place = await restaurant.placeReadOne(id)
            break;
            case availablePlaceTypes[6]:
                place = await school.placeReadOne(id)
            break;
            case availablePlaceTypes[7]:
                place = await university.placeReadOne(id)
            break;
        }
    }
    catch(error)
    {
        console.log(error);
    }

    res.render("place/view", 
    {
        error: undefined,
        title: "place: " + place.name ? place.name : place.node,
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
                _place = await atm.placeReadOne(id);
            break;
            case availablePlaceTypes[1]:
                _place = await bar.placeReadOne(id);
            break;
            case availablePlaceTypes[2]:
                _place = await cafe.placeReadOne(id)
            break;
            case availablePlaceTypes[3]:
                _place = await doctors.placeReadOne(id)
            break;
            case availablePlaceTypes[4]:
                _place = await fastfood.placeReadOne(id)
            break;
            case availablePlaceTypes[5]:
                _place = await restaurant.placeReadOne(id)
            break;
            case availablePlaceTypes[6]:
                _place = await school.placeReadOne(id)
            break;
            case availablePlaceTypes[7]:
                _place = await university.placeReadOne(id)
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
            let node:string = _place.node.toString();
            var osmQuery = `
                [out:json][timeout:25];
                node(id:placeID); out;
            `;
            var editedOSMQuery = osmQuery.replace('placeID', node);
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(editedOSMQuery)}`)
            
            var placeResponse = await response.json();

            var placeResponseArray: any;

            if(placeResponse.elements.length === 0)
            {
                throw new Error("response is empty");
            }

            switch(_place.amenity)
            {
                case availablePlaceTypes[0]:
                    placeResponseArray = atm.map(placeResponse);
                break;
                case availablePlaceTypes[1]:
                    placeResponseArray = bar.map(placeResponse);
                break;
                case availablePlaceTypes[2]:
                    placeResponseArray = cafe.map(placeResponse);
                break;
                case availablePlaceTypes[3]:
                    placeResponseArray = doctors.map(placeResponse);
                break;
                case availablePlaceTypes[4]:
                    placeResponseArray = fastfood.map(placeResponse);
                break;
                case availablePlaceTypes[5]:
                    placeResponseArray = restaurant.map(placeResponse);
                break;
                case availablePlaceTypes[6]:
                    placeResponseArray = school.map(placeResponse);
                break;
                case availablePlaceTypes[7]:
                    placeResponseArray = university.map(placeResponse);
                break;
            }
            
            var _flattenedPlace = flattenObject(_place); 
            placeResponseArray[0].id      = _place?.id;
            placeResponseArray[0].node    = _place?.node;
            placeResponseArray[0].updated = convertToReadableDate(placeResponse.osm3s.timestamp_osm_base)
        
            res.render("place/view", {
                error: undefined,
                title: "place: " + _place?.name,
                place: _flattenedPlace,
                placeAttributes: getPlaceAttributesByAmenity(_place!.amenity!.toString()),
                placeOSM: placeResponseArray[0]
            } );
        }
        catch(e)
        {
            console.log(e)
        }
    }
    else
    {
        console.log("error, place not found")
    }

    res.render("place/view", 
    {
        title: "place: " + _place.name ? _place.name : _place.node,
        place: flattenObject(_place),
        placeOSM: undefined,
        placeAttributes: getPlaceAttributesByAmenity(_place.amenity.toString()),
    });

}

// MARK: update
const placeUpdate = async (_req: any, res: { redirect: (arg0: string) => void }) => {

    const place = JSON.parse(decodeURIComponent(_req.params.params))
    try {
        switch(place.amenity)
        {
            case availablePlaceTypes[0]:
                atm.placeUpdate(place);
            break;
            case availablePlaceTypes[1]:
                bar.placeUpdate(place);
            break;
            case availablePlaceTypes[2]:
                cafe.placeUpdate(place)
            break;
            case availablePlaceTypes[3]:
                doctors.placeUpdate(place)
            break;
            case availablePlaceTypes[4]:
                fastfood.placeUpdate(place)
            break;
            case availablePlaceTypes[5]:
                restaurant.placeUpdate(place)
            break;
            case availablePlaceTypes[6]:
                school.placeUpdate(place)
            break;
            case availablePlaceTypes[7]:
                university.placeUpdate(place)
            break;
        }
    }
    catch(error)
    {
        console.log(error)
    }
    res.redirect("/place/"+encodeURIComponent(JSON.stringify({id: place.id, amenity: place.amenity})))
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
                atm.placeDeleteAll();
            break;
            case availablePlaceTypes[1]:
                bar.placeDeleteAll();
            break;
            case availablePlaceTypes[2]:
                cafe.placeDeleteAll()
            break;
            case availablePlaceTypes[3]:
                doctors.placeDeleteAll()
            break;
            case availablePlaceTypes[4]:
                fastfood.placeDeleteAll()
            break;
            case availablePlaceTypes[5]:
                restaurant.placeDeleteAll()
            break;
            case availablePlaceTypes[6]:
                school.placeDeleteAll()
            break;
            case availablePlaceTypes[7]:
                university.placeDeleteAll()
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
    
    if(_req.query.box != undefined && _req.query.box.trim() != '' && _req.query.box != null )
    {                       
        var osmQuery = `
            [out:json][timeout:25];
            nwr["amenity"="placetype"]({{bbox}});
            out;
        `;
        
        var boxedOSMQuery   = osmQuery.replace('{{bbox}}', _req.query.box);
        var placedOSMQuery  = boxedOSMQuery.replace('placetype', _req.query.amenity);

        try{
            const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(placedOSMQuery)}`)
            
            var placeResponse = await response.json();
        
            var placeArray: any;
            switch(_req.query.amenity)
            {
                case availablePlaceTypes[0]:
                    placeArray = atm.map(placeResponse);
                break;
                case availablePlaceTypes[1]:
                    placeArray = bar.map(placeResponse);
                break;
                case availablePlaceTypes[2]:
                    placeArray = cafe.map(placeResponse);
                break;
                case availablePlaceTypes[3]:
                    placeArray = doctors.map(placeResponse);
                break;
                case availablePlaceTypes[4]:
                    placeArray = fastfood.map(placeResponse);
                break;
                case availablePlaceTypes[5]:
                    placeArray = restaurant.map(placeResponse);
                break;
                case availablePlaceTypes[6]:
                    placeArray = school.map(placeResponse);
                break;
                case availablePlaceTypes[7]:
                    placeArray = university.map(placeResponse);
                break;
            }
            
            res.render("place/find", {
                title: "Found Places",
                places: placeArray,
                boxerror: false,
                placeAttributes: getPlaceAttributesByAmenity(_req.query.amenity),
                downloadedPlaces: downloadedPlacesNodes,
                availablePlaceTypes: availablePlaceTypes,

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
            availablePlaceTypes: availablePlaceTypes,

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
                await atm.placeCreate(place);
            break;
            case availablePlaceTypes[1]:
                await bar.placeCreate(place);
            break;
            case availablePlaceTypes[2]:
                await cafe.placeCreate(place)
            break;
            case availablePlaceTypes[3]:
                await doctors.placeCreate(place)
            break;
            case availablePlaceTypes[4]:
                await fastfood.placeCreate(place)
            break;
            case availablePlaceTypes[5]:
                await restaurant.placeCreate(place)
            break;
            case availablePlaceTypes[6]:
                await school.placeCreate(place)
            break;
            case availablePlaceTypes[7]:
                await university.placeCreate(place)
            break;
        }
        res.redirect("/place-index")
    }
    else
    {
        res.redirect("/place-find")
    }
}

// MARK: function export
module.exports =  {
    placeIndexView,
    placeView,
    placeDelete,
    placeDeleteByAmenity,
    placeDeleteAll,
    placeFind,
    placeAdd,
    placeUpdate,
    placeUpdatePreview,
};