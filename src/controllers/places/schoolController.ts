import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module school {

    const amenity = "school"

    interface TagMap {
        [key: string]: string;
    }

    export function map(object: { elements: { id: number; amenity: string; lat: any; lon: any; tags: any; }[]; }) {
        return object.elements.map((element: { id: number; amenity: string; lat: any; lon: any; tags: any; }) => 
        {
            // sanitize school tags
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
                name:               tags.name               == undefined || null? null : tags.name,
                lat:                element.lat             == undefined || null? null : element.lat,
                long:               element.lon             == undefined || null? null : element.lon,
                city:               tags.city               == undefined || null? null : tags.city,
                postcode:           tags.postcode           == undefined || null? null : tags.postcode,
                street:             tags.street             == undefined || null? null : tags.street,
                housenumber:        tags.housenumber        == undefined || null? null : tags.housenumber, 

                old_name:           tags.old_name           == undefined || null ? null : tags.old_name, 
                description:        tags.description        == undefined || null ? null : tags.description, 
                note:               tags.note               == undefined || null ? null : tags.note, 
                email:              tags.email              == undefined || null ? null : tags.email, 
                operator:           tags.operator           == undefined || null? null : tags.operator,
                website:            tags.website            == undefined || null? null : tags.website,
                phone:              tags.phone              == undefined || null? null : tags.phone,
                opening_hours:      tags.opening_hours      == undefined || null? null : tags.opening_hours,
                
                
                grades:             tags.grades             == undefined || null? null : tags.grades,
                isced:              tags.isced              == undefined || null? null : tags.isced,
                wheelchair:         tags.wheelchair         == undefined || null? null : tags.wheelchair,
                wikipedia:          tags.wikipedia          == undefined || null? null : tags.wikipedia,

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
                
                school: {
                    create: {
                        old_name:           _place.old_name           == '-' ? null : _place.old_name,
                        description:        _place.description        == '-' ? null : _place.description,
                        note:               _place.note               == '-' ? null : _place.note,
                        email:              _place.email              == '-' ? null : _place.email,
                        operator:           _place.operator           == '-' ? null : _place.operator,
                        website:            _place.website            == '-' ? null : _place.website,
                        phone:              _place.phone              == '-' ? null : _place.phone,
                        opening_hours:      _place.opening_hours      == '-' ? null : _place.opening_hours,
                                        
                                        
                        grades:             _place.grades             == '-' ? null : _place.grades, 
                        isced:              _place.isced              == '-' ? null : _place.isced,
                        wheelchair:         _place.wheelchair         == '-' ? null : _place.wheelchair,
                        wikipedia:          _place.wikipedia          == '-' ? null : _place.wikipedia,
                    } 
                }
            },
        })
    }

    export async function placeReadOne(_id: number) {
        var place = await prisma.osm_Place.findFirst({
            where: {id: _id},
            include: {
                school: true,
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
                        school: null
                    }
                },
                orderBy: _orderBy,
                include: {
                    school: true,
                },
            });
        }
        else
        {
            places = await prisma.osm_Place.findMany({
                where: {
                    NOT: {
                        school: null
                    }
                },
                orderBy: {
                    school: _orderBy
                },
                include: {
                    school: true,
                },
            });
        }

        return places;
    }

    export async function placeUpdate
    (
        _place: {   
            id: number, node: number, name: string, lat: number, long: number, city: string, housenumber: number, postcode: number, street: string,
            old_name: string, description: string, note: string, email: string, operator: string, website: string, phone: string, opening_hours: string, 
            grades: string, isced:  string, wheelchair: string, wikipedia: string,  
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
                    
                    school: {
                        update: {
                            old_name:           _place.old_name,       
                            description:        _place.description,    
                            note:               _place.note,           
                            email:              _place.email,          
                            operator:           _place.operator,       
                            website:            _place.website,        
                            phone:              _place.phone,          
                            opening_hours:      _place.opening_hours,  
                                            
                            grades:             _place.grades,         
                            isced:              _place.isced,          
                            wheelchair:         _place.wheelchair,     
                            wikipedia:          _place.wikipedia,      
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