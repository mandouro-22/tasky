import { CreateAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session_middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMembers } from "../utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { Member_Role } from "../types/type";

const members = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await CreateAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({
          status: 403,
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        });
      }

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      return c.json({
        status: 200,
        success: true,
        error: false,
        message: "Get Memebers Successfully",
        data: {
          ...members,
          documents: populatedMembers,
        },
      });
    }
  )

  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const databases = c.get("databases");
    const user = c.get("user");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = await getMembers({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({
        status: 403,
        success: false,
        error: true,
        message: "UnAuthorized",
        data: null,
      });
    }

    if (
      member.$id !== memberToDelete.$id &&
      member.role !== Member_Role.ADMIN
    ) {
      return c.json({
        status: 403,
        success: false,
        error: true,
        message: "UnAuthorized",
        data: null,
      });
    }

    if (allMembersInWorkspace.total === 1) {
      return c.json({
        status: 400,
        success: false,
        error: true,
        message: "Cannot delete the only member",
        data: null,
      });
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({
      status: 200,
      success: true,
      error: false,
      message: "Deleted Member Successfully",
      data: {
        $id: memberToDelete.$id,
      },
    });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(Member_Role) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const databases = c.get("databases");
      const user = c.get("user");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      const allMembersInWorkspace = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      const member = await getMembers({
        databases,
        workspaceId: memberToUpdate.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({
          status: 403,
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        });
      }

      if (member.role !== Member_Role.ADMIN) {
        return c.json({
          status: 403,
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        });
      }

      if (allMembersInWorkspace.total === 1) {
        return c.json({
          status: 400,
          success: false,
          error: true,
          message: "Cannot downgrade the only member",
          data: null,
        });
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({
        status: 200,
        success: true,
        error: false,
        message: "Updated Member Successfully",
        data: {
          $id: memberId,
        },
      });
    }
  );

export default members;
