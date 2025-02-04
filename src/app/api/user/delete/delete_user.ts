import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Deletes a user from the database.
 * - Requires admin privileges or owner access.
 * @param userId - ID of the user to delete.
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    console.log("[User Deletion] Attempting to delete user:", userId);

    // Ensure user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error(`User with ID ${userId} does not exist.`);
    }

    // Delete user and related accounts
    await prisma.user.delete({
      where: { id: userId },
    });

    console.log("[User Deletion] Successfully deleted user:", userId);
  } catch (error) {
    console.error("[User Deletion] Error deleting user:", error);
    throw error;
  }
}




// User Deletion API
/**
 * Deletes a user from the database.
 * - Requires admin privileges or owner access.
 * @param userId - ID of the user to delete.
 */
// export async function deleteUser(userId: string): Promise<void> {
//     try {
//       console.log("[User Deletion] Attempting to delete user:", userId);
  
//       // Ensure user exists
//       const user = await prisma.user.findUnique({ where: { id: userId } });
//       if (!user) {
//         throw new Error(`User with ID ${userId} does not exist.`);
//       }
  
//       // Delete user and related accounts
//       await prisma.user.delete({
//         where: { id: userId },
//       });
  
//       console.log("[User Deletion] Successfully deleted user:", userId);
//     } catch (error) {
//       console.error("[User Deletion] Error deleting user:", error);
//       throw error;
//     }
//   }