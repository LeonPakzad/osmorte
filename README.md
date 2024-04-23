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
add / configure DATABASE_URL in .env

<p style="position: absolute;">.env</p>

```
DATABASE_URL= "dbtype://name:password@url:port/db-name"
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