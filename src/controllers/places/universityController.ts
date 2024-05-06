import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export module university {

    const amenity = "university"

    interface TagMap {
        [key: string]: string;
    }

    export function map(object: { elements: { id: number; amenity: string; lat: any; lon: any; tags: any; }[]; }) {
        return object.elements.map((element: { id: number; amenity: string; lat: any; lon: any; tags: any; }) => 
        {
            // sanitize university tags
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

                description:        tags.description        == undefined || null? null : tags.description, 
                email:              tags.email              == undefined || null? null : tags.email, 
                operator:           tags.operator           == undefined || null? null : tags.operator, 
                website:            tags.email              == undefined || null? null : tags.email, 
                phone:              tags.phone              == undefined || null? null : tags.phone,
                
                internet_access:    tags.internet_access    == undefined || null? null : tags.internet_access, 
                internet_access_fee:tags.internet_access_fee== undefined || null? null : tags.internet_access_fee, 
                office:             tags.office             == undefined || null? null : tags.office,
                
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
                
                university: {
                    create: {
                        description:        _place.description          == '-' ? null : _place.description,
                        email:              _place.email                == '-' ? null : _place.email,
                        operator:           _place.operator             == '-' ? null : _place.operator,
                        website:            _place.website              == '-' ? null : _place.website,
                        phone:              _place.phone                == '-' ? null : _place.phone,
                        
                        internet_access:    _place.internet_access      == '-' ? null : _place.internet_access,
                        internet_access_fee:_place.internet_access_fee  == '-' ? null : _place.internet_access_fee,
                        office:             _place.office               == '-' ? null : _place.office,
                        wheelchair:         _place.wheelchair           == '-' ? null : _place.wheelchair,
                        wikipedia:          _place.wikipedia            == '-' ? null : _place.wikipedia,

                    } 
                }
            },
        })
    }

    export async function placeReadOne(_id: number) {
        var place = await prisma.osm_Place.findFirst({
            where: {id: _id},
            include: {
                university: true,
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
                        university: null
                    }
                },
                orderBy: _orderBy,
                include: {
                    university: true,
                },
            });
        }
        else
        {
            places = await prisma.osm_Place.findMany({
                where: {
                    NOT: {
                        university: null
                    }
                },
                orderBy: {
                    university: _orderBy
                },
                include: {
                    university: true,
                },
            });
        }

        return places;
    }

    export async function placeUpdate
    (
        _place: {   
            id: number, node: number, name: string, lat: number, long: number, city: string, housenumber: number, postcode: number, street: string,
            description: string, email: string, operator: string, website: string, phone:string,
            internet_access: string, internet_access_fee: string, office: string, wheelchair: string, wikipedia: string
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
                    
                    university: {
                        update: {
                            description:        _place.description,         
                            email:              _place.email,               
                            operator:           _place.operator,            
                            website:            _place.website,             
                            phone:              _place.phone,               
                            
                            internet_access:    _place.internet_access,     
                            internet_access_fee:_place.internet_access_fee, 
                            office:             _place.office,              
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