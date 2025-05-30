import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session_middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { getMembers } from "../utils";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";
import { Member, Member_Role } from "../types/type";

const members = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json(
          {
            success: false,
            error: true,
            message: "UnAuthorized",
            data: null,
          },
          403
        );
      }

      const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", workspaceId)]
      );

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name || user.email,
            email: user.email,
          };
        })
      );

      return c.json(
        {
          success: true,
          error: false,
          message: "Get Memebers Successfully",
          data: {
            ...members,
            documents: populatedMembers,
          },
        },
        200
      );
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
      return c.json(
        {
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        },
        403
      );
    }

    if (
      member.$id !== memberToDelete.$id &&
      member.role !== Member_Role.ADMIN
    ) {
      return c.json(
        {
          success: false,
          error: true,
          message: "UnAuthorized",
          data: null,
        },
        403
      );
    }

    if (allMembersInWorkspace.total === 1) {
      return c.json(
        {
          success: false,
          error: true,
          message: "Cannot delete the only member",
          data: null,
        },
        400
      );
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json(
      {
        success: true,
        error: false,
        message: "Deleted Member Successfully",
        data: {
          $id: memberToDelete.$id,
        },
      },
      200
    );
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
        return c.json(
          {
            success: false,
            error: true,
            message: "UnAuthorized",
            data: null,
          },
          403
        );
      }

      if (member.role !== Member_Role.ADMIN) {
        return c.json(
          {
            success: false,
            error: true,
            message: "UnAuthorized",
            data: null,
          },
          403
        );
      }

      if (allMembersInWorkspace.total === 1) {
        return c.json(
          {
            success: false,
            error: true,
            message: "Cannot downgrade the only member",
            data: null,
          },
          400
        );
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json(
        {
          success: true,
          error: false,
          message: "Updated Member Successfully",
          data: {
            $id: memberId,
          },
        },
        200
      );
    }
  );

export default members;
