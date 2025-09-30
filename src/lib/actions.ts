"use server";

import { PrismaClient, StuffType, TradeStatus } from "@prisma/client";
import { reminderSchema, ReminderSchema, RequestSchema, requestSchema, reviewSchema, ReviewSchema, StuffOfferSchema, tradeSchema, TradeSchema, UserProfileSchoolSchema } from "@/lib/formValidationSchema";
import { auth, currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

type CurrentState = {
  success: boolean;
  error: boolean | string;
};

export const createUserWithProfileSchool = async (
  currentState: CurrentState,
  data: UserProfileSchoolSchema
): Promise<CurrentState> => {
  try {
    console.log("Creating user with profile:", data);

    const clerkUser = await currentUser();
    if (!clerkUser) return { success: false, error: "No authenticated user found." };
    if (!data.user.password) return { success: false, error: "Password is required." };

    const clerkId = clerkUser.id;
    const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress;

    const { user, profile } = data;

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          user_id: clerkId,
          clerk_id: clerkId,
          email: clerkEmail || user.email,
          username: user.username,
          password: user.password,
          is_active: user.is_active ?? true,
        },
      });

      const newProfile = await tx.profile.create({
        data: {
          user_id: newUser.user_id,
          full_name: profile.full_name,
          display_name: profile.display_name || null,
          gender: profile.gender || null,
          phone: profile.phone || null,
          school_college_id: profile.school_college_id || null, // just reference
          class_year: profile.class_year || null,
          course: profile.course || null,
          department: profile.department || null,
          address: profile.address || null,
          city: profile.city || null,
          state: profile.state || null,
          pincode: profile.pincode || null,
          country: profile.country || "India",
          latitude: profile.latitude ?? null,
          longitude: profile.longitude ?? null,
          avatar_url: profile.avatar_url || null,
          bio: profile.bio || null,
        },
      });

      return { newUser, newProfile };
    });

    console.log("✅ Created user with profile:", result.newUser.user_id);
    return { success: true, error: false };
  } catch (err) {
    console.error("❌ Error creating user+profile:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create user and profile" };
  }
};

export const updateUserWithProfileSchool = async (
  currentState: CurrentState,
  data: UserProfileSchoolSchema & { user_id: string; profile_id: string; school_college_id?: string }
): Promise<CurrentState> => {
  try {
    console.log("Updating user with profile:", data);

    const { user, profile, user_id, profile_id } = data;

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { user_id },
        data: {
          email: user.email,
          username: user.username || null,
          ...(user.password && { password: user.password }),
          is_active: user.is_active ?? true,
        },
      });

      await tx.profile.update({
        where: { profile_id },
        data: {
          full_name: profile.full_name,
          display_name: profile.display_name || null,
          gender: profile.gender || null,
          phone: profile.phone || null,
          school_college_id: profile.school_college_id || null, // just reference
          class_year: profile.class_year || null,
          course: profile.course || null,
          department: profile.department || null,
          address: profile.address || null,
          city: profile.city || null,
          state: profile.state || null,
          pincode: profile.pincode || null,
          country: profile.country || "India",
          latitude: profile.latitude ?? null,
          longitude: profile.longitude ?? null,
          avatar_url: profile.avatar_url || null,
          bio: profile.bio || null,
        },
      });
    });

    console.log("✅ Updated user with profile");
    return { success: true, error: false };
  } catch (err) {
    console.error("❌ Error updating user+profile:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update user and profile" };
  }
};


