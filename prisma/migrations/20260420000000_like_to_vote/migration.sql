-- Create the new vote table
CREATE TABLE "vote" (
  "id" SERIAL NOT NULL,
  "note_id" INTEGER NOT NULL,
  "user_id" VARCHAR(36) NOT NULL,
  "value" INTEGER NOT NULL,
  "created" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- Add unique constraint and indexes
ALTER TABLE "vote" ADD CONSTRAINT "vote_note_id_user_id_key" UNIQUE ("note_id", "user_id");
CREATE INDEX "vote_user_id_idx" ON "vote"("user_id");

-- Add foreign key
ALTER TABLE "vote" ADD CONSTRAINT "vote_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing likes as upvotes
INSERT INTO "vote" ("note_id", "user_id", "value", "created")
SELECT "note_id", "user_id", 1, "created" FROM "like";

-- Add score column to note
ALTER TABLE "note" ADD COLUMN "score" INTEGER NOT NULL DEFAULT 0;

-- Compute initial scores from migrated votes
UPDATE "note" SET "score" = (
  SELECT COALESCE(SUM(v."value"), 0) FROM "vote" v WHERE v."note_id" = "note"."id"
);

-- Create index for score sorting
CREATE INDEX "note_score_idx" ON "note"("score" DESC);

-- Drop the old like table and its constraints
DROP TABLE "like";
