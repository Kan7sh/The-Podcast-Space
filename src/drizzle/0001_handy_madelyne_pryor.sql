ALTER TABLE "tempUser" DROP CONSTRAINT "tempUser_tempUserId_tempUser_id_fk";
--> statement-breakpoint
ALTER TABLE "verifyOtp" ADD COLUMN "tempUserId" integer;--> statement-breakpoint
ALTER TABLE "verifyOtp" ADD CONSTRAINT "verifyOtp_tempUserId_tempUser_id_fk" FOREIGN KEY ("tempUserId") REFERENCES "public"."tempUser"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tempUser" DROP COLUMN "tempUserId";