export const deleteUserWithProfileSchool = async (
  currentState: CurrentState,
  data: FormData
): Promise<CurrentState> => {
  try {
    const user_id = data.get("user_id") as string;
    if (!user_id) return { success: false, error: "User ID is required" };

    console.log("Deleting user with ID:", user_id);

    await prisma.$transaction(async (tx) => {
      // Delete profile first
      await tx.profile.deleteMany({ where: { user_id } });

      // Optionally delete school/college if no one else is linked
      // (Safe way → only delete if orphaned)
      // const orphanSchools = await tx.schoolCollege.findMany({
      //   where: {
      //     profiles: { none: {} },
      //   },
      // });
      // for (const sc of orphanSchools) {
      //   await tx.schoolCollege.delete({ where: { school_college_id: sc.school_college_id } });
      // }

      // Finally delete user
      await tx.user.delete({ where: { user_id } });
    });

    console.log("✅ Deleted user:", user_id);
    return { success: true, error: false };
  } catch (err) {
    console.error("❌ Error deleting user+profile:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete user and profile",
    };
  }
};


export const createStuffWithOffer = async (
  currentState: CurrentState,
  data: StuffOfferSchema
): Promise<CurrentState> => {
  try {
    console.log("Creating stuff with offer:", data);

    const { stuff, offer } = data;

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return { success: false, error: "No authenticated user found." };
    }

    const user_id = clerkUser.id;

    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create the Stuff record
      const newStuff = await tx.stuff.create({
        data: {
          owner_id: user_id,
          type: stuff.type,
          title: stuff.title,
          subtitle: stuff.subtitle || null,
          description: stuff.description || null,
          condition: stuff.condition,
          original_price: stuff.original_price,
          quantity: stuff.quantity,

          author: stuff.type === StuffType.BOOK ? stuff.author || null : null,
          publisher: stuff.type === StuffType.BOOK ? stuff.publisher || null : null,
          edition: stuff.type === StuffType.BOOK ? stuff.edition || null : null,
          isbn: stuff.type === StuffType.BOOK ? stuff.isbn || null : null,
          publication_year: stuff.type === StuffType.BOOK ? stuff.publication_year || null : null,
          book_type: stuff.type === StuffType.BOOK ? stuff.book_type || null : null,

          brand: stuff.type === StuffType.STATIONERY ? stuff.brand || null : null,
          model: stuff.type === StuffType.STATIONERY ? stuff.model || null : null,
          stationery_type: stuff.type === StuffType.STATIONERY ? stuff.stationery_type || null : null,

          language: stuff.language || "English",
          subject: stuff.subject || null,
          genre: stuff.genre || null,
          class_suitability: stuff.class_suitability || null,
        },
      });

      // Step 2: Handle Images
      if (stuff.images.length > 0) {
        await tx.stuffImage.createMany({
          data: stuff.images.map((url, idx) => ({
            stuff_id: newStuff.stuff_id,
            url,
            alt_text: `${newStuff.title} - Image ${idx + 1}`,
            is_primary: idx === 0,
          })),
        });
      }

      // Step 3: Handle Tags (Connect or Create)
      if (stuff.tags.length > 0) {
        for (const tagName of stuff.tags) {
          const tag = await tx.tag.upsert({
            where: { name: tagName.toLowerCase().trim() },
            create: { name: tagName.toLowerCase().trim() },
            update: {},
          });

          await tx.stuffTag.create({
            data: {
              stuff_id: newStuff.stuff_id,
              tag_id: tag.tag_id,
            },
          });
        }
      }

      // Step 4: Create the associated Offer
      const newOffer = await tx.offer.create({
        data: {
          stuff_id: newStuff.stuff_id,
          user_id,
          offer_type: offer.offer_type,
          price: offer.price ?? null,
          rental_price_per_day: offer.rental_price_per_day ?? null,
          rental_period_days: offer.rental_period_days ?? null,
          security_deposit: offer.security_deposit ?? null,
          exchange_item_description: offer.exchange_item_description || null,
          exchange_item_value: offer.exchange_item_value ?? null,
          availability_start: offer.availability_start ? new Date(offer.availability_start) : null,
          availability_end: offer.availability_end ? new Date(offer.availability_end) : null,
          quantity_available: offer.quantity_available,
          pickup_address: offer.pickup_address || null,
          latitude: offer.latitude ?? null,
          longitude: offer.longitude ?? null,
          city: offer.city || null,
          state: offer.state || null,
          pincode: offer.pincode || null,
          visibility_scope: offer.visibility_scope || "PUBLIC",
          terms_conditions: offer.terms_conditions || null,
          special_instructions: offer.special_instructions || null,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return { newStuff, newOffer };
    });

    console.log("Successfully created stuff with offer:", result.newStuff.stuff_id);
    // revalidatePath("/dashboard/manage-listings");
    // revalidatePath("/browse-vidya");
    return { success: true, error: false };

  } catch (err) {
    console.error("❌ Error creating stuff+offer:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create stuff and offer",
    };
  }
};

