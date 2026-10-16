-- Part 12: authenticated administration, internal lead workflow, audit history and editorial publishing.
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'IN_REVIEW', 'RESOLVED', 'ARCHIVED');
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');
CREATE TYPE "EditorialKind" AS ENUM ('PODCAST', 'MEDIA');
CREATE TYPE "EditorialStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

ALTER TABLE "InquirySubmission"
  ADD COLUMN "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
  ADD COLUMN "internalNote" VARCHAR(2000),
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "PartnershipSubmission"
  ADD COLUMN "status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',
  ADD COLUMN "internalNote" VARCHAR(2000),
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "InquirySubmission_status_createdAt_idx" ON "InquirySubmission"("status", "createdAt");
CREATE INDEX "PartnershipSubmission_status_createdAt_idx" ON "PartnershipSubmission"("status", "createdAt");

CREATE TABLE "AdminUser" (
  "id" UUID NOT NULL,
  "email" VARCHAR(254) NOT NULL,
  "passwordHash" VARCHAR(255) NOT NULL,
  "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

CREATE TABLE "AdminSession" (
  "id" UUID NOT NULL,
  "tokenHash" VARCHAR(64) NOT NULL,
  "adminId" UUID NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");
CREATE INDEX "AdminSession_adminId_expiresAt_idx" ON "AdminSession"("adminId", "expiresAt");
ALTER TABLE "AdminSession"
  ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "AdminAuditLog" (
  "id" UUID NOT NULL,
  "adminId" UUID,
  "action" VARCHAR(80) NOT NULL,
  "entityType" VARCHAR(40) NOT NULL,
  "entityId" VARCHAR(80),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");
CREATE INDEX "AdminAuditLog_adminId_createdAt_idx" ON "AdminAuditLog"("adminId", "createdAt");
ALTER TABLE "AdminAuditLog"
  ADD CONSTRAINT "AdminAuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "EditorialEntry" (
  "id" UUID NOT NULL,
  "kind" "EditorialKind" NOT NULL,
  "slug" VARCHAR(100) NOT NULL,
  "title" VARCHAR(140) NOT NULL,
  "category" VARCHAR(60) NOT NULL,
  "summary" VARCHAR(600) NOT NULL,
  "artwork" VARCHAR(400) NOT NULL,
  "caption" VARCHAR(600),
  "topics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "outline" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "body" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "audioUrl" VARCHAR(1000),
  "durationSeconds" INTEGER,
  "transcript" TEXT,
  "author" VARCHAR(100),
  "status" "EditorialStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "editedById" UUID,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EditorialEntry_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EditorialEntry_kind_slug_key" ON "EditorialEntry"("kind", "slug");
CREATE INDEX "EditorialEntry_status_publishedAt_idx" ON "EditorialEntry"("status", "publishedAt");
CREATE INDEX "EditorialEntry_kind_status_idx" ON "EditorialEntry"("kind", "status");
