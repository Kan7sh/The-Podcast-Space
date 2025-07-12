ALTER TABLE "recordings" RENAME COLUMN "recordingLenght" TO "recordingLength";--> statement-breakpoint
ALTER TABLE "recordings" ALTER COLUMN "roomId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "recordings" ADD COLUMN "recordingCreatedAt" timestamp with time zone;