export const updateStuffWithOffer = async (
  currentState: CurrentState,
  data: StuffOfferSchema & { stuff_id: string; offer_id: string }
): Promise<CurrentState> => {
  try {
    console.log("Updating stuff with offer:", data);

    if (!data.stuff_id || !data.offer_id) {
      return { success: false, error: "Stuff ID and Offer ID are required for update" };
    }

    const { stuff, offer, stuff_id, offer_id } = data;

    await prisma.$transaction(async (tx) => {
      // Step 1: Update Stuff
      const updatedStuff = await tx.stuff.update({
        where: { stuff_id },
        data: {
          type: stuff.type,
          title: stuff.title,
          subtitle: stuff.subtitle || null,
          description: stuff.description || null,
          condition: stuff.condition,
          original_price: stuff.original_price,
          quantity: stuff.quantity,
          author: stuff.type === StuffType.BOOK ? stuff.author || null : null,
          publisher: stuff.type === StuffType.BOOK ? stuff.publisher || null : null,
          edition: stuff.type === StuffType.BOOK ? stuff.edition || null : null,
          isbn: stuff.type === StuffType.BOOK ? stuff.isbn || null : null,
          publication_year: stuff.type === StuffType.BOOK ? stuff.publication_year || null : null,
          book_type: stuff.type === StuffType.BOOK ? stuff.book_type || null : null,
          brand: stuff.type === StuffType.STATIONERY ? stuff.brand || null : null,
          model: stuff.type === StuffType.STATIONERY ? stuff.model || null : null,
          stationery_type: stuff.type === StuffType.STATIONERY ? stuff.stationery_type || null : null,
          language: stuff.language || "English",
          subject: stuff.subject || null,
          genre: stuff.genre || null,
          class_suitability: stuff.class_suitability || null,
        },
      });

      // Step 2: Handle Images - delete old, create new
      await tx.stuffImage.deleteMany({ where: { stuff_id } });
      if (stuff.images.length > 0) {
        await tx.stuffImage.createMany({
          data: stuff.images.map((url, idx) => ({
            stuff_id: updatedStuff.stuff_id,
            url,
            alt_text: `${updatedStuff.title} - Image ${idx + 1}`,
            is_primary: idx === 0,
          })),
        });
      }

      // Step 3: Handle Tags - delete old, create new relationships
      await tx.stuffTag.deleteMany({ where: { stuff_id } });
      if (stuff.tags.length > 0) {
        // Iterate and create/connect each tag individually
        for (const tagName of stuff.tags) {
          const tag = await tx.tag.upsert({
            where: { name: tagName.toLowerCase().trim() },
            create: { name: tagName.toLowerCase().trim() },
            update: {},
          });

          await tx.stuffTag.create({
            data: {
              stuff_id: updatedStuff.stuff_id,
              tag_id: tag.tag_id,
            },
          });
        }
      }

      // Step 4: Update Offer
      await tx.offer.update({
        where: { offer_id },
        data: {
          offer_type: offer.offer_type,
          price: offer.price ?? null,
          rental_price_per_day: offer.rental_price_per_day ?? null,
          rental_period_days: offer.rental_period_days ?? null,
          security_deposit: offer.security_deposit ?? null,
          exchange_item_description: offer.exchange_item_description || null,
          exchange_item_value: offer.exchange_item_value ?? null,
          availability_start: offer.availability_start ? new Date(offer.availability_start) : null,
          availability_end: offer.availability_end ? new Date(offer.availability_end) : null,
          quantity_available: offer.quantity_available,
          pickup_address: offer.pickup_address || null,
          latitude: offer.latitude ?? null,
          longitude: offer.longitude ?? null,
          city: offer.city || null,
          state: offer.state || null,
          pincode: offer.pincode || null,
          visibility_scope: offer.visibility_scope || "PUBLIC",
          terms_conditions: offer.terms_conditions || null,
          special_instructions: offer.special_instructions || null,
        },
      });
    });

    console.log("Successfully updated stuff with offer");
    // revalidatePath("/dashboard/manage-listings");
    // revalidatePath("/browse-vidya");
    return { success: true, error: false };

  } catch (err) {
    console.error("❌ Error updating stuff+offer:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update stuff and offer",
    };
  }
};

