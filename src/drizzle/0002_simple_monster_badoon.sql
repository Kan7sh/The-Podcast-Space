ALTER TABLE "room" ADD COLUMN "endedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "room" ADD COLUMN "isActive" boolean DEFAULT false;