/*
  Warnings:

  - You are about to drop the column `description` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `frequencyPenalty` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `maxTokens` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `presencePenalty` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `topP` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `LLM` table. All the data in the column will be lost.
  - You are about to drop the column `modelName` on the `Preset` table. All the data in the column will be lost.
  - Made the column `llmId` on table `Model` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `modelId` to the `Preset` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LLM" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL
);
INSERT INTO "new_LLM" ("id", "name", "provider") SELECT "id", "name", "provider" FROM "LLM";
DROP TABLE "LLM";
ALTER TABLE "new_LLM" RENAME TO "LLM";
CREATE UNIQUE INDEX "LLM_name_key" ON "LLM"("name");
CREATE TABLE "new_Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "inputCost" REAL,
    "cachedInputCost" REAL,
    "outputCost" REAL,
    "totalCost" REAL,
    "llmId" TEXT NOT NULL,
    CONSTRAINT "Model_llmId_fkey" FOREIGN KEY ("llmId") REFERENCES "LLM" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Model" ("cachedInputCost", "description", "id", "inputCost", "llmId", "name", "outputCost", "totalCost", "type") SELECT "cachedInputCost", "description", "id", "inputCost", "llmId", "name", "outputCost", "totalCost", "type" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");
CREATE TABLE "new_Preset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "modelId" TEXT NOT NULL,
    "prompt" TEXT,
    "temperature" REAL NOT NULL,
    "maxTokens" INTEGER NOT NULL,
    "topP" REAL NOT NULL,
    "frequencyPenalty" REAL NOT NULL,
    "presencePenalty" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Preset_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Preset" ("createdAt", "description", "frequencyPenalty", "id", "maxTokens", "name", "presencePenalty", "prompt", "temperature", "topP") SELECT "createdAt", "description", "frequencyPenalty", "id", "maxTokens", "name", "presencePenalty", "prompt", "temperature", "topP" FROM "Preset";
DROP TABLE "Preset";
ALTER TABLE "new_Preset" RENAME TO "Preset";
CREATE UNIQUE INDEX "Preset_name_key" ON "Preset"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
