import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import EventCalendar from "@/components/EventCalendar";
import Image from "next/image";
import ActivityChart from "@/components/ActivityChart";
import { redirect } from "next/navigation";
import FormContainer from "@/components/FormContainer";

export default async function AdminPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) redirect("/sign-in");

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { email },
    include: {
      profile: {
        include: {
          schoolCollege: true,
        },
      },
      offers: true,
      stuff: true,
      requests: true,
      tradesAsBorrower: true,
      tradesAsLender: true,
      reviewsWritten: true,
      reviewsReceived: true,
      reminders: true,
      activities: true,
      sentMessages: true,
      receivedMessages: true,
      notifications: true,
      favorites: true,
    },
  });

  // Show profile creation form if no DB user
  if (!dbUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Welcome 🎉
          </h2>
          <p className="text-gray-600 text-center mt-2 mb-8">
            Let’s set up your profile to unlock your Admin Dashboard.
          </p>

          <div className="flex justify-end mt-6">
            <div className="h-12 w-47 rounded-2xl bg-[#FAE27C] text-black flex items-center justify-center gap-2 shadow-lg cursor-pointer">
              <FormContainer table="user" type="create" data={{ email }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profile = dbUser.profile;

  return (
    <div className="p-4 flex gap-6 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3 flex flex-col gap-8">
        <div className="bg-[#C3EBFA] p-6 rounded-lg shadow-md flex flex-col lg:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src={profile?.avatar_url || "/avatar.png"}
              alt="profile_pic"
              width={144}
              height={144}
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-white shadow-sm"
            />
          </div>

          {/* User Details */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center lg:text-left">
                {profile?.full_name || dbUser.username || "User"}
              </h1>
              <p className="text-sm text-gray-600 mt-1 text-center lg:text-left">
                {profile?.bio || "No bio available"}
              </p>
            </div>

            {/* Info Grid */}
            <h3 className="text-orange-600 text-sm font-semibold">
              Personal Info :
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-medium">
              {profile?.schoolCollege?.name && (
                <div className="flex items-center gap-2">
                  <Image src="/college.png" alt="" width={25} height={25} />
                  <span className="text-gray-800">{profile.schoolCollege.name}</span>
                </div>
              )}
              {profile?.course && (
                <div className="flex items-center gap-2">
                  <Image src="/course.png" alt="" width={25} height={25} />
                  <span className="text-gray-800">
                    {profile.course} ({profile.class_year || "Year N/A"})
                  </span>
                </div>
              )}
              {dbUser.email && (
                <div className="flex items-center gap-2 break-all">
                  <Image src="/mail.png" alt="" width={18} height={18} />
                  <span className="text-gray-800">{dbUser.email}</span>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={18} height={18} />
                  <span className="text-gray-800">{profile.phone}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <h3 className="text-orange-600 text-sm font-semibold">Your Stats :</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { img: "/offer.png", count: dbUser.offers.length, label: "Offers Created" },
                { img: "/stuff.png", count: dbUser.stuff.length, label: "Stuff Added" },
                { img: "/request.png", count: dbUser.requests.length, label: "Requests Made" },
                { img: "/trade.png", count: dbUser.tradesAsBorrower.length + dbUser.tradesAsLender.length, label: "Trades" },
                { img: "/review.png", count: dbUser.reviewsWritten.length, label: "Reviews Written" },
                { img: "/activity.png", count: dbUser.activities.length, label: "Activities" },
              ].map((stat, i) => (
                <div key={i} className="bg-indigo-50 p-4 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
                  <Image src={stat.img} alt="" width={25} height={25} />
                  <span className="text-lg font-bold text-gray-900">{stat.count}</span>
                  <span className="text-xs text-gray-600">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full h-[500px]">
          <ActivityChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />

        <div className="fixed bottom-6 right-5 z-[1000]">
          <div className="h-12 w-47 rounded-2xl bg-[#8286ff] text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer">
            <FormContainer table="user" type="update" data={{ user: dbUser, profile: dbUser.profile }} id={dbUser.user_id} />
          </div>
        </div>
      </div>
    </div>
  );
}
