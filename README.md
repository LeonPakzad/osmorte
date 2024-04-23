# osmorte
a tool to aid you using open street map locations in your own projects.
check out open street maps! 
<a href="https://www.openstreetmap.de/">Open Street Map</a>


## installation

### install needed packages
``` npm install```

### database-configurations
1. alter your DATABASE_URL (add .env)
```DATABASE_URL="dbtype://name:password@url:port/db-name"```

2. ```npx prisma migrate dev --name init```

### start server
```npx ts-node index.ts``` 