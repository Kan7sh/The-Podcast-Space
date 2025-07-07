CREATE TABLE "room" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"hostId" integer NOT NULL,
	"roomId" varchar NOT NULL,
	"numberOfAllowedParticipants" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
