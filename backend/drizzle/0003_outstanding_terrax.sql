CREATE TABLE IF NOT EXISTS "submissions" (
	"studentId" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_id_unique";--> statement-breakpoint
ALTER TABLE "students" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "testStartedAt" time;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "testEndedAt" time;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "pcName" text;