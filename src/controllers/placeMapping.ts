export module mapping {
    
    interface TagMap {
        [key: string]: string;
    }

    export function mapRestaurant(restaurantObject: { elements: { id: number; amenity: string; lat: any; lon: any; tags: any; }[]; }) {
        return restaurantObject.elements.map((element: { id: number; amenity: string; lat: any; lon: any; tags: any; }) => 
        {
            // sanitize restaurant tags
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
                amenity:            'restaurant',
                name:               tags.name               == undefined || null? null : tags.name,
                lat:                element.lat             == undefined || null? null : element.lat,
                long:               element.lon             == undefined || null? null : element.lon,
                city:               tags.city               == undefined || null? null : tags.city,
                postcode:           tags.postcode           == undefined || null? null : tags.postcode,
                street:             tags.street             == undefined || null? null : tags.street,
                housenumber:        tags.housenumber        == undefined || null? null : tags.housenumber, 

                email:              tags.email              == undefined || tags.email == null ? null : tags.email, 
                operator:           tags.operator           == undefined || null? null : tags.operator,
                website:            tags.website            == undefined || null? null : tags.website,
                opening_hours:      tags.opening_hours      == undefined || null? null : tags.opening_hours,
                
                
                wheelchair:         tags.wheelchair         == undefined || null? null : tags.wheelchair,
                outdoor_seating:    tags.outdoor_seating    == undefined || null? false : tags.outdoor_seating,
                dog:                tags.dog                == undefined || null? null : tags.dog,
                
                cuisine:            tags.cuisine            == undefined || null? null : tags.cuisine,
                lunch:              tags.lunch              == undefined || null? null : tags.lunch,
                organic:            tags.organic            == undefined || null? null : tags.organic,
                takeaway:           tags.takeaway           == undefined || null? null : tags.takeaway,
                
                diet_kosher:        tags.diet_kosher        == undefined || null? false : tags.diet_kosher,
                diet_diabetes:      tags.diet_diabetes      == undefined || null? false : tags.diet_diabetes,
                diet_halal:         tags.diet_halal         == undefined || null? false : tags.diet_halal,
                diet_vegan:         tags.diet_vegan         == undefined || null? false : tags.diet_vegan,   
                diet_vegetarian:    tags.diet_vegetarian    == undefined || null? false : tags.diet_vegetarian,
            };
        });
    }

    export function mapCafe(restaurantObject: { elements: { id: number; amenity: string; lat: any; lon: any; tags: any; }[]; }) {
        return restaurantObject.elements.map((element: { id: number; amenity: string; lat: any; lon: any; tags: any; }) => 
        {
            // sanitize restaurant tags
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
                amenity:            'cafe',
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
                opening_hours:      tags.opening_hours      == undefined || null? null  : tags.opening_hours,
                brand:              tags.brand              == undefined || null? null  : tags.brand,
                smoking:            tags.smoking            == undefined || null? false: tags.smoking, 
                self_service:       tags.self_service       == undefined || null? false: tags.self_service, 
                
                
                wheelchair:         tags.wheelchair         == undefined || null ? null  : tags.wheelchair,
                outdoor_seating:    tags.outdoor_seating    == undefined || null ? false: tags.outdoor_seating,
                indoor_seating:    tags.indoor_seating      == undefined || null ? false: tags.indoor_seating,
                dog:                tags.dog                == undefined || null ? null  : tags.dog,
                
                cuisine:            tags.cuisine            == undefined || null ? null  : tags.cuisine,
                organic:            tags.organic            == undefined || null ? null  : tags.organic,
                takeaway:           tags.takeaway           == undefined || null ? null  : tags.takeaway,
                ice_cream:          tags.ice_cream          == undefined || null ? null  : tags.ice_cream,
                bakery:             tags.bakery             == undefined || null ? false: tags.bakery,
                pastry:             tags.pastry             == undefined || null ? false: tags.pastry,
                
                diet_kosher:        tags.diet_kosher        == undefined || null ? false: tags.diet_kosher,
                diet_diabetes:      tags.diet_diabetes      == undefined || null ? false: tags.diet_diabetes,
                diet_halal:         tags.diet_halal         == undefined || null ? false: tags.diet_halal,
                diet_vegan:         tags.diet_vegan         == undefined || null ? false: tags.diet_vegan,   
                diet_vegetarian:    tags.diet_vegetarian    == undefined || null ? false: tags.diet_vegetarian,
            };
        });
    }

    export function mapFastFood(restaurantObject: { elements: { id: number; amenity: string; lat: any; lon: any; tags: any; }[]; }) {
        return restaurantObject.elements.map((element: { id: number; amenity: string; lat: any; lon: any; tags: any; }) => 
        {
            // sanitize restaurant tags
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
                amenity:            'fast_food',
                name:               tags.name               == undefined || null? null : tags.name,
                lat:                element.lat             == undefined || null? null : element.lat,
                long:               element.lon             == undefined || null? null : element.lon,
                city:               tags.city               == undefined || null? null : tags.city,
                postcode:           tags.postcode           == undefined || null? null : tags.postcode,
                street:             tags.street             == undefined || null? null : tags.street,
                housenumber:        tags.housenumber        == undefined || null? null : tags.housenumber, 

                operator:           tags.operator           == undefined || null? null : tags.operator,
                website:            tags.website            == undefined || null? null : tags.website,
                phone:              tags.phone              == undefined || null? null : tags.phone,
                brand:              tags.brand              == undefined || null? null : tags.brand,
                
                cuisine:            tags.cuisine            == undefined || null? null : tags.cuisine,
                organic:            tags.organic            == undefined || null? null : tags.organic,
                takeaway:           tags.takeaway           == undefined || null? null : tags.takeaway,
                delivery:           tags.delivery           == undefined || null? null : tags.delivery, 
                drive_through:      tags.drive_through      == undefined || null? false : tags.drive_through, 
                drive_in:           tags.drive_in           == undefined || null? false : tags.drive_in, 
                opening_hours:      tags.opening_hours      == undefined || null? null : tags.opening_hours,
                
                
                wheelchair:         tags.wheelchair         == undefined || null? null : tags.wheelchair,
                outdoor_seating:    tags.outdoor_seating    == undefined || null? false : tags.outdoor_seating,
                capacity:           tags.capacity           == undefined || null? null : tags.capacity,
                dog:                tags.dog                == undefined || null? null : tags.dog,
                
                ice_cream:          tags.ice_cream          == undefined || null? null : tags.ice_cream,
                bakery:             tags.bakery             == undefined || null? false : tags.bakery,
                pastry:             tags.pastry             == undefined || null? false : tags.pastry,
                
                diet_kosher:        tags.diet_kosher        == undefined || null? false : tags.diet_kosher,
                diet_diabetes:      tags.diet_diabetes      == undefined || null? false : tags.diet_diabetes,
                diet_halal:         tags.diet_halal         == undefined || null? false : tags.diet_halal,
                diet_vegan:         tags.diet_vegan         == undefined || null? false : tags.diet_vegan,   
                diet_vegetarian:    tags.diet_vegetarian    == undefined || null? false : tags.diet_vegetarian,
            };
        });
    }
}