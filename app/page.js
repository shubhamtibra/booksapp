"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

revalidatePath("/posts"); // Update cached posts
redirect(`/post/${id}`); // Navigate to the new post page
