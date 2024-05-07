import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module atm {

    const amenity = "atm";
    
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
                postcode:           tags.postcode           == undefined || null? null  : Boolean(tags.postcode),
                street:             tags.street             == undefined || null? null  : tags.street,
                housenumber:        tags.housenumber        == undefined || null? null  : Boolean(tags.housenumber), 

                description:        tags.description        == undefined || null? null  : tags.description,
                operator:           tags.operator           == undefined || null? null  : tags.operator,
                brand:              tags.brand              == undefined || null? null  : tags.brand,
                network:            tags.network            == undefined || null? null  : tags.network,
                level:              tags.level              == undefined || null? null  : Number(tags.level),
                cash_in:            tags.cash_in            == undefined || null? null  : Boolean(tags.cash_in),
                indoor:             tags.indoor             == undefined || null? null  : Boolean(tags.indoor),
                man_made:           tags.man_made           == undefined || null? null  : tags.man_made,
                opening_hours:      tags.opening_hours      == undefined || null? null  : tags.opening_hours,
                
                wheelchair:         tags.wheelchair         == undefined || null? null : tags.wheelchair,
                surveillence:       tags.brand              == undefined || null? null  : tags.surveillence,

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
                
                atm: {
                    create: {

                        description:        _place.description        == '-' ? null      : _place.description,
                        operator:           _place.operator           == '-' ? null      : _place.operator,
                        brand:              _place.brand              == '-' ? null      : _place.brand,
                        network:            _place.network            == '-' ? null      : _place.network,
                        level:              _place.level              == '-' ? undefined : Number(_place.level),
                        cash_in:            _place.cash_in            == '-' ? undefined : Boolean(_place.cash_in),
                        indoor:             _place.indoor             == '-' ? undefined : Boolean(_place.indoor),
                        man_made:           _place.man_made           == '-' ? null      : _place.man_made,
                        opening_hours:      _place.opening_hours      == '-' ? null      : _place.opening_hours,
                        
                        
                        wheelchair:         _place.wheelchair         == '-' ? null      : _place.wheelchair,
                        surveillence:       _place.surveillence       == '-' ? null      : _place.surveillence,
                    } 
                }
            },
        })
    }
    
    export async function placeReadOne(_id: number) {
        var place = await prisma.osm_Place.findFirst({
            where: {id: _id},
            include: {
                atm: true,
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
                        atm: null
                    }
                },
                orderBy: _orderBy,
                include: {
                    atm: true,
                },
            });
        }
        else
        {
            places = await prisma.osm_Place.findMany({
                where: {
                    NOT: {
                        atm: null
                    }
                },
                orderBy: {
                    atm: _orderBy
                },
                include: {
                    atm: true,
                },
            });
        }

        return places;
    }

    export async function placeUpdate
    (
        _place: {   
            id: number, node: number, name: string, lat: number, long: number, city: string, housenumber: number, postcode: number, street: string,
            description: string, operator: string, brand:string, network: string, level:number, cash_in:boolean, indoor: boolean,
            man_made: string, opening_hours: string, wheelchair: string, surveillence: string,
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
                    
                    atm: {
                        update: {
                            description:        _place.description,  
                            operator:           _place.operator,  
                            brand:              _place.brand,  
                            network:            _place.network,  
                            level:              _place.level,  
                            cash_in:            Boolean(_place.cash_in),  
                            indoor:             Boolean(_place.indoor),  
                            man_made:           _place.man_made,  
                            opening_hours:      _place.opening_hours,  
                            
                            
                            wheelchair:         _place.wheelchair,  
                            surveillence:       _place.surveillence,  
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