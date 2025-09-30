import Pagination from '@/components/Pagination';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { currentUser } from '@clerk/nextjs/server';
import { ItemCondition, OfferType, Prisma, StuffType } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function MyCollectionPage({
  searchParams,
} :{
  searchParams: Promise<{ [key: string]: string | undefined}>;
}) {

  const sp = await searchParams;

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error('Not authenticated');
  }

  const dbUser = await prisma.user.findUnique({
    where: {email: clerkUser.emailAddresses[0].emailAddress},
    // include: {
    //   tradesAsBorrower: true,
    //   offers: {
    //     include: {
    //       stuff: true,
    //     }
    //   },
    // },
  })

  if (!dbUser) {
    throw new Error('User record not found in database');
  }

  const page = sp.page ? parseInt(sp.page) : 1;
  const search = sp.search ?? '';

  const query: Prisma.TradeWhereInput = { borrower_id: dbUser.user_id };

  if (search) {
    query.offer = {
      OR: [
        { city: { contains: search, mode: 'insensitive' } },
        { stuff: { title: { contains: search, mode: 'insensitive' } } },
        { stuff: { type: search.toUpperCase() as StuffType } },
        { stuff: { condition: search.toUpperCase() as ItemCondition } },
        { offer_type: search.toUpperCase() as OfferType },
      ],
    };
  }

  const [trades, count] = await prisma.$transaction([
    prisma.trade.findMany({
      where: query,
      include: {
        offer: {
          include: {
            stuff: {
              include: { images: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.trade.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="lg:text-xl text-lg font-semibold">My Contributions</h1>
      </div>

      {trades.length === 0 ? (
        <p className="text-gray-500 mt-6">No borrowed items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {trades.map((trade) => {
            const stuff = trade.offer.stuff;
            const primaryImage = stuff.images.find((img) => img.is_primary)?.url;

            return (
              <Link
                key={trade.trade_id}
                href={`/list/my-collection/${stuff.stuff_id}`}
                className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {primaryImage ? (
                      <Image
                        src={primaryImage}
                        alt={stuff.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#7675b0] truncate">
                      {stuff.title}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {stuff.type.toLowerCase().replace('_', ' ')}
                    </p>
                    {stuff.author && (
                      <p className="text-xs text-gray-600">by {stuff.author}</p>
                    )}
                    {trade.offer.city && (
                      <p className="text-xs text-gray-500 mt-1">
                        {trade.offer.city}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <p>Condition: {stuff.condition}</p>
                  {trade.offer.price && <p>Price: ₹{trade.offer.price}</p>}
                  {trade.offer.offer_type && (
                    <p>Offer Type: {trade.offer.offer_type}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination page={page} count={count} />
    </div>
  );
}