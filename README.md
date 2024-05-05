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

### configurations
add / configure DATABASE_URL and your TOKEN_SECRET, username and password for JWT in .env<br>
You will need to add a cookie "token" into requests. <br>
This token needs to be signed just like in the tool to access OSMOrte routes with your own project

<p style="position: absolute;">.env</p>

```
DATABASE_URL= "dbtype://name:password@url:port/db-name"
TOKEN_SECRET= "your very safe token string"
USERNAME="your username"
PASSWORD="password"
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