import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module doctors {

    const amenity = "doctors";
    
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
                postcode:           tags.postcode           == undefined || null? null  : tags.postcode,
                street:             tags.street             == undefined || null? null  : tags.street,
                housenumber:        tags.housenumber        == undefined || null? null  : tags.housenumber, 

                operator:           tags.operator           == undefined || null? null  : tags.operator,
                website:            tags.website            == undefined || null? null  : tags.website,
                phone:              tags.phone              == undefined || null? null  : tags.phone,
                brand:              tags.brand              == undefined || null? null  : tags.brand,
                opening_hours:      tags.opening_hours      == undefined || null? null  : tags.opening_hours,

                healthcare:         tags.healthcare         == undefined || null? null  : tags.healthcare,
                speciality:         tags.speciality         == undefined || null? null  : tags.speciality,
                emergency:          tags.emergency          == undefined || null? null  : tags.emergency,
                wheelchair:         tags.wheelchair         == undefined || null? null  : tags.wheelchair,

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
                
                doctors: {
                    create: {

                        operator:           _place.operator          == '-' ? null      : _place.operator,
                        website:            _place.website           == '-' ? null      : _place.website,
                        phone:              _place.phone             == '-' ? null      : _place.phone,
                        brand:              _place.brand             == '-' ? null      : _place.brand,
                        opening_hours:      _place.opening_hours     == '-' ? null      : _place.opening_hours,
                        
                        healthcare:         _place.healthcare         == '-' ? null      : _place.healthcare,
                        speciality:         _place.speciality         == '-' ? null      : _place.speciality,
                        emergency:          _place.emergency          == '-' ? undefined : Boolean(_place.diet_kosher),
                        wheelchair:         _place.wheelchair         == '-' ? null      : _place.wheelchair,
                    } 
                }
            },
        })
    }
    
    export async function placeReadOne(_id: number) {
        var place = await prisma.osm_Place.findFirst({
            where: {id: _id},
            include: {
                doctors: true,
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
                        doctors: null
                    }
                },
                orderBy: _orderBy,
                include: {
                    doctors: true,
                },
            });
        }
        else
        {
            places = await prisma.osm_Place.findMany({
                where: {
                    NOT: {
                        doctors: null
                    }
                },
                orderBy: {
                    doctors: _orderBy
                },
                include: {
                    doctors: true,
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
            healthcare: string, speciality: string, emergency: boolean, wheelchair: string,
 
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
                    
                    doctors: {
                        update: {
                            operator:           _place.operator,        
                            website:            _place.website,          
                            phone:              _place.phone,    
                            brand:              _place.brand,    
                            opening_hours:      _place.opening_hours,    
                        
                            healthcare:         _place.healthcare, 
                            speciality:         _place.speciality, 
                            emergency:          _place.emergency,
                            wheelchair:         _place.wheelchair, 
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