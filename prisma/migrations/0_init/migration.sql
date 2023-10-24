-- CreateEnum
CREATE TYPE "decision" AS ENUM ('Agree', 'Disagree');

-- CreateEnum
CREATE TYPE "imagetype" AS ENUM ('Profile', 'Cover', 'Gallery');

-- CreateEnum
CREATE TYPE "roletype" AS ENUM ('Admin', 'User');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('Pending', 'Accepted', 'Declined');

-- CreateEnum
CREATE TYPE "typename" AS ENUM ('Physical', 'Virtual');

-- CreateTable
CREATE TABLE "contracts" (
    "contractaddress" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "hardhatdeployid" UUID,
    "eventid" UUID,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("contractaddress")
);

-- CreateTable
CREATE TABLE "eventimages" (
    "eventimageid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "s3_url" VARCHAR,
    "eventid" UUID,

    CONSTRAINT "eventimages_pkey" PRIMARY KEY ("eventimageid")
);

-- CreateTable
CREATE TABLE "events" (
    "eventid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "eventtypeid" INTEGER,
    "contractid" UUID,
    "userid" UUID,
    "description" VARCHAR,

    CONSTRAINT "events_pkey" PRIMARY KEY ("eventid")
);

-- CreateTable
CREATE TABLE "eventtypes" (
    "eventtypeid" INTEGER NOT NULL DEFAULT 0,
    "typename" "typename",

    CONSTRAINT "eventtypes_pkey" PRIMARY KEY ("eventtypeid")
);

-- CreateTable
CREATE TABLE "proposals" (
    "proposalid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "eventid" UUID,
    "userid" UUID,
    "content" TEXT,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("proposalid")
);

-- CreateTable
CREATE TABLE "requests" (
    "requestid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userid" UUID,
    "eventid" UUID,
    "status" "status",

    CONSTRAINT "requests_pkey" PRIMARY KEY ("requestid")
);

-- CreateTable
CREATE TABLE "roles" (
    "roleid" INTEGER NOT NULL DEFAULT 0,
    "roletype" "roletype",

    CONSTRAINT "roles_pkey" PRIMARY KEY ("roleid")
);

-- CreateTable
CREATE TABLE "socialmedialinks" (
    "linkid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userid" UUID,
    "linkedin_url" VARCHAR,
    "facebook_url" VARCHAR,
    "twitter_url" VARCHAR,
    "instagram_url" VARCHAR,

    CONSTRAINT "socialmedialinks_pkey" PRIMARY KEY ("linkid")
);

-- CreateTable
CREATE TABLE "stakeholders" (
    "stakeholderid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userid" UUID,
    "eventid" UUID,
    "stake" VARCHAR,

    CONSTRAINT "stakeholders_pkey" PRIMARY KEY ("stakeholderid")
);

-- CreateTable
CREATE TABLE "userimages" (
    "userimageid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "s3_url" VARCHAR,
    "userid" UUID,
    "imagetype" "imagetype",
    "galleryindex" INTEGER,

    CONSTRAINT "userimages_pkey" PRIMARY KEY ("userimageid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "walletaddress" VARCHAR,
    "bio" VARCHAR,
    "roleid" INTEGER,
    "isemailverified" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "votes" (
    "voteid" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "proposalid" UUID,
    "userid" UUID,
    "decision" "decision",

    CONSTRAINT "votes_pkey" PRIMARY KEY ("voteid")
);

-- CreateTable
CREATE TABLE "UserVerification" (
    "ID" UUID NOT NULL,
    "userid" UUID NOT NULL,
    "Token" TEXT NOT NULL,
    "Expires" TIMESTAMPTZ(6) NOT NULL,
    "CreatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "contracts_hardhatdeployid_key" ON "contracts"("hardhatdeployid");

-- CreateIndex
CREATE UNIQUE INDEX "eventimages_s3_url_key" ON "eventimages"("s3_url");

-- CreateIndex
CREATE UNIQUE INDEX "userimages_s3_url_key" ON "userimages"("s3_url");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_walletaddress_key" ON "users"("walletaddress");

-- CreateIndex
CREATE UNIQUE INDEX "UserVerification_userid_key" ON "UserVerification"("userid");

-- CreateIndex
CREATE INDEX "idx_expires" ON "UserVerification"("Expires");

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "events"("eventid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "eventimages" ADD CONSTRAINT "eventimages_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "events"("eventid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventtypeid_fkey" FOREIGN KEY ("eventtypeid") REFERENCES "eventtypes"("eventtypeid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "events"("eventid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "events"("eventid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "socialmedialinks" ADD CONSTRAINT "socialmedialinks_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "events"("eventid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "userimages" ADD CONSTRAINT "userimages_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleid_fkey" FOREIGN KEY ("roleid") REFERENCES "roles"("roleid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_proposalid_fkey" FOREIGN KEY ("proposalid") REFERENCES "proposals"("proposalid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserVerification" ADD CONSTRAINT "UserVerification_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION;

