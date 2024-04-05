import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    getPlacesAll();
    addPlace();
    updatePlace("changed_mail@test.com");
    getPlacesAll();
    deletePlacesAll();
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
            addr_city: 'test',   
            addr_housenumber: 1,
            addr_postcode: 11111,
            addr_street: 'teststreet',
            
            cuisine: 'italian',
            diet_vegan: false,
            diet_vegetarian: false
        },
    })
}

async function getPlacesAll()
{
    const allPlaces = await prisma.place.findMany();
    console.log(allPlaces);
}

async function deletePlacesAll()
{
    const allPlaces = await prisma.place.deleteMany();
    console.log(allPlaces);
}

async function updatePlace(_email:string)
{
    const post = await prisma.place.update({
        where: { id: 1 },
        data: { email: _email },
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
