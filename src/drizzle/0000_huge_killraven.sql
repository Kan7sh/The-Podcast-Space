CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"imageUrl" varchar,
	"password" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "tempUser" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"imageUrl" varchar,
	"password" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"verfiedAt" timestamp with time zone,
	"isVerified" boolean,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"tempUserId" integer
);
--> statement-breakpoint
CREATE TABLE "verifyOtp" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid(),
	"email" varchar NOT NULL,
	"otp" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"validTill" timestamp with time zone,
	"isVerified" boolean,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tempUser" ADD CONSTRAINT "tempUser_tempUserId_tempUser_id_fk" FOREIGN KEY ("tempUserId") REFERENCES "public"."tempUser"("id") ON DELETE no action ON UPDATE no action;