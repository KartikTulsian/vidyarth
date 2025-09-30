
'use client';

import Image from "next/image";
import Link from "next/link";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/admin",
      },
      {
        icon: "/browse.png",
        label: "Browse Vidya",
        href: "/list/browse-vidya",
      },
      {
        icon: "/collection.png",
        label: "My Collection",
        href: "/list/my-collection",
      },
      {
        icon: "/contribute.png",
        label: "My Contribution",
        href: "/list/my-contribution",
      },
      {
        icon: "/lend-sell.png",
        label: "Lend/Sell Offers",
        href: "/list/lend-sell",
      },
      {
        icon: "/requests.png",
        label: "Requests",
        href: "/list/request",
      },
      {
        icon: "/reminder.png",
        label: "Reminders",
        href: "/list/reminders",
      },
    ],
  },
  // {
  //   title: "OTHER",
  //   items: [
  //     {
  //       icon: "/setting.png",
  //       label: "Settings",
  //       href: "/settings",
  //     },
  //     {
  //       icon: "/logout.png",
  //       label: "Logout",
  //       href: "/logout",
  //     },
  //   ],
  // },
];

const Menu = () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>

          {section.items.map((item) => {
            // if (!item.visible.includes(role)) return null;

            // if (item.children) {
            //   // Item has submenu
            //   return (
            //     <div key={item.label}>
            //       <div className="flex items-center gap-4 text-gray-700 font-medium py-2 px-2">
            //         <Image src={item.icon} alt="" width={20} height={20} />
            //         <span className="hidden lg:block">{item.label}</span>
            //       </div>
            //       <div className="ml-10 flex flex-col gap-1 text-gray-500">
            //         {item.children.map((child) => (
            //           <Link
            //             href={child.href}
            //             key={child.label}
            //             className="py-1 px-2 rounded-md hover:bg-lamaSkyLight"
            //           >
            //             {child.label}
            //           </Link>
            //         ))}
            //       </div>
            //     </div>
            //   );
            // }

            // Regular item
            return (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-[#EDF9FD]"
              >
                <Image src={item.icon} alt="" width={20} height={20} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;