export const deleteStuffWithOffer = async (
  currentState: CurrentState,
  data: FormData
): Promise<CurrentState> => {
  try {
    const stuff_id = data.get("stuff_id") as string;
    if (!stuff_id) return { success: false, error: "Stuff ID is required" };
    console.log("Attempting to delete stuff with ID:", stuff_id);

    // This transaction ensures all related records are deleted safely.
    // The order is important due to foreign key constraints.
    await prisma.$transaction(async (tx) => {
      // Delete offers associated with the stuff.
      // This will cascade to any related trades, messages, etc.
      await tx.offer.deleteMany({ where: { stuff_id } });

      // Delete stuff images
      await tx.stuffImage.deleteMany({ where: { stuff_id } });

      // Delete StuffTag relationships. The Tag record itself is not deleted.
      await tx.stuffTag.deleteMany({ where: { stuff_id } });

      // Delete stuff favorites
      await tx.stuffFavorite.deleteMany({ where: { stuff_id } });

      // Delete reviews related to this stuff
      await tx.review.deleteMany({ where: { stuff_id } });

      // Finally, delete the stuff record itself.
      await tx.stuff.delete({ where: { stuff_id } });
    });

    console.log("Successfully deleted stuff with ID:", stuff_id);
    return { success: true, error: false };

  } catch (err) {
    console.error("❌ Error deleting stuff+offer:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete stuff and offer",
    };
  }
};

