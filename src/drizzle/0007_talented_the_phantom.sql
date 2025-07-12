CREATE TABLE "user_recordings" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"roomId" integer NOT NULL,
	"recordingId" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_recordings" ADD CONSTRAINT "user_recordings_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recordings" ADD CONSTRAINT "user_recordings_roomId_room_id_fk" FOREIGN KEY ("roomId") REFERENCES "public"."room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_recordings" ADD CONSTRAINT "user_recordings_recordingId_recordings_id_fk" FOREIGN KEY ("recordingId") REFERENCES "public"."recordings"("id") ON DELETE no action ON UPDATE no action;