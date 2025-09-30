import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { currentUser } from '@clerk/nextjs/server';
import { ItemCondition, OfferType, Prisma, StuffType } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function MyContributionpage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {

  const sp = await searchParams;

  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error('Not authenticated');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: clerkUser.emailAddresses[0].emailAddress },
    include: {
      offers: {
        include: { stuff: true },
      },
    }
  })

  if (!dbUser) {
    throw new Error('User record not found in database');
  }

  const page = sp.page ? parseInt(sp.page) : 1;
  const search = sp.search ?? '';

  const query: Prisma.OfferWhereInput = { user_id: dbUser.user_id };

  if (search) {
    query.OR = [
      { city: { contains: search, mode: 'insensitive' } },
      { stuff: { title: { contains: search, mode: 'insensitive' } } },
      { stuff: { type: search.toUpperCase() as StuffType } },
      { stuff: { condition: search.toUpperCase() as ItemCondition } },
      { offer_type: search.toUpperCase() as OfferType },
    ];
  }

  const [offers, count] = await prisma.$transaction([
    prisma.offer.findMany({
      where: query,
      include: {
        stuff: {
          include: { images: true } // <-- include images!
        }
      },
      orderBy: { availability_end: 'asc' },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    }),
    prisma.offer.count({
      where: query,
    }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="lg:text-xl text-lg font-semibold">My Contributions</h1>
      </div>

      {offers.length === 0 ? (
        <p className="text-gray-500 mt-6">No offers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {offers.map((offer) => (
            <div
              key={offer.offer_id}
              className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {offer.stuff.images.find(img => img.is_primary)?.url ? (
                    <Image
                      src={offer.stuff.images.find(img => img.is_primary)?.url || ''}
                      alt={offer.stuff.title}
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
                  <div className="flex flex-row justify-between">
                    <Link
                      href={`/list/my-contribution/${offer.stuff.stuff_id}`}
                      className='hover:underline'
                    >
                      <h3 className="text-lg font-semibold text-[#7675b0] truncate">{offer.stuff.title}</h3>
                    </Link>
                    <div className="flex gap-2">
                      <FormContainer
                        table="stuffOffer"
                        type="update"
                        data={{ stuff: offer.stuff, offer: offer }} // Pass nested data
                        id={offer.offer_id} // Use the offer_id
                      />
                      <FormContainer
                        table="stuffOffer"
                        type="delete"
                        id={offer.stuff.stuff_id} // Pass the stuff_id for deletion
                      />
                    </div>
                  </div>
                  <div className=''>
                    <p className="text-xs text-gray-500 capitalize">
                      {offer.stuff.type.toLowerCase().replace('_', ' ')}
                    </p>
                    {offer.stuff.author && <p className="text-xs text-gray-600">by {offer.stuff.author}</p>}
                    {offer.city && <p className="text-xs text-gray-500 mt-1">{offer.city}</p>}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p>Condition: {offer.stuff.condition}</p>
                {offer.price && <p>Price: ₹{offer.price}</p>}
                {offer.offer_type && <p>Offer Type: {offer.offer_type}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination page={page} count={count} />
    </div>
  );
}