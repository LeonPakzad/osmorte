import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module cafe {

    const amenity = "cafe";
    
    interface TagMap {
        [key: string]: string;
    }

    export function map(object: { elements: { id: number; amenity: string; lat: any; lon: any; tags: any; }[]; }) {
        return object.elements.map((element: { id: number; amenity: string; lat: any; lon: any; tags: any; }) => 
        {
            // sanitize tags
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
                amenity:            amenity,
                name:               tags.name               == undefined || null? null  : tags.name,
                lat:                element.lat             == undefined || null? null  : element.lat,
                long:               element.lon             == undefined || null? null  : element.lon,
                city:               tags.city               == undefined || null? null  : tags.city,
                postcode:           tags.postcode           == undefined || null? null  : Number(tags.postcode),
                street:             tags.street             == undefined || null? null  : tags.street,
                housenumber:        tags.housenumber        == undefined || null? null  : Number(tags.housenumber), 

                operator:           tags.operator           == undefined || null? null  : tags.operator,
                website:            tags.website            == undefined || null? null  : tags.website,
                phone:              tags.phone              == undefined || null? null  : tags.phone,
                opening_hours:      tags.opening_hours      == undefined || null? null  : tags.opening_hours,
                brand:              tags.brand              == undefined || null? null  : tags.brand,

                smoking:            tags.smoking            == undefined || null? false : Boolean(tags.smoking), 
                self_service:       tags.self_service       == undefined || null? false : Boolean(tags.self_service), 
                
                wheelchair:         tags.wheelchair         == undefined || null ? null : tags.wheelchair,
                outdoor_seating:    tags.outdoor_seating    == undefined || null ? false: Boolean(tags.outdoor_seating),
                indoor_seating:     tags.indoor_seating     == undefined || null ? false: Boolean(tags.indoor_seating),
                dog:                tags.dog                == undefined || null ? null : tags.dog,
                
                cuisine:            tags.cuisine            == undefined || null ? null : tags.cuisine,
                organic:            tags.organic            == undefined || null ? null : tags.organic,
                takeaway:           tags.takeaway           == undefined || null ? null : tags.takeaway,
                ice_cream:          tags.ice_cream          == undefined || null ? null : Boolean(tags.ice_cream),
                bakery:             tags.bakery             == undefined || null ? false: Boolean(tags.bakery),
                pastry:             tags.pastry             == undefined || null ? false: Boolean(tags.pastry),
                
                diet_kosher:        tags.diet_kosher        == undefined || null ? false: Boolean(tags.diet_kosher),
                diet_diabetes:      tags.diet_diabetes      == undefined || null ? false: Boolean(tags.diet_diabetes),
                diet_halal:         tags.diet_halal         == undefined || null ? false: Boolean(tags.diet_halal),
                diet_vegan:         tags.diet_vegan         == undefined || null ? false: Boolean(tags.diet_vegan),   
                diet_vegetarian:    tags.diet_vegetarian    == undefined || null ? false: Boolean(tags.diet_vegetarian),
            };
        });
    }
    
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
                
                cafe: {
                    create: {
                        operator:           _place.operator          == '-' ? null      : _place.operator,
                        website:            _place.website           == '-' ? null      : _place.website,
                        phone:              _place.phone             == '-' ? null      : _place.phone,
                        opening_hours:      _place.opening_hours     == '-' ? null      : _place.opening_hours,
                        brand:              _place.brand             == '-' ? null      : _place.brand,
                        
                        smoking:            _place.smoking           == '-' ? undefined : Boolean(_place.smoking),
                        self_service:       _place.self_service      == '-' ? undefined : Boolean(_place.self_service),

                        wheelchair:         _place.wheelchair        == '-' ? null      : _place.wheelchair,
                        outdoor_seating:    _place.outdoor_seating   == '-' ? undefined : Boolean(_place.outdoor_seating),
                        indoor_seating:     _place.indoor_seating    == '-' ? undefined : Boolean(_place.indoor_seating),
                        dog:                _place.dog               == '-' ? null      : _place.dog,
    
                        cuisine:            _place.cuisine           == '-' ? null      : _place.cuisine,
                        organic:            _place.organic           == '-' ? null      : _place.organic,
                        takeaway:           _place.takeaway          == '-' ? null      : _place.takeaway,
                        ice_cream:          _place.ice_cream         == '-' ? undefined : Boolean(_place.ice_cream),
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
    
    export async function placeReadOne(_id: number) {
        var place = await prisma.osm_Place.findFirst({
            where: {id: _id},
            include: {
                cafe: true,
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
                        cafe: null
                    }
                },
                orderBy: _orderBy,
                include: {
                    cafe: true,
                },
            });
        }
        else
        {
            places = await prisma.osm_Place.findMany({
                where: {
                    NOT: {
                        cafe: null
                    }
                },
                orderBy: {
                    cafe: _orderBy
                },
                include: {
                    cafe: true,
                },
            });
        }

        return places;
    }

    export async function placeUpdate
    (
        _place: {   
            id: number, node: number, name: string, lat: number, long: number, city: string, housenumber: number, postcode: number, street: string,
            operator: string, website: string, phone:string, opening_hours: string, brand:string,
            smoking:boolean, self_service: boolean, wheelchair: string, outdoor_seating: boolean, indoor_seating:boolean, dog: boolean, 
            cuisine: string, lunch: string, organic: string, takeaway: string, ice_cream: boolean, bakery: boolean, pastry: boolean,
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
                    
                    cafe: {
                        update: {
                            operator:           _place.operator,        
                            website:            _place.website,          
                            phone:              _place.phone,    
                            opening_hours:      _place.opening_hours,    
                            brand:              _place.brand,    
                            
                            smoking:            Boolean(_place.smoking),       
                            self_service:       Boolean(_place.self_service),

                            wheelchair:         _place.wheelchair,       
                            outdoor_seating:    Boolean(_place.outdoor_seating),  
                            indoor_seating:     Boolean(_place.indoor_seating),  
                            dog:                _place.dog,              
        
                            cuisine:            _place.cuisine,          
                            organic:            _place.organic,          
                            takeaway:           _place.takeaway,         
                            ice_cream:          Boolean(_place.ice_cream),            
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
            console.log('updating the place went wrong:' + error)
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