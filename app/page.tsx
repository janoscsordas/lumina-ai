import SignOut from "@/components/auth/sign-out";
import { getUserSession } from "@/lib/get-session";

export default async function Home() {
  const session = await getUserSession();

  return (
    <div className="">
      {session && (
        <div>
          <h1>Welcome, {session.user.name}</h1>
          <p>You are logged in as {session.user.email}</p>
          <SignOut />
        </div>
      )}
    </div>
  );
}
