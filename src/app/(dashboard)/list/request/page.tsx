import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, RequestStatus, StuffType, UrgencyLevel } from "@prisma/client";
import FormContainer from "@/components/FormContainer";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import RequestDetailsModal from "@/components/RequestDetailsModal";

export default async function RequestListPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const params = await searchParams;
  const { page, requestId, ...queryParams } = params;
  const p = page ? parseInt(page) : 1;

  const query: Prisma.RequestWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "title":
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          case "user_id":
            query.user_id = value;
            break;
          case "stuff_type":
            query.stuff_type = value as StuffType;
            break;
          case "urgency_level":
            query.urgency_level = value as UrgencyLevel;
            break;
          case "status":
            query.status = value as RequestStatus;
            break;
          case "target_school_college_id":
            query.target_school_college_id = value;
            break;
        }
      }
    }
  }

  const [requests, count] = await prisma.$transaction([
    prisma.request.findMany({
      where: query,
      include: {
        user: { include: { profile: true } },
        targetSchoolCollege: true,
      },
      orderBy: { created_at: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.request.count({ where: query }),
  ]);

  const selectedRequest = requestId
    ? await prisma.request.findUnique({
        where: { request_id: requestId },
        include: {
          user: { include: { profile: true } },
          targetSchoolCollege: true,
        },
      })
    : null;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="lg:text-xl text-lg font-semibold">All Requests</h1>
        {/* Example filter/search block */}
        {/* <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
          </div>
        </div> */}
      </div>

      {/* Grid of Requests */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {requests.map((request) => (
          <Link
            key={request.request_id}
            href={`?requestId=${request.request_id}&page=${p}`}
            scroll={false}
          >
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer">
              <div className="mb-2">
                <h2 className="text-lg font-semibold text-[#5e5e85] mb-2">
                  {request.title || "Untitled Request"}
                </h2>
                <p className="text-sm text-gray-500">
                  Requested By: {request.user.profile?.full_name || request.user.email}
                </p>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Type: {request.stuff_type}</p>
                <p>Urgency: {request.urgency_level}</p>
                <p>
                  Date:{" "}
                  {new Intl.DateTimeFormat("en-US").format(
                    new Date(request.created_at)
                  )}
                </p>
                <p>Status: {request.status}</p>
                {request.targetSchoolCollege?.name && (
                  <p>Target College: {request.targetSchoolCollege.name}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={p} count={count} />

      {/* Floating Create Button */}
      <div className="fixed bottom-6 right-5 z-[1000]">
        <div className="h-12 w-12 rounded-full bg-[#FAE27C] text-black flex items-center justify-center shadow-lg hover:bg-blue-500 transition">
          <FormContainer table="request" type="create" />
        </div>
      </div>

      
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onCloseUrl={`/list/request?page=${p}`}
        />
      )}
    </div>
  );
}