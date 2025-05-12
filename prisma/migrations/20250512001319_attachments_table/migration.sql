-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "message_id" TEXT,
    "room_id" TEXT,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attachments_title_key" ON "attachments"("title");

-- CreateIndex
CREATE UNIQUE INDEX "attachments_room_id_key" ON "attachments"("room_id");

-- CreateIndex
CREATE INDEX "attachments_room_id_idx" ON "attachments"("room_id");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "chat_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
