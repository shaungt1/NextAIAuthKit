/*
  Warnings:

  - The primary key for the `LLM` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `LLM` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Model` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Model` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `llmId` on the `Model` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `preset` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `preset` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `modelId` on the `preset` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LLM" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "category" TEXT NOT NULL,
    "provider" TEXT NOT NULL
);
INSERT INTO "new_LLM" ("category", "id", "provider") SELECT "category", "id", "provider" FROM "LLM";
DROP TABLE "LLM";
ALTER TABLE "new_LLM" RENAME TO "LLM";
CREATE UNIQUE INDEX "LLM_category_key" ON "LLM"("category");
CREATE TABLE "new_Model" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "inputCost" REAL,
    "cachedInputCost" REAL,
    "outputCost" REAL,
    "totalCost" REAL,
    "llmId" INTEGER NOT NULL,
    CONSTRAINT "Model_llmId_fkey" FOREIGN KEY ("llmId") REFERENCES "LLM" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Model" ("cachedInputCost", "description", "id", "inputCost", "llmId", "name", "outputCost", "totalCost", "type") SELECT "cachedInputCost", "description", "id", "inputCost", "llmId", "name", "outputCost", "totalCost", "type" FROM "Model";
DROP TABLE "Model";
ALTER TABLE "new_Model" RENAME TO "Model";
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");
CREATE TABLE "new_preset" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "modelId" INTEGER NOT NULL,
    "prompt" TEXT,
    "temperature" REAL NOT NULL,
    "maxTokens" INTEGER NOT NULL,
    "topP" REAL NOT NULL,
    "frequencyPenalty" REAL NOT NULL,
    "presencePenalty" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "preset_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_preset" ("createdAt", "description", "frequencyPenalty", "id", "maxTokens", "modelId", "name", "presencePenalty", "prompt", "temperature", "topP") SELECT "createdAt", "description", "frequencyPenalty", "id", "maxTokens", "modelId", "name", "presencePenalty", "prompt", "temperature", "topP" FROM "preset";
DROP TABLE "preset";
ALTER TABLE "new_preset" RENAME TO "preset";
CREATE UNIQUE INDEX "preset_name_key" ON "preset"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
