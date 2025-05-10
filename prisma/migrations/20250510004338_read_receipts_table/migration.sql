-- CreateTable
CREATE TABLE "read_receipts" (
    "message_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "read_receipts_pkey" PRIMARY KEY ("message_id","user_id")
);

-- CreateIndex
CREATE INDEX "read_receipts_user_id_read_at_idx" ON "read_receipts"("user_id", "read_at");

-- AddForeignKey
ALTER TABLE "read_receipts" ADD CONSTRAINT "read_receipts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "read_receipts" ADD CONSTRAINT "read_receipts_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
