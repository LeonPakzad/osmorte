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
                name:               tags.name               == undefined ? '-' : tags.name,
                lat:                element.lat             == undefined ? '-' : element.lat,
                long:               element.lon             == undefined ? '-' : element.lon,
                city:               tags.city               == undefined ? '-' : tags.city,
                postcode:           tags.postcode           == undefined ? '-' : tags.postcode,
                street:             tags.street             == undefined ? '-' : tags.street,
                housenumber:        tags.housenumber        == undefined ? '-' : tags.housenumber, 

                email:              tags.email              == undefined ? '-' : tags.email, 
                operator:           tags.operator           == undefined ? '-' : tags.operator,
                website:            tags.website            == undefined ? '-' : tags.website,
                opening_hours:      tags.opening_hours      == undefined ? '-' : tags.opening_hours,
                
                
                wheelchair:         tags.wheelchair         == undefined ? '-' : tags.wheelchair,
                outdoor_seating:    tags.outdoor_seating    == undefined ? '-' : tags.outdoor_seating,
                dog:                tags.dog                == undefined ? '-' : tags.dog,
                
                cuisine:            tags.cuisine            == undefined ? '-' : tags.cuisine,
                lunch:              tags.lunch              == undefined ? '-' : tags.lunch,
                organic:            tags.organic            == undefined ? '-' : tags.organic,
                takeaway:           tags.takeaway           == undefined ? '-' : tags.takeaway,
                
                diet_kosher:        tags.diet_kosher        == undefined ? '-' : tags.diet_kosher,
                diet_diabetes:      tags.diet_diabetes      == undefined ? '-' : tags.diet_diabetes,
                diet_halal:         tags.diet_halal         == undefined ? '-' : tags.diet_halal,
                diet_vegan:         tags.diet_vegan         == undefined ? '-' : tags.diet_vegan,   
                diet_vegetarian:    tags.diet_vegetarian    == undefined ? '-' : tags.diet_vegetarian,
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
                name:               tags.name               == undefined ? '-' : tags.name,
                lat:                element.lat             == undefined ? '-' : element.lat,
                long:               element.lon             == undefined ? '-' : element.lon,
                city:               tags.city               == undefined ? '-' : tags.city,
                postcode:           tags.postcode           == undefined ? '-' : tags.postcode,
                street:             tags.street             == undefined ? '-' : tags.street,
                housenumber:        tags.housenumber        == undefined ? '-' : tags.housenumber, 

                operator:           tags.operator           == undefined ? '-' : tags.operator,
                website:            tags.website            == undefined ? '-' : tags.website,
                phone:              tags.phone              == undefined ? '-' : tags.phone,
                opening_hours:      tags.opening_hours      == undefined ? '-' : tags.opening_hours,
                brand:              tags.brand              == undefined ? '-' : tags.brand,
                smoking:            tags.smoking            == undefined ? '-' : tags.smoking, 
                self_service:       tags.self_service       == undefined ? '-' : tags.self_service, 
                
                
                wheelchair:         tags.wheelchair         == undefined ? '-' : tags.wheelchair,
                outdoor_seating:    tags.outdoor_seating    == undefined ? '-' : tags.outdoor_seating,
                indoor_seating:    tags.indoor_seating      == undefined ? '-' : tags.indoor_seating,
                dog:                tags.dog                == undefined ? '-' : tags.dog,
                
                cuisine:            tags.cuisine            == undefined ? '-' : tags.cuisine,
                organic:            tags.organic            == undefined ? '-' : tags.organic,
                takeaway:           tags.takeaway           == undefined ? '-' : tags.takeaway,
                ice_cream:          tags.ice_cream          == undefined ? '-' : tags.ice_cream,
                bakery:             tags.bakery             == undefined ? '-' : tags.bakery,
                pastry:             tags.pastry             == undefined ? '-' : tags.pastry,
                
                diet_kosher:        tags.diet_kosher        == undefined ? '-' : tags.diet_kosher,
                diet_diabetes:      tags.diet_diabetes      == undefined ? '-' : tags.diet_diabetes,
                diet_halal:         tags.diet_halal         == undefined ? '-' : tags.diet_halal,
                diet_vegan:         tags.diet_vegan         == undefined ? '-' : tags.diet_vegan,   
                diet_vegetarian:    tags.diet_vegetarian    == undefined ? '-' : tags.diet_vegetarian,
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
                name:               tags.name               == undefined ? '-' : tags.name,
                lat:                element.lat             == undefined ? '-' : element.lat,
                long:               element.lon             == undefined ? '-' : element.lon,
                city:               tags.city               == undefined ? '-' : tags.city,
                postcode:           tags.postcode           == undefined ? '-' : tags.postcode,
                street:             tags.street             == undefined ? '-' : tags.street,
                housenumber:        tags.housenumber        == undefined ? '-' : tags.housenumber, 

                operator:           tags.operator           == undefined ? '-' : tags.operator,
                website:            tags.website            == undefined ? '-' : tags.website,
                phone:              tags.phone              == undefined ? '-' : tags.phone,
                brand:              tags.brand              == undefined ? '-' : tags.brand,
                
                cuisine:            tags.cuisine            == undefined ? '-' : tags.cuisine,
                organic:            tags.organic            == undefined ? '-' : tags.organic,
                takeaway:           tags.takeaway           == undefined ? '-' : tags.takeaway,
                delivery:           tags.delivery           == undefined ? '-' : tags.delivery, 
                drive_through:      tags.drive_through      == undefined ? '-' : tags.drive_through, 
                drive_in:           tags.drive_in           == undefined ? '-' : tags.drive_in, 
                opening_hours:      tags.opening_hours      == undefined ? '-' : tags.opening_hours,
                
                
                wheelchair:         tags.wheelchair         == undefined ? '-' : tags.wheelchair,
                outdoor_seating:    tags.outdoor_seating    == undefined ? '-' : tags.outdoor_seating,
                capacity:           tags.capacity           == undefined ? '-' : tags.capacity,
                dog:                tags.dog                == undefined ? '-' : tags.dog,
                
                ice_cream:          tags.ice_cream          == undefined ? '-' : tags.ice_cream,
                bakery:             tags.bakery             == undefined ? '-' : tags.bakery,
                pastry:             tags.pastry             == undefined ? '-' : tags.pastry,
                
                diet_kosher:        tags.diet_kosher        == undefined ? '-' : tags.diet_kosher,
                diet_diabetes:      tags.diet_diabetes      == undefined ? '-' : tags.diet_diabetes,
                diet_halal:         tags.diet_halal         == undefined ? '-' : tags.diet_halal,
                diet_vegan:         tags.diet_vegan         == undefined ? '-' : tags.diet_vegan,   
                diet_vegetarian:    tags.diet_vegetarian    == undefined ? '-' : tags.diet_vegetarian,
            };
        });
    }
}