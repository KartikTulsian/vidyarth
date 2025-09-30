"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import ChatModal from "./ChatModal";

type MessageButtonProps = {
  offerId?: string;
  stuffOwnerId: string;
  stuffOwnerName: string;
  stuffOwnerAvatar?: string;
  currentUserId: string;
  stuffTitle: string;
  isOwner: boolean;
};

export default function ChatButton({
  offerId,
  stuffOwnerId,
  stuffOwnerName,
  stuffOwnerAvatar,
  currentUserId,
  stuffTitle,
  isOwner,
}: MessageButtonProps) {
  const [chatOpen, setChatOpen] = useState(false);

  // Don't show message button if user is trying to message themselves
  // if (currentUserId === stuffOwnerId) {
  //   return null;
  // }

  return (
    <>
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setChatOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
          {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-ping">
            !
          </span> */}
        </button>
        
        {/* Tooltip */}
        <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Message {stuffOwnerName}
            <div className="absolute -top-1 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"></div>
          </div>
        </div>
      </div>

      <ChatModal
        offerId={offerId}
        otherUserId={stuffOwnerId}
        otherUserName={stuffOwnerName}
        otherUserAvatar={stuffOwnerAvatar}
        currentUserId={currentUserId}
        isOwner={isOwner}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        stuffTitle={stuffTitle}
      />
    </>
  );
}