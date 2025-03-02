/*
  Warnings:

  - You are about to drop the `LLM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `llmId` on the `Model` table. All the data in the column will be lost.
  - Added the required column `providerId` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "LLM_category_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LLM";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AIProvider" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "modelType" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Model" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "inputCost" REAL,
    "cachedInputCost" REAL,
    "outputCost" REAL,
    "totalCost" REAL,
    "providerId" INTEGER NOT NULL,
    CONSTRAINT "Model_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "AIProvider" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Model" ("cachedInputCost", "description", "id", "inputCost", "name", "outputCost", "totalCost", "type") SELECT "cachedInputCost", "description", "id", "inputCost", "name", "outputCost", "totalCost", "type" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AIProvider_category_key" ON "AIProvider"("category");
