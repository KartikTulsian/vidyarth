import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Profile, Stuff } from "@prisma/client";

type Conversation = {
  otherUser: {
    user_id: string;
    username: string | null;
    profile: Profile | null;
  };
  lastMessage: {
    message_id: string;
    text: string;
    sent_at: Date;
    is_read: boolean;
    sender_id: string;
  };
  offer: {
    offer_id: string;
    stuff: Pick<Stuff, "title" | "stuff_id">;
  } | null;
  unreadCount: number;
};

export async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url);
    const offerId = searchParams.get("offerId");

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

    // Get all messages where the current user is either sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { sender_id: user.user_id },
          { receiver_id: user.user_id },
        ],
        ...(offerId && { offer_id: offerId }),
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
      orderBy: { sent_at: "desc" },
    });

    // Group messages by conversation (sender-receiver pairs + offer)
    const conversationMap = new Map<string, Conversation>();

    messages.forEach((message) => {
      const otherUserId = message.sender_id === user.user_id ? message.receiver_id : message.sender_id;
      const otherUser = message.sender_id === user.user_id ? message.receiver : message.sender;

      // Create a unique key for each conversation
      // Include offer_id to separate conversations about different items
      const conversationKey = `${otherUserId}-${message.offer_id || 'direct'}`;

      if (!conversationMap.has(conversationKey)) {
        conversationMap.set(conversationKey, {
          otherUser: {
            user_id: otherUser.user_id,
            username: otherUser.username,
            profile: otherUser.profile,
          },
          lastMessage: {
            message_id: message.message_id,
            text: message.text,
            sent_at: message.sent_at,
            is_read: message.is_read,
            sender_id: message.sender_id,
          },
          offer: message.offer ? {
            offer_id: message.offer.offer_id,
            stuff: message.offer.stuff,
          } : null,
          unreadCount: 0,
        });
      }

      if (message.receiver_id === user.user_id && !message.is_read) {
        conversationMap.get(conversationKey)!.unreadCount++;
      }

    });

    // Convert map to array and sort by last message time
    const conversations = Array.from(conversationMap.values()).sort((a, b) =>
      new Date(b.lastMessage.sent_at).getTime() - new Date(a.lastMessage.sent_at).getTime()
    );

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}