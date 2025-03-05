"use server";

import { deleteAccountQuery, getUserById, updateUsersNameQuery } from "@/lib/db/queries";
import { getUserSession } from "@/lib/get-session";
import { revalidatePath } from "next/cache";

export async function changeUserNameAction({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) {
  const session = await getUserSession();

  if (!session) {
    return {
      success: false,
      error: "Not authenticated.",
    };
  }

  try {
    const user = await getUserById({ userId });

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.id !== session.user.id) {
      throw new Error("You are not authorized to change this user's name.");
    }

    if (user.name === name) {
      throw new Error("Name is the same as the current name.");
    }

    await updateUsersNameQuery({ userId, name });
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }

  revalidatePath("/settings");
  return {
    success: true,
    error: null,
  };
}

export async function deleteUserAccount({ userId }: { userId: string }) {
  const session = await getUserSession();

  if (!session) {
    return {
      success: false,
      error: "Not authenticated.",
    };
  }

  try {
    const user = await getUserById({ userId });

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.id !== session.user.id) {
      throw new Error("You are not authorized to delete this user.");
    }

    await deleteAccountQuery({ userId })
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }

  revalidatePath("/");
  return {
    success: true,
    error: null,
  };
}
