import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module fastfood {

    export function placeCreate(place: any) {

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
        place: {   
            id: number; node: number; name: string; lat: number; long: number; city: string; housenumber: number; postcode: number; street: string;
            email: string; operator: string; website: string; opening_hours: string; wheelchair: string; outdoor_seating: boolean; dog: boolean; 
            cuisine: string; lunch: string; organic: string; takeaway: string;
            diet_kosher: boolean; diet_diabetes: boolean; diet_halal: boolean; diet_vegan: boolean; diet_vegetarian: boolean; 
        }
    ) 
    {
        try 
        {
            await prisma.osm_Place.update({
                where: {
                    id: place.id,
                },
                data: {
                    node:               place.node,
                    name:               place.name,          
                    amenity:            "fastfood",
                    lat:                place.lat,           
                    long:               place.long,          
                    city:               place.city,          
                    housenumber:        Number(place.housenumber),   
                    postcode:           Number(place.postcode),      
                    street:             place.street,        
                    
                    restaurant: {
                        update: {
                            email:              place.email,            
                            operator:           place.operator,        
                            website:            place.website,          
                            opening_hours:      place.opening_hours,    
                            
                            wheelchair:         place.wheelchair,       
                            outdoor_seating:    Boolean(place.outdoor_seating),  
                            dog:                place.dog,              
        
                            cuisine:            place.cuisine,          
                            lunch:              place.lunch,            
                            organic:            place.organic,          
                            takeaway:           place.takeaway,         
                            diet_kosher:        Boolean(place.diet_kosher),      
                            diet_diabetes:      Boolean(place.diet_diabetes),    
                            diet_halal:         Boolean(place.diet_halal),       
                            diet_vegan:         Boolean(place.diet_vegan),       
                            diet_vegetarian:    Boolean(place.diet_vegetarian),  
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
}