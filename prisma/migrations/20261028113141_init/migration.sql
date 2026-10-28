-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CREATOR', 'BRAND');

-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'TIKTOK');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('ACTIVE', 'EXPIRED');

-- CreateTable
CREATE TABLE "CreatorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialConnection" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "externalUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "status" "ConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountSnapshot" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "AccountSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "caption" TEXT,
    "thumbnailUrl" TEXT,
    "permalink" TEXT,
    "views" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "shares" INTEGER NOT NULL,
    "saves" INTEGER,
    "reach" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audience" (
    "id" TEXT NOT NULL,
    "connectionId" TEXT NOT NULL,
    "ages" JSONB NOT NULL,
    "genders" JSONB NOT NULL,
    "countries" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreatorProfile_userId_key" ON "CreatorProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandProfile_userId_key" ON "BrandProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SocialConnection_creatorId_platform_key" ON "SocialConnection"("creatorId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "SocialConnection_platform_externalUserId_key" ON "SocialConnection"("platform", "externalUserId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountSnapshot_connectionId_date_key" ON "AccountSnapshot"("connectionId", "date");

-- CreateIndex
CREATE INDEX "Post_connectionId_publishedAt_idx" ON "Post"("connectionId", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Post_connectionId_externalId_key" ON "Post"("connectionId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Audience_connectionId_key" ON "Audience"("connectionId");

-- AddForeignKey
ALTER TABLE "SocialConnection" ADD CONSTRAINT "SocialConnection_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "CreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountSnapshot" ADD CONSTRAINT "AccountSnapshot_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "SocialConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "SocialConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audience" ADD CONSTRAINT "Audience_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "SocialConnection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
