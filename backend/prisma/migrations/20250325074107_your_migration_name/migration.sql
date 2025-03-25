-- DropIndex
DROP INDEX "Hospital_Hosptial_id_key";

-- AlterTable
CREATE SEQUENCE hospital_hosptial_id_seq;
ALTER TABLE "Hospital" ALTER COLUMN "Hosptial_id" SET DEFAULT nextval('hospital_hosptial_id_seq');
ALTER SEQUENCE hospital_hosptial_id_seq OWNED BY "Hospital"."Hosptial_id";
