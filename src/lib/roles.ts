import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Assign a role to a user in a group.
 * @param userId The ID of the user.
 * @param groupId The ID of the group.
 * @param role The role to assign ("GROUP_OWNER", "GROUP_MEMBER", "MODERATOR").
 */
export async function assignGroupRole(userId: string, groupId: string, role: string) {
  const validRoles = ["GROUP_OWNER", "GROUP_MEMBER", "MODERATOR"];

  if (!validRoles.includes(role)) {
    throw new Error(`Invalid role: ${role}. Valid roles are: ${validRoles.join(", ")}`);
  }

  const groupUser = await prisma.groupUser.upsert({
    where: { userId_groupId: { userId, groupId } },
    update: { role },
    create: { userId, groupId, role },
  });

  console.log(`[Roles] Role assigned: ${userId} -> ${role} in group ${groupId}`);
  return groupUser;
}

/**
 * Check if a user has a specific role in a group.
 * @param userId The ID of the user.
 * @param groupId The ID of the group.
 * @param role The role to check for.
 */
export async function checkGroupRole(userId: string, groupId: string, role: string) {
  const groupUser = await prisma.groupUser.findUnique({
    where: { userId_groupId: { userId, groupId } },
  });

  return groupUser?.role === role;
}