export const createReview = async (
  currentState: CurrentState,
  data: ReviewSchema
) => {
  try {
    const parsed = reviewSchema.parse(data);

    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "You must be logged in to create a result." };
    }

    await prisma.review.create({
      data: {
        reviewer_id: userId,
        target_user_id: parsed.target_user_id,
        stuff_id: parsed.stuff_id,
        trade_id: parsed.trade_id || null,
        rating: parsed.rating,
        title: parsed.title,
        message: parsed.message,
        type: parsed.type,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
}

export const updateReview = async (
  currentState: CurrentState,
  data: ReviewSchema
) => {
  try {
    const parsed = reviewSchema.parse(data);

    if (!parsed.review_id) {
      return { success: false, error: "Review ID is required" };
    }

    await prisma.review.update({
      where: { review_id: parsed.review_id },
      data: {
        rating: parsed.rating,
        title: parsed.title,
        message: parsed.message,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
}

export const deleteReview = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.review.delete({
      where: {
        review_id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createRequest = async (currentState: CurrentState, data: RequestSchema) => {
  try {
    const parsed = requestSchema.parse(data);

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return { success: false, error: "No authenticated user found." };
    }

    const user_id = clerkUser.id;

    await prisma.request.create({
      data: {
        user_id: user_id,
        stuff_type: parsed.stuff_type,
        title: parsed.title,
        description: parsed.description,
        subject: parsed.subject,
        class_year: parsed.class_year,
        urgency_level: parsed.urgency_level || "MEDIUM",
        needed_by_date: parsed.needed_by_date ? new Date(parsed.needed_by_date) : null,
        rental_duration_days: parsed.rental_duration_days,
        max_price: parsed.max_price,
        max_rental_per_day: parsed.max_rental_per_day,
        target_school_college_id: parsed.target_school_college_id,
        location_latitude: parsed.location_latitude,
        location_longitude: parsed.location_longitude,
        search_radius_km: parsed.search_radius_km || 10.0,
        status: parsed.status || "OPEN",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// Update Request
export const updateRequest = async (currentState: CurrentState, data: RequestSchema) => {
  try {
    const parsed = requestSchema.parse(data);

    if (!parsed.request_id) {
      return { success: false, error: "Request ID is required" };
    }

    await prisma.request.update({
      where: { request_id: data.request_id },
      data: {
        stuff_type: parsed.stuff_type,
        title: parsed.title,
        description: parsed.description,
        subject: parsed.subject,
        class_year: parsed.class_year,
        urgency_level: parsed.urgency_level,
        needed_by_date: parsed.needed_by_date ? new Date(parsed.needed_by_date) : null,
        rental_duration_days: parsed.rental_duration_days,
        max_price: parsed.max_price,
        max_rental_per_day: parsed.max_rental_per_day,
        target_school_college_id: parsed.target_school_college_id,
        location_latitude: parsed.location_latitude,
        location_longitude: parsed.location_longitude,
        search_radius_km: parsed.search_radius_km,
        status: parsed.status,
        updated_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// Delete Request
export const deleteRequest = async (currentState: CurrentState, data: FormData) => {
  const id = data.get("id") as string;
  try {
    await prisma.request.delete({
      where: {
        request_id: id,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

export const createTrade = async (
  currentState: CurrentState,
  data: TradeSchema
): Promise<CurrentState> => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "You must be logged in to create a trade." };
    }

    const userId = clerkUser.id;

    const parsed = tradeSchema.parse({
      ...data,
      borrower_id: userId, // Securely add the lender ID from Clerk
      status: "PENDING", // Force status to PENDING on creation
    });

    const offer = await prisma.offer.findUnique({
      where: { offer_id: parsed.offer_id },
      select: {
        stuff: { select: { owner_id: true } },
        is_active: true,
      },
    });

    if (!offer || !offer.is_active) {
      return { success: false, error: "The offer is not active or does not exist." };
    }

    // Ensure the lender ID matches the stuff owner's ID
    if (offer.stuff.owner_id !== parsed.lender_id) {
      return { success: false, error: "You are not authorized to create a trade for this item." };
    }

    // Create the new trade request
    await prisma.trade.create({
      data: {
        offer_id: parsed.offer_id,
        borrower_id: parsed.borrower_id,
        lender_id: parsed.lender_id,
        status: parsed.status ?? "PENDING",
        agreed_price: parsed.agreed_price,
        security_deposit: parsed.security_deposit,
        borrower_notes: parsed.borrower_notes,
        lender_notes: parsed.lender_notes,
        start_date: parsed.start_date ? new Date(parsed.start_date) : null,
        end_date: parsed.end_date ? new Date(parsed.end_date) : null,
        actual_return_date: parsed.actual_return_date ? new Date(parsed.actual_return_date) : null,
        late_fee: parsed.late_fee,
        pickup_code: parsed.pickup_code,
        return_code: parsed.return_code,
        borrower_rating: parsed.borrower_rating,
        lender_rating: parsed.lender_rating
      },
    });

    // Revalidate paths after creating a new trade

    return { success: true, error: false };
  } catch (err) {
    console.error("❌ Error creating trade:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create trade.",
    };
  }
};

export const updateTrade = async (
  currentState: CurrentState,
  data: TradeSchema
): Promise<CurrentState> => {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "You must be logged in to update a trade." };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerk_id: clerkUser.id },
      select: { user_id: true }
    });
    if (!dbUser) {
      return { success: false, error: "User not found." };
    }

    const parsed = tradeSchema.parse(data);

    if (!parsed.trade_id) {
      return { success: false, error: "Trade ID is required for update." };
    }

    // Check if the current user is the lender or borrower of this trade
    const existingTrade = await prisma.trade.findUnique({
      where: { trade_id: parsed.trade_id },
      select: { lender_id: true, borrower_id: true },
    });

    if (!existingTrade || (existingTrade.lender_id !== dbUser.user_id && existingTrade.borrower_id !== dbUser.user_id)) {
      return { success: false, error: "You are not authorized to update this trade." };
    }

    await prisma.trade.update({
      where: { trade_id: parsed.trade_id },
      data: {
        status: parsed.status,
        start_date: parsed.start_date ? new Date(parsed.start_date) : null,
        end_date: parsed.end_date ? new Date(parsed.end_date) : null,
        actual_return_date: parsed.end_date ? new Date(parsed.end_date) : null,
        agreed_price: parsed.agreed_price,
        security_deposit: parsed.security_deposit,
        borrower_notes: parsed.borrower_notes,
        lender_notes: parsed.lender_notes,
        borrower_rating: parsed.borrower_rating,
        lender_rating: parsed.lender_rating,
        late_fee: parsed.late_fee,
        pickup_code: parsed.pickup_code,
        return_code: parsed.return_code,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("❌ Error updating trade:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update trade.",
    };
  }
};

export const deleteTrade = async (
  currentState: CurrentState,
  data: FormData
): Promise<CurrentState> => {
  const tradeId = data.get("trade_id") as string;

  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "You must be logged in to delete a trade." };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerk_id: clerkUser.id },
      select: { user_id: true }
    });
    if (!dbUser) {
      return { success: false, error: "User not found." };
    }

    const trade = await prisma.trade.findUnique({
      where: { trade_id: tradeId },
      select: { lender_id: true, status: true },
    });

    if (!trade) {
      return { success: false, error: "Trade not found." };
    }

    if (trade.lender_id !== dbUser.user_id) {
      return { success: false, error: "You are not authorized to delete this trade." };
    }

    // Only allow deletion if the trade is in a PENDING or CANCELLED state
    if (trade.status !== TradeStatus.PENDING && trade.status !== TradeStatus.CANCELLED) {
      return { success: false, error: "Cannot delete a trade that is in progress or completed." };
    }

    await prisma.trade.delete({
      where: { trade_id: tradeId },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("❌ Error deleting trade:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete trade.",
    };
  }
};

export const createReminder = async (currentState: CurrentState, data: ReminderSchema) => {
  try {
    const parsed = reminderSchema.parse(data);

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return { success: false, error: "You must be logged in to create a trade." };
    }

    const userId = clerkUser.id;

    await prisma.reminder.create({
      data: {
        title: parsed.title,
        message: parsed.message,
        due_date: new Date(parsed.due_date),
        type: parsed.type,
        trade_id: parsed.trade_id,
        user_id: userId,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error creating reminder:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to create reminder." };
  }
};

export const updateReminder = async (currentState: CurrentState, data: ReminderSchema) => {
  try {
    if (!data.reminder_id) return { success: false, error: "Reminder ID is required for update." };

    const parsed = reminderSchema.parse(data);

    await prisma.reminder.update({
      where: { reminder_id: data.reminder_id },
      data: {
        title: parsed.title,
        message: parsed.message,
        due_date: new Date(parsed.due_date),
        type: parsed.type,
        is_sent: parsed.is_sent,
        is_dismissed: parsed.is_dismissed,
        trade_id: parsed.trade_id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.error("Error updating reminder:", err);
    return { success: false, error: err instanceof Error ? err.message : "Failed to update reminder." };
  }
};

export const deleteReminder = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.reminder.delete({
      where: {
        reminder_id: id,
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
}