/*
  Warnings:

  - You are about to drop the column `userImage` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "profileImage" BLOB,
    "role" TEXT DEFAULT 'USER',
    "location" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "ipAddress" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "title" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("bio", "createdAt", "email", "facebook", "id", "instagram", "ipAddress", "latitude", "linkedin", "location", "longitude", "name", "password", "phone", "role", "title", "twitter", "updatedAt", "website", "youtube") SELECT "bio", "createdAt", "email", "facebook", "id", "instagram", "ipAddress", "latitude", "linkedin", "location", "longitude", "name", "password", "phone", "role", "title", "twitter", "updatedAt", "website", "youtube" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
