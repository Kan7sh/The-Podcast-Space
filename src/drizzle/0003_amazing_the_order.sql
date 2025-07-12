CREATE TABLE "recordings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"recordingUrl" varchar,
	"roomId" integer,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"recordingLenght" varchar
);
--> statement-breakpoint
ALTER TABLE "recordings" ADD CONSTRAINT "recordings_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;