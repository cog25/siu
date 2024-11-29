ALTER TABLE "submissions" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "createdAt" time DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "problemId" integer NOT NULL;