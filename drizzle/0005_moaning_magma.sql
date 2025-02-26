ALTER TABLE "colors" ADD COLUMN "reason" text;--> statement-breakpoint
ALTER TABLE "celebrities" DROP COLUMN IF EXISTS "reason";