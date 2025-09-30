import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Prisma, ReminderType } from "@prisma/client";
import FormContainer from "@/components/FormContainer";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import ReminderModalServer from "@/components/ReminderModalServer";
import { currentUser } from "@clerk/nextjs/server";

export default async function ReminderListPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const params = await searchParams;
    const { page, reminderId, ...queryParams } = params;
    const p = page ? parseInt(page) : 1;

    const clerkUser = await currentUser();
    if (!clerkUser) {
        throw new Error('Not authenticated');
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: clerkUser.emailAddresses[0].emailAddress },
        include: {
            reminders: true,
        },
    });

    if (!dbUser) {
        throw new Error('User record not found in database');
    }

    const query: Prisma.ReminderWhereInput = {
        user_id: dbUser.user_id, // 👈 restrict to this user only
    };

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "title":
                    case "search":
                        query.title = { contains: value, mode: "insensitive" };
                        break;
                    case "type":
                        query.type = value as ReminderType;
                        break;
                }
            }
        }
    }

    const [reminders, count] = await prisma.$transaction([
        prisma.reminder.findMany({
            where: query,
            include: {
                user: { include: { profile: true } },
            },
            orderBy: { created_at: "desc" },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.reminder.count({ where: query }),
    ]);

    const selectedReminder = reminderId
        ? await prisma.reminder.findUnique({
            where: { reminder_id: reminderId },
            include: {
                user: { include: { profile: true } },
            },
        })
        : null;

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="lg:text-xl text-lg font-semibold">All Reminders</h1>
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
                {reminders.map((reminder) => (
                    <Link
                        key={reminder.reminder_id}
                        href={`?reminderId=${reminder.reminder_id}&page=${p}`}
                        scroll={false}
                    >
                        <div className="bg-slate-50 border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition cursor-pointer">
                            <div className="mb-2">
                                <h2 className="text-lg font-semibold text-[#5e5e85] mb-2">
                                    {reminder.title || "Untitled Reminder"}
                                </h2>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p>Type: {reminder.type}</p>
                                <p>
                                    Due Date:{" "}
                                    {new Intl.DateTimeFormat("en-US").format(
                                        new Date(reminder.due_date)
                                    )}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <Pagination page={p} count={count} />

            {/* Floating Create Button */}
            <div className="fixed bottom-6 right-5 z-[1000]">
                <div className="h-12 w-12 rounded-full bg-[#FAE27C] text-black flex items-center justify-center shadow-lg hover:bg-blue-500 transition">
                    <FormContainer table="reminder" type="create" />
                </div>
            </div>


            {selectedReminder && (
                <ReminderModalServer
                    reminder={selectedReminder}
                    onCloseUrl={`/list/reminders?page=${p}`}
                />
            )}
        </div>
    );
}