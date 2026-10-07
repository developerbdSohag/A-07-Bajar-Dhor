import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UpdateProfileClient from "./UpdateProfileClient";

export const dynamic = "force-dynamic";

export default async function UpdateProfilePage() {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session?.user) {
    redirect("/signin?callbackURL=/profile/update&protected=1");
  }

  return <UpdateProfileClient user={session.user} />;
}
