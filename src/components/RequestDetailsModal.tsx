import { auth } from '@clerk/nextjs/server';
import { Request, User, SchoolCollege, Profile } from '@prisma/client';
import Image from 'next/image';
import FormContainer from './FormContainer';

type RequestWithRelations = Request & {
  user: User & {
    profile: Profile | null;
  };
  targetSchoolCollege: SchoolCollege | null;
};

export default async function RequestDetailsModal({
  request,
  onCloseUrl,
}: {
  request: RequestWithRelations;
  onCloseUrl: string;
}) {
  const { userId } = await auth();
  const isCreator = userId === request.user_id;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center gap-4">
          <Image
            src={request.user.profile?.avatar_url || "/avatar.png"}
            alt={request.user.username || request.user.email}
            width={72}
            height={72}
            className="rounded-full object-cover border-4 border-white shadow-lg"
          />
          <div className="flex flex-row justify-between w-full items-center">
            <div className="flex-col">
              <h2 className="text-2xl font-bold text-white mb-3">
                {request.title || "Untitled Request"}
              </h2>
              <p className="text-white/80 text-sm">
                Requested by{" "}
                <span className="font-medium">
                  {request.user.username || request.user.email}
                </span>{" "}
                ({request.user.email})
              </p>
            </div>

            {isCreator && (
              <div className="flex gap-2 mt-2">
                <FormContainer
                  table="request"
                  type="update"
                  data={request}
                  id={request.request_id}
                />
                <FormContainer
                  table="request"
                  type="delete"
                  id={request.request_id}
                />
              </div>
            )}
          </div>
          <a
            href={onCloseUrl}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl"
          >
            ✕
          </a>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700 leading-relaxed">{request.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/stuff.png" alt="" width={25} height={25} />
              <span>
                <strong>Stuff Type:</strong> {request.stuff_type}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/urgency.png" alt="" width={25} height={25} />
              <span>
                <strong>Urgency:</strong> {request.urgency_level}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/status.png" alt="" width={25} height={25} />
              <span>
                <strong>Status:</strong> {request.status}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/college.png" alt="" width={25} height={25} />
              <span>
                <strong>School/College:</strong>{" "}
                {request.targetSchoolCollege?.name || "N/A"}
              </span>
            </div>
            {request.needed_by_date && (
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Image src="/date.png" alt="" width={25} height={25} />
                <span>
                  <strong>Needed By:</strong>{" "}
                  {new Intl.DateTimeFormat("en-US").format(
                    new Date(request.needed_by_date)
                  )}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
              <Image src="/date.png" alt="" width={25} height={25} />
              <span>
                <strong>Created At:</strong>{" "}
                {new Intl.DateTimeFormat("en-US").format(
                  new Date(request.created_at)
                )}
              </span>
            </div>
          </div>

          {/* Budget section */}
          {(request.max_price || request.max_rental_per_day) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-blue-800 mb-2">💰 Budget</h3>
              {request.max_price && (
                <p>
                  <strong>Max Price:</strong> ₹{request.max_price.toString()}
                </p>
              )}
              {request.max_rental_per_day && (
                <p>
                  <strong>Max Rent/Day:</strong>{" "}
                  ₹{request.max_rental_per_day.toString()}
                </p>
              )}
              {request.rental_duration_days && (
                <p>
                  <strong>Rental Duration:</strong>{" "}
                  {request.rental_duration_days} days
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
