import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library';

const path = require('path');
const express = require("express");
const prisma = new PrismaClient()
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use('/public', express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');
app.use('/', require('./controllers/routes'));

// app.get("/", (_req: any, res: { json: (arg0: { message: string; }) => void; }) => {
//   res.json({ message: "ok" });
// });

// app.get('/restaurants', async (_req: any, res: { json: (arg0: { id: number; fk_place: number; node: number; name: string; email: string; website: string; opening_hours: string; lat: number; long: number; addr_city: string; addr_housenumber: number; addr_postcode: number; addr_street: string; cuisine: string; diet_vegan: boolean; diet_vegetarian: boolean }[]) => void }) => {
//     const restaurants = await prisma.place.findMany()
//     res.json(restaurants)
// });

// app.get('/restaurant/:id', async (_req: any, res: { json: (arg0: { id: number; fk_place: number; node: number; name: string; email: string; website: string; opening_hours: string; lat: number; long: number; addr_city: string; addr_housenumber: number; addr_postcode: number; addr_street: string; cuisine: string; diet_vegan: boolean; diet_vegetarian: boolean }[]) => void }) => {
//     const restaurants = await prisma.place.findMany()
//     res.json(restaurants)
// });

// app.delete('/reestaurant/:id', async (_req: { select?: Prisma.PlaceSelect<DefaultArgs> | null | undefined; where: Prisma.PlaceWhereUniqueInput; }, res: any) => {
//     await prisma.place.delete(_req);
// });
  
app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)