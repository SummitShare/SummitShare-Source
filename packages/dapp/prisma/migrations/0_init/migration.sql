-- CreateEnum
CREATE TYPE "decision" AS ENUM ('Agree', 'Disagree');

-- CreateEnum
CREATE TYPE "event_category_enum" AS ENUM ('solo_exhibitions', 'group_exhibitions', 'museum_exhibitions', 'art_event_exhibitions');

-- CreateEnum
CREATE TYPE "event_type_enum" AS ENUM ('Physical', 'Virtual');

-- CreateEnum
CREATE TYPE "image_type_enum" AS ENUM ('Profile', 'Cover', 'Gallery');

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
    "contract_address" TEXT NOT NULL,
    "contract_abi" JSON NOT NULL,
    "deploy_id" TEXT NOT NULL,
    "event_id" UUID,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("contract_address")
);

-- CreateTable
CREATE TABLE "email_verification" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "email_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_images" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "s3_url" TEXT NOT NULL,
    "event_id" UUID,

    CONSTRAINT "event_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "event_type" "event_type_enum",
    "event_name" TEXT,
    "user_id" UUID,
    "event_category" "event_category_enum",
    "event_start_time" TIMESTAMP(6),
    "event_timezone" TEXT,
    "event_location" TEXT,
    "description" TEXT,
    "contract_address" TEXT,
    "event_end_time" TIMESTAMP(6),
    "cost" DECIMAL(10,2),
    "total_number_tickets" INTEGER,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exhibitor_account_users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "exhibitor_account_id" UUID,
    "user_id" UUID,
    "role" TEXT NOT NULL,

    CONSTRAINT "exhibitor_account_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fund_distributions" (
    "id" TEXT NOT NULL,
    "stakeholder_id" UUID,
    "amount" DECIMAL(10,2) NOT NULL,
    "transaction_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiving_wallet_address" TEXT,

    CONSTRAINT "fund_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "latest_rejecters_queue" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "event_id" UUID,
    "proposal_id" UUID,
    "user_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "latest_rejecters_queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "event_id" UUID,
    "user_id" UUID,
    "content" JSON NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requests" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "event_id" UUID,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_media_links" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "linkedin_url" TEXT,
    "facebook_url" TEXT,
    "twitter_url" TEXT,
    "instagram_url" TEXT,

    CONSTRAINT "social_media_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stakeholders" (
    "stakeholder_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "event_id" UUID,
    "stake" INTEGER,

    CONSTRAINT "stakeholders_pkey" PRIMARY KEY ("stakeholder_id")
);

-- CreateTable
CREATE TABLE "ticket_transaction" (
    "id" TEXT NOT NULL,
    "event_id" UUID,
    "price" DECIMAL(10,2) NOT NULL,
    "transaction_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tickets_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" TEXT NOT NULL,
    "event_id" UUID,
    "wallet_address" TEXT,
    "event_start_time" TIMESTAMP(6),
    "event_end_time" TIMESTAMP(6),
    "event_timezone" TEXT,
    "is_validated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_images" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "s3_url" TEXT NOT NULL,
    "user_id" UUID,
    "image_type" "image_type_enum",
    "gallery_index" INTEGER,

    CONSTRAINT "user_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "session_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "expires" TIMESTAMP(6) NOT NULL,
    "session_token" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "creation_time" TIMESTAMP(6) NOT NULL,
    "update_time" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "user_types" (
    "id" INTEGER NOT NULL,
    "type_name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "user_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_wallets" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" UUID,
    "wallet_address" TEXT NOT NULL,

    CONSTRAINT "user_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255),
    "password" TEXT NOT NULL,
    "wallet_address" TEXT,
    "bio" TEXT,
    "email_verified" BOOLEAN DEFAULT false,
    "user_type_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "proposal_id" UUID,
    "user_id" UUID,
    "decision" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "exhibitor_account_users_unique" ON "exhibitor_account_users"("exhibitor_account_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_types_type_name_key" ON "user_types"("type_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "fk_events_contracts" FOREIGN KEY ("contract_address") REFERENCES "contracts"("contract_address") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exhibitor_account_users" ADD CONSTRAINT "exhibitor_account_users_exhibitor_account_id_fkey" FOREIGN KEY ("exhibitor_account_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exhibitor_account_users" ADD CONSTRAINT "exhibitor_account_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fund_distributions" ADD CONSTRAINT "fund_distributions_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "stakeholders"("stakeholder_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "latest_rejecters_queue" ADD CONSTRAINT "latest_rejecters_queue_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "latest_rejecters_queue" ADD CONSTRAINT "latest_rejecters_queue_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "latest_rejecters_queue" ADD CONSTRAINT "latest_rejecters_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "social_media_links" ADD CONSTRAINT "social_media_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stakeholders" ADD CONSTRAINT "stakeholders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ticket_transaction" ADD CONSTRAINT "tickets_transactions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_images" ADD CONSTRAINT "user_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_wallets" ADD CONSTRAINT "user_wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_user_type_id_fkey" FOREIGN KEY ("user_type_id") REFERENCES "user_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

