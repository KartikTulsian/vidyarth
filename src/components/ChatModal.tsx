"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, Send, MessageCircle, Package, User, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

type UserInfo = {
  user_id: string;
  username?: string;
  profile?: {
    full_name: string;
    display_name?: string;
    avatar_url?: string;
  };
};

// Type for Offer information needed in Message
type OfferInfo = {
  offer_id: string;
  stuff: {
    title: string;
    stuff_id: string;
  };
};


type Message = {
  message_id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  subject?: string;
  sent_at: string;
  is_read: boolean;
  trade_request_status?: string;
  // sender: {
  //   user_id: string;
  //   username?: string;
  //   profile?: {
  //     full_name: string;
  //     display_name?: string;
  //     avatar_url?: string;
  //   };
  // };
  sender: UserInfo;
  receiver: UserInfo;
  offer?: OfferInfo;
  // receiver: {
  //   user_id: string;
  //   username?: string;
  //   profile?: {
  //     full_name: string;
  //     display_name?: string;
  //     avatar_url?: string;
  //   };
  // };
  // offer?: {
  //   offer_id: string;
  //   stuff: {
  //     title: string;
  //     stuff_id: string;
  //   };
  // };
};

type ChatModalProps = {
  offerId?: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar?: string;
  currentUserId: string;
  isOwner: boolean;
  open: boolean;
  onClose: () => void;
  stuffTitle?: string;
};

type Conversation = {
  // otherUser: {
  //   user_id: string;
  //   username?: string;
  //   profile?: {
  //     full_name: string;
  //     display_name?: string;
  //     avatar_url?: string;
  //   };
  // };
  otherUser: UserInfo;
  lastMessage?: Message;
  unreadCount: number;
};


