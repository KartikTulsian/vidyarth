import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import EventCalendarClient from "./EventCalendarClient";
import FormContainer from "./FormContainer";

// Utility: Format date nicely
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

// function truncateDescription(text: string, wordLimit: number = 25) {
//   const words = text.split(" ");
//   if (words.length <= wordLimit) return text;
//   return words.slice(0, wordLimit).join(" ") + " ...";
// }

export default async function EventCalendar() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Not authenticated");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("User email not found");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: {
      user_id: true,
      reminders: { select: { reminder_id: true } },
    },
  });

  if (!dbUser) return <div>User not found</div>;

  const remindersIds = dbUser.reminders.map((p) => p.reminder_id);

  const reminders = await prisma.reminder.findMany({
    take: 5,
    orderBy: { due_date: "desc" },
    where: {
      due_date: { gte: new Date() },
      reminder_id: { in: remindersIds },
    },
  });

  // const selectedReminder = searchParams?.reminderId
  //   ? await prisma.reminder.findUnique({
  //       where: { reminder_id: searchParams.reminderId },
  //       include: { user: true }, // get user details if needed
  //     })
  //   : null;

  return (
    <div className="bg-white p-4 rounded-md flex flex-col gap-6">
      {/* Calendar (client component) */}
      <EventCalendarClient />

      {/* Created Events */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold my-3">Reminders</h1>
          {/* <Link href="/list/events">
            <span className="text-xs hover:underline cursor-pointer">View All</span>
          </Link> */}
          <FormContainer table="reminder" type="create"/>
        </div>
        {reminders.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming created events.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reminders.map((reminder, idx) => (
              <Link
                key={reminder.reminder_id}
                href= {`/list/reminders?reminderId=${reminder.reminder_id}`}
                className={`rounded-md p-4 block ${idx === 0
                ? 'bg-[#e3f8ff]'
                : idx === 1
                  ? 'bg-[#e0defa]'
                  : 'bg-[#fcf8da]'
              }`}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-gray-700">{reminder.title}</h1>
                  <span className="text-gray-400 text-xs">Due Date: {formatDate(reminder.due_date)}</span>
                  
                </div>
                <p className="mt-1 text-gray-500 text-sm">{reminder.message}</p>

              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
