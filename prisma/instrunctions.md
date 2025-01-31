
### Steps to Apply the Fix:
1. Save altered changed in the `schema.prisma` file.
2. Run the following commands in your terminal:
   ```bash
   npx prisma migrate dev --name init
   ```
   This initializes the migration and creates the SQLite database with the defined schema.

3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

These steps will set up your SQLite database and make the Prisma client available for your project. Let me know if you face any further issues!

### When running prisma generate you need to remove the package files and restore it wilth new db table updates.
Regenerate the Prisma client to reflect the latest schema:
```
rm -rf node_modules/.prisma
npm install
npx prisma generate
```

Then run migrations:
```
npx prisma migrate dev --name init
```

Verify the Changes
After running the migration, check the updated schema: This will pull the database structure into Prisma's client to confirm all changes.
```
npx prisma db pull
```
