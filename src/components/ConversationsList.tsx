"use client";

import { useEffect, useState } from "react";
import { MessageCircle, User, Package, Clock } from "lucide-react";
import ChatModal from "./ChatModal";
import Image from "next/image";

type Conversation = {
  otherUser: {
    user_id: string;
    username?: string;
    profile?: {
      full_name: string;
      display_name?: string;
      avatar_url?: string;
    };
  };
  lastMessage: {
    message_id: string;
    text: string;
    sent_at: string;
    is_read: boolean;
    sender_id: string;
  };
  offer?: {
    offer_id: string;
    stuff: {
      title: string;
      stuff_id: string;
    };
  };
  unreadCount: number;
};

type ConversationsListProps = {
  currentUserId: string;
  onConversationSelect?: (conversation: Conversation) => void;
};

export default function ConversationsList({ 
  currentUserId,
  onConversationSelect 
}: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [currentUserId]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setChatOpen(true);
    onConversationSelect?.(conversation);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getUserDisplayName = (user: Conversation['otherUser']) => {
    return user.profile?.display_name || 
           user.profile?.full_name || 
           user.username || 
           'User';
  };

  const truncateMessage = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No conversations yet</h3>
            <p className="text-center text-gray-500">
              Start messaging other users about items you&apos;re interested in!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <div
                key={`${conversation.otherUser.user_id}-${conversation.offer?.offer_id || 'direct'}`}
                onClick={() => handleConversationClick(conversation)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {conversation.otherUser.profile?.avatar_url ? (
                      <Image
                        width={48}
                        height={48}
                        src={conversation.otherUser.profile.avatar_url}
                        alt={getUserDisplayName(conversation.otherUser)}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 flex items-center justify-center px-1">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium truncate ${
                        conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {getUserDisplayName(conversation.otherUser)}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 ml-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(conversation.lastMessage.sent_at)}
                      </div>
                    </div>
                    
                    {/* Item context */}
                    {conversation.offer && (
                      <div className="flex items-center text-xs text-blue-600 mb-1">
                        <Package className="w-3 h-3 mr-1" />
                        <span className="truncate">{conversation.offer.stuff.title}</span>
                      </div>
                    )}
                    
                    {/* Last message */}
                    <p className={`text-sm truncate ${
                      conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                    }`}>
                      {conversation.lastMessage.sender_id === currentUserId ? 'You: ' : ''}
                      {truncateMessage(conversation.lastMessage.text)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {selectedConversation && (
        <ChatModal
          offerId={selectedConversation.offer?.offer_id}
          otherUserId={selectedConversation.otherUser.user_id}
          otherUserName={getUserDisplayName(selectedConversation.otherUser)}
          otherUserAvatar={selectedConversation.otherUser.profile?.avatar_url}
          currentUserId={currentUserId}
          isOwner={false} // This would need to be determined based on context
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          stuffTitle={selectedConversation.offer?.stuff.title}
        />
      )}
    </div>
  );
}