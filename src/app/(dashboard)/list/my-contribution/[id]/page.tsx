import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import SingleStuffClient from "../../browse-vidya/[id]/SingleStuffClient";
import { currentUser } from "@clerk/nextjs/server";
import ChatButton from "@/components/ChatButton";

const stuffWithRelations = Prisma.validator<Prisma.StuffDefaultArgs>()({
  include: {
    owner: {
      include: {
        profile: {
          include: {
            schoolCollege: true,
          },
        },
      },
    },
    images: {
      orderBy: [
        { is_primary: 'desc' },
        { created_at: 'asc' }
      ]
    },
    offers: {
      where: {
        is_active: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    },
    reviews: {
      include: {
        reviewer: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 10,
    },
    tags: {
      include: {
        tag: true,
      },
    },
  },
});

export type StuffWithRelations = Prisma.StuffGetPayload<typeof stuffWithRelations>;

export default async function SingleContributionPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error('Not authenticated');
    }
  
    const dbUser = await prisma.user.findUnique({
      where: { email: clerkUser.emailAddresses[0].emailAddress },
    })
  
    if (!dbUser) {
      throw new Error('User record not found in database');
    }

  const stuff = await prisma.stuff.findUnique({
    where: { 
      stuff_id: id,
      is_available: true, // Only show available items
    },
    ...stuffWithRelations,
  });

  if (!stuff) {
    notFound();
  }

  // Increment view count
  await prisma.stuff.update({
    where: { stuff_id: id },
    data: {
      views_count: {
        increment: 1,
      },
    },
  });

  const activeOffer = stuff.offers.length > 0 ? stuff.offers[0] : null;

  // Determine user roles
  const isOwner = stuff.owner_id === dbUser.user_id;
  const stuffOwnerName = stuff.owner.profile?.display_name ||
    stuff.owner.profile?.full_name ||
    stuff.owner.username ||
    'User';
  const stuffOwnerAvatar = stuff.owner.profile?.avatar_url || undefined;

  // const latestMessage = await prisma.message.findFirst({
  //   where: {
  //     offer_id: activeOffer?.offer_id,
  //     // Check for messages sent to the current user (the borrower)
  //     receiver_id: dbUser.user_id,
  //     trade_request_status: "INITIATED", // Only get the specific trade message
  //   },
  //   orderBy: {
  //     sent_at: "desc",
  //   },
  //   select: {
  //     sender_id: true,
  //     trade_request_status: true,
  //   },
  // });

  // 💡 NEW: Condition to check if a trade has been initiated
  // const showTradeButton = latestMessage?.trade_request_status === "INITIATED";

  const chatButtonProps = {
    offerId: activeOffer?.offer_id,
    stuffOwnerId: stuff.owner_id,
    stuffOwnerName: stuffOwnerName,
    stuffOwnerAvatar: stuffOwnerAvatar,
    currentUserId: dbUser.user_id,
    stuffTitle: stuff.title,
    isOwner: isOwner,
  };

  return (
      <div>
        <SingleStuffClient stuff={stuff} />
        <ChatButton
          {...chatButtonProps}
        />
      </div>
    )
}