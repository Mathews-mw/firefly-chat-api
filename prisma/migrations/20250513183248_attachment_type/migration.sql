/*
  Warnings:

  - Added the required column `type` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'FILE', 'AUDIO');

-- AlterTable
ALTER TABLE "attachments" ADD COLUMN     "type" "AttachmentType" NOT NULL;
