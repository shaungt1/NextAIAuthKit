/*
  Warnings:

  - You are about to drop the `Preset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `name` on the `LLM` table. All the data in the column will be lost.
  - Added the required column `category` to the `LLM` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Preset_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Preset";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "preset" (
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
    CONSTRAINT "preset_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LLM" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "provider" TEXT NOT NULL
);
INSERT INTO "new_LLM" ("id", "provider") SELECT "id", "provider" FROM "LLM";
DROP TABLE "LLM";
ALTER TABLE "new_LLM" RENAME TO "LLM";
CREATE UNIQUE INDEX "LLM_category_key" ON "LLM"("category");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "preset_name_key" ON "preset"("name");
