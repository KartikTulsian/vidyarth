-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('STUDENT', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "public"."OfferType" AS ENUM ('SELL', 'LEND', 'RENT', 'SHARE', 'EXCHANGE');

-- CreateEnum
CREATE TYPE "public"."TradeStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'OVERDUE', 'CANCELLED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "public"."ReminderType" AS ENUM ('RETURN_DUE', 'PICKUP_DUE', 'OFFER_EXPIRY', 'PAYMENT_DUE', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."ReviewType" AS ENUM ('UNIVERSAL_STUFF', 'THANK_YOU_MESSAGE', 'USER_RATING');

-- CreateEnum
CREATE TYPE "public"."ItemCondition" AS ENUM ('NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "public"."StuffType" AS ENUM ('BOOK', 'STATIONERY', 'ELECTRONICS', 'NOTES', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."BookType" AS ENUM ('TEXTBOOK', 'REFERENCE', 'NOVEL', 'JOURNAL', 'MAGAZINE', 'WORKBOOK', 'GUIDE');

-- CreateEnum
CREATE TYPE "public"."StationeryType" AS ENUM ('WRITING', 'DRAWING', 'CALCULATION', 'STORAGE', 'CRAFT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."UrgencyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('OPEN', 'MATCHED', 'FULFILLED', 'CLOSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('TRADE_REQUEST', 'TRADE_ACCEPTED', 'TRADE_REJECTED', 'REMINDER', 'REVIEW', 'MESSAGE', 'SYSTEM');

-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" TEXT NOT NULL,
    "clerk_id" TEXT,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'STUDENT',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Profile" (
    "profile_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "display_name" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "gender" TEXT,
    "phone" TEXT,
    "school_college_id" TEXT,
    "class_year" TEXT,
    "course" TEXT,
    "department" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "country" TEXT DEFAULT 'India',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "avatar_url" TEXT,
    "bio" TEXT,
    "rating_average" DOUBLE PRECISION DEFAULT 0.0,
    "total_ratings" INTEGER DEFAULT 0,
    "trust_score" INTEGER DEFAULT 0,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "show_phone" BOOLEAN NOT NULL DEFAULT false,
    "show_address" BOOLEAN NOT NULL DEFAULT false,
    "notification_settings" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "public"."SchoolCollege" (
    "school_college_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "website" TEXT,
    "established_year" INTEGER,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolCollege_pkey" PRIMARY KEY ("school_college_id")
);

-- CreateTable
CREATE TABLE "public"."Stuff" (
    "stuff_id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "type" "public"."StuffType" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "author" TEXT,
    "publisher" TEXT,
    "edition" TEXT,
    "isbn" TEXT,
    "publication_year" INTEGER,
    "book_type" "public"."BookType",
    "brand" TEXT,
    "model" TEXT,
    "stationery_type" "public"."StationeryType",
    "language" TEXT DEFAULT 'English',
    "subject" TEXT,
    "genre" TEXT,
    "class_suitability" TEXT,
    "condition" "public"."ItemCondition" NOT NULL,
    "original_price" DECIMAL(10,2),
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "favorites_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stuff_pkey" PRIMARY KEY ("stuff_id")
);

-- CreateTable
CREATE TABLE "public"."StuffImage" (
    "id" TEXT NOT NULL,
    "stuff_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StuffImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "tag_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "public"."StuffTag" (
    "stuff_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StuffTag_pkey" PRIMARY KEY ("stuff_id","tag_id")
);

-- CreateTable
CREATE TABLE "public"."StuffFavorite" (
    "user_id" TEXT NOT NULL,
    "stuff_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StuffFavorite_pkey" PRIMARY KEY ("user_id","stuff_id")
);

-- CreateTable
CREATE TABLE "public"."Offer" (
    "offer_id" TEXT NOT NULL,
    "stuff_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "offer_type" "public"."OfferType" NOT NULL,
    "price" DECIMAL(10,2),
    "rental_price_per_day" DECIMAL(10,2),
    "rental_period_days" INTEGER,
    "security_deposit" DECIMAL(10,2),
    "exchange_item_description" TEXT,
    "exchange_item_value" DECIMAL(10,2),
    "availability_start" TIMESTAMP(3),
    "availability_end" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "quantity_available" INTEGER NOT NULL DEFAULT 1,
    "pickup_address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "visibility_scope" TEXT DEFAULT 'PUBLIC',
    "terms_conditions" TEXT,
    "special_instructions" TEXT,
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("offer_id")
);

-- CreateTable
CREATE TABLE "public"."Trade" (
    "trade_id" TEXT NOT NULL,
    "offer_id" TEXT NOT NULL,
    "borrower_id" TEXT NOT NULL,
    "lender_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "actual_return_date" TIMESTAMP(3),
    "agreed_price" DECIMAL(10,2),
    "security_deposit" DECIMAL(10,2),
    "late_fee" DECIMAL(10,2),
    "status" "public"."TradeStatus" NOT NULL DEFAULT 'PENDING',
    "borrower_rating" INTEGER,
    "lender_rating" INTEGER,
    "safe_detail_id" TEXT,
    "pickup_code" TEXT,
    "return_code" TEXT,
    "borrower_notes" TEXT,
    "lender_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("trade_id")
);

-- CreateTable
CREATE TABLE "public"."Request" (
    "request_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "stuff_type" "public"."StuffType" NOT NULL,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "subject" TEXT,
    "class_year" TEXT,
    "urgency_level" "public"."UrgencyLevel" NOT NULL DEFAULT 'MEDIUM',
    "needed_by_date" TIMESTAMP(3),
    "rental_duration_days" INTEGER,
    "max_price" DECIMAL(10,2),
    "max_rental_per_day" DECIMAL(10,2),
    "target_school_college_id" TEXT,
    "location_latitude" DOUBLE PRECISION,
    "location_longitude" DOUBLE PRECISION,
    "search_radius_km" DOUBLE PRECISION DEFAULT 10.0,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'OPEN',
    "matched_offer_id" TEXT,
    "fulfilled_by_trade_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "Request_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "review_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "target_user_id" TEXT NOT NULL,
    "stuff_id" TEXT,
    "trade_id" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "message" TEXT,
    "type" "public"."ReviewType" NOT NULL,
    "is_helpful_count" INTEGER NOT NULL DEFAULT 0,
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "message_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "offer_id" TEXT,
    "trade_id" TEXT,
    "subject" TEXT,
    "text" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "public"."Reminder" (
    "reminder_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "trade_id" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "type" "public"."ReminderType" NOT NULL,
    "is_sent" BOOLEAN NOT NULL DEFAULT false,
    "is_dismissed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("reminder_id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "activity_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("activity_id")
);

-- CreateTable
CREATE TABLE "public"."SafeDetails" (
    "safe_detail_id" TEXT NOT NULL,
    "profile_id" TEXT,
    "contact_name" TEXT,
    "contact_email" TEXT NOT NULL,
    "contact_phone" TEXT,
    "pickup_address" TEXT NOT NULL,
    "landmark" TEXT,
    "alternate_contact" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "pickup_instructions" TEXT,
    "available_timings" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SafeDetails_pkey" PRIMARY KEY ("safe_detail_id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "transaction_id" TEXT NOT NULL,
    "trade_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "type" TEXT NOT NULL,
    "payment_provider" TEXT,
    "payment_intent_id" TEXT,
    "status" "public"."TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "public"."SearchAnalytics" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "search_query" TEXT NOT NULL,
    "stuff_type" "public"."StuffType",
    "location" TEXT,
    "results_count" INTEGER NOT NULL,
    "clicked_offer_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SystemSettings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "public"."User"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_clerk_id_idx" ON "public"."User"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "public"."Profile"("user_id");

-- CreateIndex
CREATE INDEX "Profile_latitude_longitude_idx" ON "public"."Profile"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Profile_school_college_id_idx" ON "public"."Profile"("school_college_id");

-- CreateIndex
CREATE INDEX "Profile_city_state_idx" ON "public"."Profile"("city", "state");

-- CreateIndex
CREATE INDEX "SchoolCollege_city_state_idx" ON "public"."SchoolCollege"("city", "state");

-- CreateIndex
CREATE INDEX "SchoolCollege_name_idx" ON "public"."SchoolCollege"("name");

-- CreateIndex
CREATE INDEX "Stuff_title_idx" ON "public"."Stuff"("title");

-- CreateIndex
CREATE INDEX "Stuff_subject_idx" ON "public"."Stuff"("subject");

-- CreateIndex
CREATE INDEX "Stuff_type_idx" ON "public"."Stuff"("type");

-- CreateIndex
CREATE INDEX "Stuff_owner_id_idx" ON "public"."Stuff"("owner_id");

-- CreateIndex
CREATE INDEX "Stuff_is_available_idx" ON "public"."Stuff"("is_available");

-- CreateIndex
CREATE INDEX "StuffImage_stuff_id_idx" ON "public"."StuffImage"("stuff_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "public"."Tag"("name");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "public"."Tag"("name");

-- CreateIndex
CREATE INDEX "Offer_latitude_longitude_idx" ON "public"."Offer"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Offer_offer_type_idx" ON "public"."Offer"("offer_type");

-- CreateIndex
CREATE INDEX "Offer_created_at_idx" ON "public"."Offer"("created_at");

-- CreateIndex
CREATE INDEX "Offer_user_id_idx" ON "public"."Offer"("user_id");

-- CreateIndex
CREATE INDEX "Offer_is_active_idx" ON "public"."Offer"("is_active");

-- CreateIndex
CREATE INDEX "Trade_borrower_id_idx" ON "public"."Trade"("borrower_id");

-- CreateIndex
CREATE INDEX "Trade_lender_id_idx" ON "public"."Trade"("lender_id");

-- CreateIndex
CREATE INDEX "Trade_status_idx" ON "public"."Trade"("status");

-- CreateIndex
CREATE INDEX "Trade_created_at_idx" ON "public"."Trade"("created_at");

-- CreateIndex
CREATE INDEX "Request_user_id_idx" ON "public"."Request"("user_id");

-- CreateIndex
CREATE INDEX "Request_stuff_type_idx" ON "public"."Request"("stuff_type");

-- CreateIndex
CREATE INDEX "Request_status_idx" ON "public"."Request"("status");

-- CreateIndex
CREATE INDEX "Request_created_at_idx" ON "public"."Request"("created_at");

-- CreateIndex
CREATE INDEX "Request_location_latitude_location_longitude_idx" ON "public"."Request"("location_latitude", "location_longitude");

-- CreateIndex
CREATE INDEX "Review_target_user_id_idx" ON "public"."Review"("target_user_id");

-- CreateIndex
CREATE INDEX "Review_stuff_id_idx" ON "public"."Review"("stuff_id");

-- CreateIndex
CREATE INDEX "Review_created_at_idx" ON "public"."Review"("created_at");

-- CreateIndex
CREATE INDEX "Message_sender_id_idx" ON "public"."Message"("sender_id");

-- CreateIndex
CREATE INDEX "Message_receiver_id_idx" ON "public"."Message"("receiver_id");

-- CreateIndex
CREATE INDEX "Message_sent_at_idx" ON "public"."Message"("sent_at");

-- CreateIndex
CREATE INDEX "Notification_user_id_is_read_idx" ON "public"."Notification"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "Notification_created_at_idx" ON "public"."Notification"("created_at");

-- CreateIndex
CREATE INDEX "Reminder_user_id_due_date_idx" ON "public"."Reminder"("user_id", "due_date");

-- CreateIndex
CREATE INDEX "Reminder_is_sent_idx" ON "public"."Reminder"("is_sent");

-- CreateIndex
CREATE INDEX "Activity_user_id_timestamp_idx" ON "public"."Activity"("user_id", "timestamp");

-- CreateIndex
CREATE INDEX "Activity_action_type_idx" ON "public"."Activity"("action_type");

-- CreateIndex
CREATE INDEX "SafeDetails_profile_id_idx" ON "public"."SafeDetails"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_trade_id_key" ON "public"."Transaction"("trade_id");

-- CreateIndex
CREATE INDEX "Transaction_user_id_idx" ON "public"."Transaction"("user_id");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "public"."Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_created_at_idx" ON "public"."Transaction"("created_at");

-- CreateIndex
CREATE INDEX "SearchAnalytics_created_at_idx" ON "public"."SearchAnalytics"("created_at");

-- CreateIndex
CREATE INDEX "SearchAnalytics_search_query_idx" ON "public"."SearchAnalytics"("search_query");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_school_college_id_fkey" FOREIGN KEY ("school_college_id") REFERENCES "public"."SchoolCollege"("school_college_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Stuff" ADD CONSTRAINT "Stuff_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StuffImage" ADD CONSTRAINT "StuffImage_stuff_id_fkey" FOREIGN KEY ("stuff_id") REFERENCES "public"."Stuff"("stuff_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StuffTag" ADD CONSTRAINT "StuffTag_stuff_id_fkey" FOREIGN KEY ("stuff_id") REFERENCES "public"."Stuff"("stuff_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StuffTag" ADD CONSTRAINT "StuffTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StuffFavorite" ADD CONSTRAINT "StuffFavorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StuffFavorite" ADD CONSTRAINT "StuffFavorite_stuff_id_fkey" FOREIGN KEY ("stuff_id") REFERENCES "public"."Stuff"("stuff_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Offer" ADD CONSTRAINT "Offer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Offer" ADD CONSTRAINT "Offer_stuff_id_fkey" FOREIGN KEY ("stuff_id") REFERENCES "public"."Stuff"("stuff_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."Offer"("offer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_borrower_id_fkey" FOREIGN KEY ("borrower_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trade" ADD CONSTRAINT "Trade_safe_detail_id_fkey" FOREIGN KEY ("safe_detail_id") REFERENCES "public"."SafeDetails"("safe_detail_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Request" ADD CONSTRAINT "Request_target_school_college_id_fkey" FOREIGN KEY ("target_school_college_id") REFERENCES "public"."SchoolCollege"("school_college_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_stuff_id_fkey" FOREIGN KEY ("stuff_id") REFERENCES "public"."Stuff"("stuff_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "public"."Offer"("offer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reminder" ADD CONSTRAINT "Reminder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SafeDetails" ADD CONSTRAINT "SafeDetails_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."Profile"("profile_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_trade_id_fkey" FOREIGN KEY ("trade_id") REFERENCES "public"."Trade"("trade_id") ON DELETE RESTRICT ON UPDATE CASCADE;
