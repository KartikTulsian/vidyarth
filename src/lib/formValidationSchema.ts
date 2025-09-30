import { z } from "zod";

const userSchema = z.object({
  user_id: z.string().optional(),
  clerk_id: z.string().optional(),
  email: z.string(),
  username: z.string().min(2, "Username required").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  is_active: z.boolean().optional(),
});

const profileSchema = z.object({
  profile_id: z.string().optional(),
  full_name: z.string().min(2, "Full name required"),
  display_name: z.string().optional(),
  gender: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
    .optional(),
  school_college_id: z.string().optional(),
  class_year: z.string().optional(),
  course: z.string().optional(),
  department: z.string().optional(),

  // Address
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  country: z.string().default("India"),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),

  // Profile details
  avatar_url: z.string().optional(),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
});

export const userProfileSchoolSchema = z.object({
  user: userSchema,
  profile: profileSchema,
  // schoolCollege: schoolCollegeSchema.optional(),
});

export type UserProfileSchoolSchema = z.infer<typeof userProfileSchoolSchema>;


const stuffSchema = z.object({
  stuff_id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["BOOK", "STATIONERY", "ELECTRONICS", "NOTES", "OTHER"]),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
  original_price: z.coerce.number().min(0, { message: "Price must be ≥ 0" }),
  quantity: z.coerce.number().min(1, { message: "Quantity must be at least 1" }).default(1),

  // Optional book fields
  author: z.string().optional(),
  publisher: z.string().optional(),
  edition: z.string().optional(),
  isbn: z.string().optional(),
  publication_year: z.coerce.number().optional(),
  book_type: z.enum(["TEXTBOOK", "REFERENCE", "NOVEL", "JOURNAL", "MAGAZINE", "WORKBOOK", "GUIDE"]).optional(),

  // Stationery-specific
  brand: z.string().optional(),
  model: z.string().optional(),
  stationery_type: z.enum(["WRITING", "DRAWING", "CALCULATION", "STORAGE", "CRAFT", "OTHER"]).optional(),

  // Common metadata
  language: z.string().optional(),
  subject: z.string().optional(),
  genre: z.string().optional(),
  class_suitability: z.string().optional(),

  // Images & tags
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),

  // New Read-only Fields
  views_count: z.number().optional(),
  favorites_count: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).refine((data) => {
  // If type is BOOK, require author
  if (data.type === "BOOK" && (!data.author || data.author.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Author is required for books",
  path: ["author"]
});

// Schema for Offer
const offerSchema = z.object({
  offer_id: z.string().optional(),
  offer_type: z.enum(["SELL", "LEND", "RENT", "SHARE", "EXCHANGE"]),
  price: z.coerce.number().min(0).optional().nullable(),
  rental_price_per_day: z.coerce.number().optional().nullable(),
  rental_period_days: z.coerce.number().optional().nullable(),
  security_deposit: z.coerce.number().optional().nullable(),
  exchange_item_description: z.string().optional(),
  exchange_item_value: z.coerce.number().optional().nullable(),

  availability_start: z.string().optional(),
  availability_end: z.string().optional(),
  quantity_available: z.coerce.number().default(1),

  pickup_address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),

  visibility_scope: z.string().default("PUBLIC"),
  terms_conditions: z.string().optional(),
  special_instructions: z.string().optional(),
  
  // New Read-only Fields
  views_count: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  expires_at: z.string().optional(),
}).refine((data) => {
  // Validate based on offer type
  if (data.offer_type === "SELL" && (!data.price || data.price <= 0)) {
    return false;
  }
  if (data.offer_type === "RENT") {
    if (!data.rental_price_per_day || data.rental_price_per_day <= 0) {
      return false;
    }
  }
  if (data.offer_type === "EXCHANGE" && (!data.exchange_item_description || data.exchange_item_description.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Required fields missing based on offer type",
  path: ["offer_type"]
});

// Combine Stuff + Offer
export const stuffOfferSchema = z.object({
  stuff: stuffSchema,
  offer: offerSchema,
});

export type StuffOfferSchema = z.infer<typeof stuffOfferSchema>;
export type OfferType = z.infer<typeof offerSchema>["offer_type"];
export type StuffType = z.infer<typeof stuffSchema>["type"];
export type ItemCondition = z.infer<typeof stuffSchema>["condition"];
export type BookType = z.infer<typeof stuffSchema>["book_type"];
export type StationeryType = z.infer<typeof stuffSchema>["stationery_type"];

export const reviewSchema = z.object({
  review_id: z.string().optional(),
  target_user_id: z.string(),
  stuff_id: z.string().optional(),
  trade_id: z.string().optional(),
  rating: z
    .number({ message: "Rating is required" })
    .min(1, "Minimum rating is 1")
    .max(5, "Maximum rating is 5"),
  title: z.string().max(100, "Title too long").optional(),
  message: z
    .string()
    .min(10, "Message should be at least 10 characters")
    .max(1000, "Message too long"),
  type: z.enum(["UNIVERSAL_STUFF", "THANK_YOU_MESSAGE", "USER_RATING"], {
    message: "Type is required",
  }),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;

export const requestSchema = z.object({
  request_id: z.string().optional(),
  user_id: z.string(), // logged-in user ID
  stuff_type: z.enum([
    "BOOK",
    "STATIONERY",
    "ELECTRONICS",
    "NOTES",
    "OTHER",
  ], { message: "Select a valid stuff type" }),
  
  // Request Details
  title: z.string().max(100, "Title too long").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description too long"),
  subject: z.string().max(100).optional(),
  class_year: z.string().max(50).optional(),

  // Urgency & Timing
  urgency_level: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  needed_by_date: z.string().optional(),
  rental_duration_days: z.number().int().positive().optional(),

  // Budget
  max_price: z.number().positive().optional(),
  max_rental_per_day: z.number().positive().optional(),

  // Location & Targeting
  target_school_college_id: z.string().optional(),
  location_latitude: z.number().optional(),
  location_longitude: z.number().optional(),
  search_radius_km: z.number().positive().optional(),

  // Status
  status: z.enum(["OPEN", "MATCHED", "FULFILLED", "CLOSED", "EXPIRED"]).optional(),

  // Matched/fulfilled trades
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  expires_at: z.string().optional(),
});

export type RequestSchema = z.infer<typeof requestSchema>;

export const tradeSchema = z.object({
  trade_id: z.string().optional(),
  offer_id: z.string(),
  borrower_id: z.string(),
  lender_id: z.string(),

  start_date: z.string().optional(),
  end_date: z.string().optional(),
  actual_return_date: z.string().optional(),
  agreed_price: z.coerce.number().optional(),
  security_deposit: z.coerce.number().optional(),
  late_fee: z.coerce.number().optional(),

  // These should be optional as they are not set on creation
  borrower_notes: z.string().optional(),
  lender_notes: z.string().optional(),
  
  // These are system-managed fields, but we include them for type safety
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "COMPLETED", "OVERDUE", "CANCELLED", "IN_PROGRESS"]).default("PENDING"),
  pickup_code: z.string().optional(),
  return_code: z.string().optional(),
  borrower_rating: z.coerce.number().int().min(1).max(5).optional(),
  lender_rating: z.coerce.number().int().min(1).max(5).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type TradeSchema = z.infer<typeof tradeSchema>;

export const reminderSchema = z.object({
  reminder_id: z.string().optional(), // required only for update/delete
  trade_id: z.string().optional(),
  user_id: z.string().optional(), // will usually be injected from currentUser
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  due_date: z.string().min(1, "Due date is required"), // as ISO string
  type: z.enum(["RETURN_DUE", "PICKUP_DUE", "OFFER_EXPIRY", "PAYMENT_DUE", "CUSTOM"]),
  is_sent: z.boolean().optional(),
  is_dismissed: z.boolean().optional(),
});

export type ReminderSchema = z.infer<typeof reminderSchema>;