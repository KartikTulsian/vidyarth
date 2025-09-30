import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get("offerId");
    const otherUserId = searchParams.get("otherUserId");

    if (!offerId) {
      return NextResponse.json({ error: "Missing required params" }, { status: 400 });
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

    // Build query conditions
    const whereConditions: Prisma.MessageWhereInput = {
      offer_id: offerId || undefined,
    };

    // if (offerId) {
    //   whereConditions.offer_id = offerId;
    // }

    if (otherUserId) {
      whereConditions.OR = [
        { sender_id: user.user_id, receiver_id: otherUserId },
        { sender_id: otherUserId, receiver_id: user.user_id },
      ];
    } else {
      // This case is for the owner fetching all conversations for an offer
      whereConditions.OR = [
        { sender_id: user.user_id },
        { receiver_id: user.user_id },
      ];
    }

    const messages = await prisma.message.findMany({
      where: whereConditions,
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
        receiver: {
          include: {
            profile: true,
          },
        },
        offer: {
          include: {
            stuff: {
              select: {
                title: true,
                stuff_id: true,
              },
            },
          },
        },
      },
      orderBy: { sent_at: "asc" },
    });

    // Mark messages as read for the current user
    await prisma.message.updateMany({
      where: {
        receiver_id: user.user_id,
        is_read: false,
        ...(offerId && { offer_id: offerId }),
        ...(otherUserId && { sender_id: otherUserId }),
      },
      data: {
        is_read: true,
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { offerId, receiverId, text, subject, trade_request_status } = body;

    if (!receiverId || !text?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    // Verify the receiver exists
    const receiver = await prisma.user.findUnique({
      where: { user_id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    // If offerId is provided, verify the user has permission to message about this offer
    if (offerId) {
      const offer = await prisma.offer.findUnique({
        where: { offer_id: offerId },
        include: { stuff: true },
      });

      if (!offer) {
        return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      }

      // User can message if they're the offer owner or the stuff owner
      const canMessage = offer.user_id === user.user_id ||
        offer.stuff.owner_id === user.user_id ||
        receiverId === offer.user_id ||
        receiverId === offer.stuff.owner_id;

      if (!canMessage) {
        return NextResponse.json({ error: "Not authorized to message about this offer" }, { status: 403 });
      }
    }

    const message = await prisma.message.create({
      data: {
        sender_id: user.user_id,
        receiver_id: receiverId,
        offer_id: offerId || null,
        subject: subject || null,
        text: text.trim(),
        trade_request_status: trade_request_status || null,
      },
      include: {
        sender: {
          include: {
            profile: true,
          },
        },
        receiver: {
          include: {
            profile: true,
          },
        },
        offer: {
          include: {
            stuff: {
              select: {
                title: true,
                stuff_id: true,
              },
            },
          },
        },
      },
    });

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        user_id: receiverId,
        type: "MESSAGE",
        title: "New Message",
        body: `${user.username || 'Someone'} sent you a message`,
        data: {
          messageId: message.message_id,
          senderId: user.user_id,
          offerId: offerId,
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}