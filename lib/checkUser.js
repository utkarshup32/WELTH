// lib/checkUser.js
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma"; // Corrected import path for your Prisma client

export const checkUser = async () => {
  console.log("checkUser: Attempting to get current user...");
  const user = await currentUser(); // This is the line the error points to
  console.log("checkUser: currentUser() result:", user); // Log the result of currentUser()

  if (!user) {
    console.log("checkUser: User is not authenticated or currentUser() returned null.");
    // If no user, it means they are not logged in via Clerk.
    // You might want to redirect them to a sign-in page here,
    // or let the calling component handle the null return.
    return null;
  }

  console.log("checkUser: User authenticated, Clerk ID:", user.id);

  try {
    // Attempt to find the user in your database using their Clerk ID
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    console.log("checkUser: DB lookup result for loggedInUser:", loggedInUser);

    if (loggedInUser) {
      // If user found in your database, return their record
      return loggedInUser;
    }

    // If user is authenticated via Clerk but not found in your database, create a new record
    console.log("checkUser: User not found in DB, creating new record...");
    // Ensure firstName and lastName are handled gracefully if they are null/undefined
    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        // Use the combined name or fall back to email if name is empty
        name: name || user.emailAddresses[0]?.emailAddress || `User ${user.id}`,
        imageUrl: user.imageUrl,
        // Ensure emailAddress exists before accessing it
        email: user.emailAddresses[0]?.emailAddress,
      },
    });
    console.log("checkUser: Created new DB user:", newUser);
    return newUser;
  } catch (error) {
    // Log any errors that occur during database operations or user creation
    console.error("checkUser: Error during DB operations or user creation:", error);
    // Re-throw the error to propagate it up the call stack for proper handling
    throw error;
  }
};
