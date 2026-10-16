-- Part 11: consent-gated, private inquiry tables. Apply only after approving a privacy policy.
CREATE TABLE "InquirySubmission" (
  "id" UUID NOT NULL,
  "requestId" UUID NOT NULL,
  "category" VARCHAR(30) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(254) NOT NULL,
  "phone" VARCHAR(24),
  "subject" VARCHAR(160) NOT NULL,
  "message" TEXT NOT NULL,
  "consentVersion" VARCHAR(50) NOT NULL,
  "consentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "emailStatus" VARCHAR(20) NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InquirySubmission_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PartnershipSubmission" (
  "id" UUID NOT NULL,
  "requestId" UUID NOT NULL,
  "kind" VARCHAR(20) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(254) NOT NULL,
  "phone" VARCHAR(24),
  "organization" VARCHAR(140) NOT NULL,
  "role" VARCHAR(90) NOT NULL,
  "location" VARCHAR(120) NOT NULL,
  "interest" VARCHAR(50) NOT NULL,
  "message" TEXT NOT NULL,
  "consentVersion" VARCHAR(50) NOT NULL,
  "consentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "emailStatus" VARCHAR(20) NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PartnershipSubmission_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "InquirySubmission_requestId_key" ON "InquirySubmission"("requestId");
CREATE INDEX "InquirySubmission_createdAt_idx" ON "InquirySubmission"("createdAt");
CREATE INDEX "InquirySubmission_category_createdAt_idx" ON "InquirySubmission"("category","createdAt");
CREATE UNIQUE INDEX "PartnershipSubmission_requestId_key" ON "PartnershipSubmission"("requestId");
CREATE INDEX "PartnershipSubmission_createdAt_idx" ON "PartnershipSubmission"("createdAt");
CREATE INDEX "PartnershipSubmission_kind_createdAt_idx" ON "PartnershipSubmission"("kind","createdAt");
