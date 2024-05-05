import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module fastfood {

    const amenity = "fast_food";

    export async function placeCreate(_place: any) {
        try
        {
            await prisma.osm_Place.create({
                data: {
                    node:               _place.id                == '-' ? null : _place.id,
                    name:               _place.name              == '-' ? null : _place.name,
                    amenity:            amenity,
                    lat:                _place.lat               == '-' ? null : _place.lat,
                    long:               _place.long              == '-' ? null : _place.long,        
                    city:               _place.city              == '-' ? null : _place.city,   
                    housenumber:        _place.housenumber       == '-' ? undefined : Number(_place.housenumber),
                    postcode:           _place.postcode          == '-' ? undefined : Number(_place.postcode),
                    street:             _place.street            == '-' ? null : _place.street,
                    
                    fast_food: {
                        create: {
                            operator:           _place.operator          == '-' ? null : _place.operator,
                            website:            _place.website           == '-' ? null : _place.website,
                            phone:              _place.phone             == '-' ? null : _place.phone,
                            brand:              _place.brand             == '-' ? null : _place.brand,
                            
                            cuisine:            _place.cuisine           == '-' ? null : _place.cuisine,
                            organic:            _place.organic           == '-' ? null : _place.organic,

                            takeaway:           _place.takeaway          == '-' ? null : _place.takeaway,
                            delivery:           _place.delivery          == '-' ? null : _place.delivery,
                            drive_through:      _place.drive_through     == '-' ? undefined : Boolean(_place.drive_through),
                            drive_in:           _place.drive_in          == '-' ? undefined : Boolean(_place.drive_in),
                            opening_hours:      _place.opening_hours     == '-' ? null : _place.opening_hours,

                            wheelchair:         _place.wheelchair        == '-' ? null : _place.wheelchair,
                            outdoor_seating:    _place.outdoor_seating   == '-' ? undefined : Boolean(_place.outdoor_seating),
                            capacity:           _place.wheelchair        == '-' ? null : _place.capacity,
                            dog:                _place.dog               == '-' ? null : _place.dog,

                            ice_cream:          _place.ice_cream         == '-' ? null : _place.ice_cream,
                            bakery:             _place.bakery            == '-' ? undefined : Boolean(_place.bakery),
                            pastry:             _place.pastry            == '-' ? undefined : Boolean(_place.pastry),

                            diet_kosher:        _place.diet_kosher       == '-' ? undefined : Boolean(_place.diet_kosher),
                            diet_diabetes:      _place.diet_diabetes     == '-' ? undefined : Boolean(_place.diet_diabetes),
                            diet_halal:         _place.diet_halal        == '-' ? undefined : Boolean(_place.diet_halal),
                            diet_vegan:         _place.diet_vegan        == '-' ? undefined : Boolean(_place.diet_vegan),
                            diet_vegetarian:    _place.diet_vegetarian   == '-' ? undefined : Boolean(_place.diet_vegetarian)
                        } 
                    }
                },
            })
        }
        catch(error)
        {
            console.log(error)
        }

    }
    
    export async function placeReadOne(_id: number) {
        var place = await prisma.osm_Place.findFirst({
            where: {id: _id},
            include: {
                fast_food: true,
            },
        })

        return place;
    }

    export async function placeReadMany(_orderBy: any, _isPlaceAttribute: Boolean) {
        var places:any;
        if(_isPlaceAttribute)
        {
            places = await prisma.osm_Place.findMany({
                where: {
                    NOT: {
                        fast_food: null
                    }
                },
                orderBy: _orderBy,
                include: {
                    fast_food: true,
                },
            });
        }
        else
        {
            places = await prisma.osm_Place.findMany({
                where: {
                    NOT: {
                        fast_food: null
                    }
                },
                orderBy: {
                    fast_food: _orderBy
                },
                include: {
                    fast_food: true,
                },
            });
        }

        return places;
    }

    export async function placeUpdate
    (
        _place: {   
            id: number, node: number, name: string, lat: number, long: number, city: string, housenumber: number, postcode: number, street: string,
            operator: string, website: string, phone:string, brand:string,
            cuisine: string, organic: string, takeaway: string, delivery: string, 
            drive_through: boolean, drive_in: boolean, opening_hours: string,
            wheelchair: string, outdoor_seating: boolean, capacity:string, dog: boolean, 
            ice_cream: boolean, bakery: boolean, pastry: boolean,
            diet_kosher: boolean, diet_diabetes: boolean, diet_halal: boolean, diet_vegan: boolean, diet_vegetarian: boolean, 
        }
    ) 
    {
        try 
        {
            await prisma.osm_Place.update({
                where: {
                    id: _place.id,
                },
                data: {
                    node:               _place.node,
                    name:               _place.name,          
                    amenity:            amenity,
                    lat:                _place.lat,           
                    long:               _place.long,          
                    city:               _place.city,          
                    housenumber:        Number(_place.housenumber),   
                    postcode:           Number(_place.postcode),      
                    street:             _place.street,        
                    
                    fast_food: {
                        update: {
                            operator:           _place.operator,        
                            website:            _place.website,          
                            phone:              _place.phone,    
                            brand:              _place.brand,    
                            
                            cuisine:            _place.cuisine,          
                            organic:            _place.organic, 
                                     
                            takeaway:           _place.takeaway,         
                            delivery:           _place.delivery,      

                            drive_through:      Boolean(_place.drive_through),       
                            drive_in:           Boolean(_place.drive_in),       
                            opening_hours:      _place.opening_hours,    

                            wheelchair:         _place.wheelchair,       
                            outdoor_seating:    Boolean(_place.outdoor_seating),  
                            capacity:           _place.capacity,  
                            dog:                _place.dog,              
        
                            ice_cream:          _place.ice_cream,
                            bakery:             Boolean(_place.bakery),
                            pastry:             Boolean(_place.pastry),

                            diet_kosher:        Boolean(_place.diet_kosher),      
                            diet_diabetes:      Boolean(_place.diet_diabetes),    
                            diet_halal:         Boolean(_place.diet_halal),       
                            diet_vegan:         Boolean(_place.diet_vegan),       
                            diet_vegetarian:    Boolean(_place.diet_vegetarian),  
                        } 
                    }
                },
            })
        }
        catch(error)
        {
            console.log('updating the restaurant went wrong:' + error)
        }
    }

    export async function placeDelete(_id: number) { 
        try 
        {
            await prisma.osm_Place.delete({
                where: {id: _id}
            })
        }
        catch(error)
        {
            console.log(error)
        }
    }

    export async function placeDeleteAll() {
        try
        {
            await prisma.osm_Place.deleteMany({
                where: {
                    amenity : amenity,
                }
            })
        }
        catch(error)
        {
            console.log(error)
        }
    }
}