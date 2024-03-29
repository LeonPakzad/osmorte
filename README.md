# osmorte
a tool to use open street map locations in your own project

### Install needed packages
``` npm install```

### Database Configurations
1. alter your DATABASE_URL (add .env)
2. ```npx prisma migrate dev --name init```

### after changing:
```npx prisma migrate dev``` 

### start server
```npx ts-node index.ts``` 