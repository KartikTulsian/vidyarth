import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: clerkUser.emailAddresses[0].emailAddress },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const whereClause: Prisma.NotificationWhereInput = {
      user_id: user.user_id,
    };

    if (unreadOnly) {
      whereClause.is_read = false;
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
      take: limit,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { notificationIds, markAsRead } = body;

    if (!Array.isArray(notificationIds)) {
      return NextResponse.json({ error: "notificationIds must be an array" }, { status: 400 });
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: clerkUser.emailAddresses[0].emailAddress },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update notifications
    const result = await prisma.notification.updateMany({
      where: {
        notification_id: {
          in: notificationIds,
        },
        user_id: user.user_id, // Ensure user can only update their own notifications
      },
      data: {
        is_read: markAsRead === true,
      },
    });

    return NextResponse.json({ updated: result.count });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Mark all notifications as read
export async function PUT() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: clerkUser.emailAddresses[0].emailAddress },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await prisma.notification.updateMany({
      where: {
        user_id: user.user_id,
        is_read: false,
      },
      data: {
        is_read: true,
      },
    });

    return NextResponse.json({ updated: result.count });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}