export default function ChatModal({
  offerId,
  otherUserId,
  otherUserName,
  otherUserAvatar,
  currentUserId,
  isOwner,
  open,
  onClose,
  stuffTitle,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");

  const [conversationsWithBuyers, setConversationsWithBuyers] = useState<Conversation[]>([]);
  const [selectedBuyerId, setSelectedBuyerId] = useState<string | null>(null);

  // 💡 NEW: State to control the visibility of the TradeForm modal
  // const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect(() => {
  //   if (open) {
  //     if (isOwner) {
  //       fetchOwnerConversations();
  //     } else {
  //       fetchMessages(otherUserId);
  //     }
  //   }
  // }, [open, isOwner, otherUserId, offerId, fetchMessages, fetchOwnerConversations]);

  // useEffect(() => {
  //   if (selectedBuyerId) {
  //     fetchMessages(selectedBuyerId);
  //   }
  // }, [selectedBuyerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOwnerConversations = useCallback(async () => {
    setFetchingMessages(true);
    setError("");
    try {
      const response = await fetch(`/api/conversations?offerId=${offerId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch conversations");
      }
      const data: Conversation[] = await response.json();
      setConversationsWithBuyers(data);
      if (data.length > 0 && !selectedBuyerId) {
        setSelectedBuyerId(data[0].otherUser.user_id);
      }
    } catch (err) {
      console.error("Error fetching owner conversations:", err);
      setError("Failed to load conversations. Please try again.");
    } finally {
      setFetchingMessages(false);
    }
  }, [offerId, selectedBuyerId]);

  const fetchMessages = useCallback(async (targetUserId: string) => {
    setFetchingMessages(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (offerId) params.append("offerId", offerId);
      params.append("otherUserId", targetUserId);

      const response = await fetch(`/api/messages?${params}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setFetchingMessages(false);
    }
  }, [offerId]);

  useEffect(() => {
    if (open) {
      if (isOwner) {
        fetchOwnerConversations();
      } else {
        fetchMessages(otherUserId);
      }
    }
  }, [open, isOwner, otherUserId, offerId, fetchMessages, fetchOwnerConversations]);

  useEffect(() => {
    if (selectedBuyerId) {
      fetchMessages(selectedBuyerId);
    }
  }, [selectedBuyerId, fetchMessages]);


  const handleSend = async () => {
    if (!newMessage.trim() || loading) return;
    setLoading(true);
    setError("");

    const receiverId = isOwner ? selectedBuyerId : otherUserId;
    if (!receiverId) {
      setError("Please select a user to message.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offerId || null,
          receiverId: receiverId,
          text: newMessage.trim(),
          subject: stuffTitle ? `Regarding: ${stuffTitle}` : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      const newMsg = await response.json();
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");

      if (isOwner) {
        fetchOwnerConversations();
      }

    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }
  };

  const getUserDisplayName = (user?: UserInfo) => {
    if (!user) return 'User';
    return user.profile?.display_name ||
      user.profile?.full_name ||
      user.username ||
      'User';
  };

  const handleCreateTrade = async () => {
    if (!isOwner || !selectedBuyerId) {
      toast.error("Please select a user to create a trade");
      return;
    }

    try {
      const response = await fetch("/api/messages", { // 💡 Call the POST messages API
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId: offerId || null,
          receiverId: selectedBuyerId,
          text: "Trade request initiated!", // 💡 The message text
          subject: stuffTitle ? `Regarding: ${stuffTitle}` : null,
          trade_request_status: "INITIATED", // 💡 The new field
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create trade request message");
      }

      const newMsg = await response.json();
      setMessages(prev => [...prev, newMsg]);
      toast.success("Trade request initiated!");
      // You could also refresh all conversations here if needed:
      fetchOwnerConversations();
    } catch (err) {
      console.error("Error creating trade message:", err);
      toast.error("Failed to create trade request");
    }
  };

  if (!open) return null;


  const currentConversation = conversationsWithBuyers.find(c => c.otherUser.user_id === selectedBuyerId);
  const displayUser = isOwner ? currentConversation?.otherUser : { user_id: otherUserId, profile: { avatar_url: otherUserAvatar, full_name: otherUserName } };
  const displayUserName = getUserDisplayName(displayUser);
  const displayUserAvatar = displayUser?.profile?.avatar_url;
  // const isSelectedConversationActive = isOwner ? !!selectedBuyerId : true;

  // // 💡 NEW: Construct the data object for the TradeForm
  // const tradeFormData = {
  //   offer_id: offerId,
  //   borrower_id: selectedBuyerId,
  //   lender_id: currentUserId,
  //   // Add other fields from the offer as needed, e.g., agreed_price, security_deposit etc.
  // };

  // const relatedData = { stuffTitle };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className={`bg-white rounded-2xl shadow-2xl w-full h-[80vh] flex overflow-hidden ${isOwner ? 'max-w-4xl' : 'max-w-lg'}`}>

          {isOwner && (
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-lg">Conversations</h3>
                <p className="text-sm text-gray-500">{stuffTitle}</p>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {conversationsWithBuyers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">Loading conversations...</div>
                ) : conversationsWithBuyers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                    <p className="text-sm">No one has messaged you about this item yet.</p>
                  </div>
                ) : (
                  conversationsWithBuyers.map(conv => (
                    <div
                      key={conv.otherUser.user_id}
                      onClick={() => setSelectedBuyerId(conv.otherUser.user_id)}
                      className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${selectedBuyerId === conv.otherUser.user_id ? 'bg-gray-100' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {conv.otherUser.profile?.avatar_url ? (
                            <Image width={50} height={50} src={conv.otherUser.profile.avatar_url} alt={getUserDisplayName(conv.otherUser)} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                          {conv.unreadCount > 0 && (
                            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{getUserDisplayName(conv.otherUser)}</h4>
                          <p className="text-sm text-gray-500 truncate">{conv.lastMessage?.text ?? "No messages yet"}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className={`flex-1 flex flex-col ${isOwner ? 'w-2/3' : 'w-full'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {displayUserAvatar ? (
                    <Image
                      width={40}
                      height={40}
                      src={displayUserAvatar}
                      alt={displayUserName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{displayUserName}</h2>
                  {stuffTitle && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {stuffTitle}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {fetchingMessages ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : isOwner && !selectedBuyerId ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Select a conversation from the left sidebar to view messages.</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isCurrentUser = msg.sender_id === currentUserId;
                  const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id;

                  return (
                    <div
                      key={msg.message_id}
                      className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && (
                        <div className="flex-shrink-0">
                          {showAvatar ? (
                            displayUserAvatar ? (
                              <Image
                                width={32}
                                height={32}
                                src={displayUserAvatar}
                                alt={displayUserName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                            )
                          ) : (
                            <div className="w-8 h-8" />
                          )}
                        </div>
                      )}

                      <div className={`max-w-[75%] ${isCurrentUser ? 'order-first' : ''}`}>
                        {msg.subject && (
                          <p className="text-xs text-gray-500 mb-1 px-2">
                            {msg.subject}
                          </p>
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${isCurrentUser
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            : 'bg-white text-gray-800 shadow-sm'
                            }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 px-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatTime(msg.sent_at)}
                          </span>
                          {isCurrentUser && msg.is_read && (
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Trade Button (for lenders only) */}
            {isOwner && selectedBuyerId && (
              <div className="px-4 py-2 border-b border-gray-200 bg-yellow-50">
                <button
                  onClick={handleCreateTrade}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-xl font-medium hover:from-green-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Create Trade Request
                </button>
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {error && (
                <p className="text-red-500 text-sm mb-2">{error}</p>
              )}
              <div className="flex gap-2">
                <textarea
                  className="flex-1 border border-gray-300 rounded-xl px-3 py-2 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                  style={{
                    minHeight: '40px',
                    maxHeight: '120px',
                    height: `${Math.min(120, Math.max(40, newMessage.split('\n').length * 20))}px`,
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !newMessage.trim() || (isOwner && !selectedBuyerId)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}