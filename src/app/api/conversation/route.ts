// initializing user-user conversation
// if conversation already exist, return the conversation ID

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// if not, create a new conversation and return the conversation ID
export const POST = async (req: NextRequest) => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      status: 401,
      body: { error: "Unauthorized" },
    });
  }

  const { conversationFrom, conversationTo } =
    (await req.json()) as unknown as {
      conversationFrom: string;
      conversationTo: string;
    };

  // check if conversation already exist
  const conversation = await db.conversation.findFirst({
    where: {
      OR: [
        {
          userOneId: conversationFrom,
          userTwoId: conversationTo,
        },
        {
          userOneId: conversationTo,
          userTwoId: conversationFrom,
        },
      ],
    },

    select: {
      id: true,
    },
  });

  if (conversation) {
    return NextResponse.json({
      conversationId: conversation.id,
    });
  }

  // create new conversation
  const newConversation = await db.conversation.create({
    data: {
      userOneId: conversationFrom,
      userTwoId: conversationTo,
    },

    select: {
      id: true,
    },
  });

  return NextResponse.json({
    conversationId: newConversation.id,
  });
};

export const DELETE = async (req: NextRequest) => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      status: 401,
      body: { error: "Unauthorized" },
    });
  }

  const { conversationId } = (await req.json()) as unknown as {
    conversationId: string;
  };

  // delete all messages
  await db.userMessages.deleteMany({
    where: {
      conversationId,
    },
  });

  // delete the conversation
  await db.conversation.delete({
    where: {
      id: conversationId,
    },
    include: {
      messages: true,
    },
  });

  return NextResponse.json({
    message: "Conversation deleted",
  });
};
