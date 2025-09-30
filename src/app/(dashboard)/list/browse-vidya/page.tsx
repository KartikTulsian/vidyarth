import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import BrowseVidyaClient from "./BrowseVidyaClient";

const offerWithStuff = Prisma.validator<Prisma.OfferDefaultArgs>()({
  include: {
    stuff: {
      include: {
        images: true,
      },
    },
    user: {
      include: {
        profile: {
          include: {
            schoolCollege: true,
          },
        },
      },
    },
  },
});

export type OfferWithStuff = Prisma.OfferGetPayload<typeof offerWithStuff>;

export type OfferWithStuffClient = Omit<OfferWithStuff, "price" | "rental_price_per_day" | "stuff"> & {
  price: number | null;
  rental_price_per_day: number | null;
  stuff: Omit<OfferWithStuff["stuff"], "original_price"> & {
    original_price: number | null;
  };
};

export default async function BrowseVidyaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { userId } = await auth();
  const params = await searchParams;

  // Get user's profile for location-based filtering
  let userLocation: { lat: number; lng: number } | undefined;
  if (userId) {
    const userWithProfile = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: {
        profile: {
          include: {
            schoolCollege: true,
          },
        },
      },
    });

    if (userWithProfile?.profile?.latitude && userWithProfile?.profile?.longitude) {
      userLocation = {
        lat: userWithProfile.profile.latitude,
        lng: userWithProfile.profile.longitude,
      };
    }
  }

  // Build where clause based on search params and user context
  const whereClause: Prisma.OfferWhereInput = {
    is_active: true,
    stuff: {
      is_available: true,
    },
    AND: [
      // Location-based filtering
      userLocation
        ? {
          OR: [
            {
              latitude: { not: null },
              longitude: { not: null },
            },
            {
              user: {
                profile: {
                  school_college_id: {
                    in: await prisma.profile
                      .findMany({
                        where: { user: { clerk_id: userId } },
                        select: { school_college_id: true },
                      })
                      .then((profiles) =>
                        profiles
                          .map((p) => p.school_college_id)
                          .filter(Boolean) as string[]
                      ),
                  },
                },
              },
            },
          ],
        }
        : {},

      // 🔑 Search query must go inside stuff
      params.search
        ? {
          stuff: {
            OR: [
              { title: { contains: params.search as string, mode: "insensitive" } },
              { description: { contains: params.search as string, mode: "insensitive" } },
              { subject: { contains: params.search as string, mode: "insensitive" } },
              { author: { contains: params.search as string, mode: "insensitive" } },
            ],
          },
        }
        : {},

      // Type filters
      params.stuffType
        ? {
          stuff: {
            type: {
              in: Array.isArray(params.stuffType)
                ? params.stuffType
                : [params.stuffType],
            },
          },
        }
        : {},

      params.offerType
        ? {
          offer_type: {
            in: Array.isArray(params.offerType)
              ? params.offerType
              : [params.offerType],
          },
        }
        : {},

      params.condition
        ? {
          stuff: {
            condition: {
              in: Array.isArray(params.condition)
                ? params.condition
                : [params.condition],
            },
          },
        }
        : {},
    ].filter(Boolean) as Prisma.OfferWhereInput[],
  };


  const offersRaw = await prisma.offer.findMany({
    where: whereClause,
    include: offerWithStuff.include,
    orderBy: [{ created_at: "desc" }],
    take: 100,
  });

  // Convert Decimal to number/string
  const offers: OfferWithStuffClient[] = offersRaw.map((offer) => ({
    ...offer,
    price: offer.price ?? null,
    rental_price_per_day: offer.rental_price_per_day ?? null,
    stuff: {
      ...offer.stuff,
      original_price: offer.stuff.original_price ?? null,
    },
  }));

  return (
    <BrowseVidyaClient
      offers={offers}
      userLocation={userLocation}
    />
  );
}