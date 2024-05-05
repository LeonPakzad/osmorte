import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module restaurant {

    const amenity = "restaurant"
    export async function placeCreate(_place: any) {
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
                
                restaurant: {
                    create: {
                        email:              _place.email             == '-' ? null : _place.email,
                        operator:           _place.operator          == '-' ? null : _place.operator,
                        website:            _place.website           == '-' ? null : _place.website,
                        opening_hours:      _place.opening_hours     == '-' ? null : _place.opening_hours,
                        
                        wheelchair:         _place.wheelchair        == '-' ? null : _place.wheelchair,
                        outdoor_seating:    _place.outdoor_seating   == '-' ? undefined : Boolean(_place.outdoor_seating),
                        dog:                _place.dog               == '-' ? null : _place.dog,
    
                        cuisine:            _place.cuisine           == '-' ? null : _place.cuisine,
                        lunch:              _place.lunch             == '-' ? null : _place.lunch,
                        organic:            _place.organic           == '-' ? null : _place.organic,
                        takeaway:           _place.takeaway          == '-' ? null : _place.takeaway,
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

    export async function placeReadOne(_id: number) {
        var place = await prisma.osm_Place.findFirst({
            where: {id: _id},
            include: {
                restaurant: true,
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
                        restaurant: null
                    }
                },
                orderBy: _orderBy,
                include: {
                    restaurant: true,
                },
            });
        }
        else
        {
            places = await prisma.osm_Place.findMany({
                where: {
                    NOT: {
                        restaurant: null
                    }
                },
                orderBy: {
                    restaurant: _orderBy
                },
                include: {
                    restaurant: true,
                },
            });
        }

        return places;
    }

    export async function placeUpdate
    (
        _place: {   
            id: number, node: number, name: string, lat: number, long: number, city: string, housenumber: number, postcode: number, street: string,
            email: string, operator: string, website: string, opening_hours: string, wheelchair: string, outdoor_seating: boolean, dog: boolean, 
            cuisine: string, lunch: string, organic: string, takeaway: string,
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
                    
                    restaurant: {
                        update: {
                            email:              _place.email,            
                            operator:           _place.operator,        
                            website:            _place.website,          
                            opening_hours:      _place.opening_hours,    
                            
                            wheelchair:         _place.wheelchair,       
                            outdoor_seating:    Boolean(_place.outdoor_seating),  
                            dog:                _place.dog,              
        
                            cuisine:            _place.cuisine,          
                            lunch:              _place.lunch,            
                            organic:            _place.organic,          
                            takeaway:           _place.takeaway,         
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