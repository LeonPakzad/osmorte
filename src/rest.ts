import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await getPlacesAll();
    await addPlace();
    // await getPlacesAll();
    
    // await updatePlace("");
    // await getPlace(1);
    // await getPlacesLimited(1);
    // await getPlacesLimited(1);
    
    // await deletePlacesAll();
    // await getPlacesAll();
}

async function addPlace()
{
    await prisma.place.create({
        data: {
            fk_place: 12,
            node: 123,
            name: 'Alice',
            email: 'place@test.com',
            website: 'www.place.com',
            opening_hours: "Fr: 12:00-18:00",
            lat: 1.0,
            long: 1.0,        
            city: 'test',   
            housenumber: 1,
            postcode: 11111,
            street: 'teststreet',
            cuisine: 'italian',
            diet_vegan: false,
            diet_vegetarian: false
        },
    })
}

async function getPlacesAll()
{
    const allPlaces = await prisma.place.findMany();
}

async function getPlacesLimited(_maxNumber:number)
{
    const allPlaces = await prisma.place.findMany({take: _maxNumber})
}

async function getPlace(_id:number)
{
    const allPlaces = await prisma.place.findUnique({
        where: {id: _id}
    })
}

async function deletePlacesAll()
{
    const deletePlaces = await prisma.place.deleteMany();
}

async function deletePlace(_id:number)
{
    const deletePlace = await prisma.place.delete({where: {id: _id}})
}

async function updatePlace (
    _email:string, _website:string, _opening_hours: string, 
    _lat:number, _long:number,
    _city:string, _housenumber:number, _postcode:number, _street:string, 
    _cuisine:string, _diet_vegan:boolean, _diet_vegetarian:boolean
)
{
    const post = await prisma.place.update({
        where: { id: 1 },
        data: 
        { 
            email: _email,
            website: _website,
            opening_hours: _opening_hours,
            lat: _lat,
            long: _long,
            city: _city,
            housenumber: _housenumber,
            postcode: _postcode,
            street: _street,
            cuisine: _cuisine,
            diet_vegan: _diet_vegan,
            diet_vegetarian: _diet_vegetarian
        },
    })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
