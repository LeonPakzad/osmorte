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

app.use('/', require('./controllers/routes'));

app.set('view engine', 'ejs');
  
app.listen(3000, () =>
  console.log('OSMOrte ready at: http://localhost:3000'),
)