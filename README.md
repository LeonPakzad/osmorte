# osmorte
A tool to aid you using open street map locations in your own projects.
Check out 
<a href="https://www.openstreetmap.de/">Open Street Maps !</a>


## installation

### install needed packages
<p style="position: absolute;">terminal</p>

``` 
npm install
```

### database-configurations
add / configure DATABASE_URL and your TOKEN_SECRET for JWT in .env

<p style="position: absolute;">.env</p>

```
DATABASE_URL= "dbtype://name:password@url:port/db-name"
TOKEN_SECRET= "your very safe token string"
```

update your DATABASE_URL
<p style="position: absolute;">terminal</p>

```
npx prisma migrate dev --name init
```

### start server
<p style="position: absolute;">terminal</p>

```
    terminal: cd src
    terminal: npx ts-node index.ts
``` 

## add new amenitys
adding new amenitys requires altering the following data:
- adding db entry in                    prisma->schema.prisma 
- adding amenity mapping in             src->controllers->placeMapping.ts
- adding amenity to the following in    src->controllers->placeControllers.ts
    - cols,
    - availablePlaceTypes 
    - where availablePlaceTypes are used as switch case
    - create            
- add the new amenity attributes to templates->placeAttributes