// app/redirect/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.publicMetadata.role === "admin") {
    redirect("/admin");
  }

  redirect("/");
}
