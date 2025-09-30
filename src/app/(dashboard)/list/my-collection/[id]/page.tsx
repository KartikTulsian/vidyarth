import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import SingleStuffClient from "../../browse-vidya/[id]/SingleStuffClient";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import FormContainer from "@/components/FormContainer";

// Prisma validator for Stuff with all relations
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
        { is_primary: "desc" },
        { created_at: "asc" },
      ],
    },
    offers: {
      where: { is_active: true },
      orderBy: { created_at: "desc" },
    },
    reviews: {
      include: {
        reviewer: { include: { profile: true } },
      },
      orderBy: { created_at: "desc" },
      take: 10,
    },
    tags: {
      include: { tag: true },
    },
  },
});

export type StuffWithRelations = Prisma.StuffGetPayload<
  typeof stuffWithRelations
>;

export default async function SingleCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const clerkUser = await currentUser();
  if (!clerkUser) notFound();

  const dbUser = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
  });

  if (!dbUser) notFound();

  // ✅ Verify the user has borrowed this stuff via a trade
  const trade = await prisma.trade.findFirst({
    where: {
      offer: {
        stuff_id: id,
      },
      borrower_id: dbUser.user_id,
    },
    include: {
      offer: {
        include: {
          stuff: {
            ...stuffWithRelations,
          },
        },
      },
    },
  });

  if (!trade || !trade.offer?.stuff) {
    notFound();
  }

  const stuff = trade.offer.stuff;

  // Increment view count
  await prisma.stuff.update({
    where: { stuff_id: stuff.stuff_id },
    data: {
      views_count: { increment: 1 },
    },
  });

  return (
    <div>
      <SingleStuffClient stuff={stuff} />
      <div>
        <div className="fixed bottom-7 right-5 z-[1000]">
          <div
            className='h-12 w-45 rounded-2xl bg-[#FAE27C] text-black flex items-center justify-center gap-4 shadow-lg cursor-pointer'
          >
            <FormContainer
              table="review"
              type="create"
              data={stuff}
              id={stuff.stuff_id}
            />
            Give Review
          </div>
        </div>
      </div>
    </div>
  )
}
