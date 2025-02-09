/*
  Warnings:

  - You are about to drop the column `createdAt` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Model` table. All the data in the column will be lost.
  - Added the required column `type` to the `Model` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LLM" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "temperature" REAL NOT NULL,
    "maxTokens" INTEGER NOT NULL,
    "topP" REAL NOT NULL,
    "frequencyPenalty" REAL NOT NULL,
    "presencePenalty" REAL NOT NULL
);
INSERT INTO "new_LLM" ("description", "frequencyPenalty", "id", "maxTokens", "name", "presencePenalty", "provider", "temperature", "topP", "type", "version") SELECT "description", "frequencyPenalty", "id", "maxTokens", "name", "presencePenalty", "provider", "temperature", "topP", "type", "version" FROM "LLM";
DROP TABLE "LLM";
ALTER TABLE "new_LLM" RENAME TO "LLM";
CREATE UNIQUE INDEX "LLM_name_key" ON "LLM"("name");
CREATE TABLE "new_Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "inputCost" REAL,
    "cachedInputCost" REAL,
    "outputCost" REAL,
    "totalCost" REAL,
    "llmId" TEXT,
    CONSTRAINT "Model_llmId_fkey" FOREIGN KEY ("llmId") REFERENCES "LLM" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Model" ("description", "id", "inputCost", "llmId", "name", "outputCost") SELECT "description", "id", "inputCost", "llmId", "name", "outputCost" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
