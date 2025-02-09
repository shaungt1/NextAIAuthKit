-- CreateTable
CREATE TABLE "LLM" (
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
    "presencePenalty" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "llmId" TEXT NOT NULL,
    "inputCost" REAL,
    "outputCost" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Model_llmId_fkey" FOREIGN KEY ("llmId") REFERENCES "LLM" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LLM_name_key" ON "LLM"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Model_name_key" ON "Model"("name");
