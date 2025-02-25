DO $$ BEGIN
 CREATE TYPE "public"."sub_season" AS ENUM('Bright Winter', 'True Winter', 'Dark Winter', 'Light Summer', 'True Summer', 'Soft Summer', 'Light Spring', 'True Spring', 'Bright Spring', 'Soft Autumn', 'True Autumn', 'Dark Autumn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "palette" ADD COLUMN "sub_season" "sub_season";--> statement-breakpoint
ALTER TABLE "palette" ADD COLUMN "description" text;