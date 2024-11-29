CREATE TABLE IF NOT EXISTS "students" (
	"name" text,
	"id" integer NOT NULL,
	CONSTRAINT "students_id_unique" UNIQUE("id")
);
