import React, { useState, useEffect } from 'react';
import { CampusRoom } from '../../domain/roomOperations';
import {
  roomCommonsStore,
  RoomMessage,
  RoomCommunicationChannel,
} from '../../services/roomCommonsStore';
import {
  MessageSquare,
  Send,
  Users,
  ShieldAlert,
  Radio,
  Clock,
  User,
} from 'lucide-react';

interface RoomCommunicationProps {
  room: CampusRoom;
  isDark?: boolean;
  activeMemberId?: string;
  activeMemberName?: string;
  actingCapacity?: string;
}

export const RoomCommunication: React.FC<RoomCommunicationProps> = ({
  room,
  isDark = false,
  activeMemberId = 'member-chinedu-captain',
  activeMemberName = 'Chinedu Okeke',
  actingCapacity = 'Room Captain — Room 304',
}) => {
  const [activeChannel, setActiveChannel] =
    useState<RoomCommunicationChannel>('ROOM_MEMBERS');
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    const loadMessages = () => {
      setMessages(roomCommonsStore.getMessages(room.id, activeChannel));
    };

    loadMessages();
    const unsub = roomCommonsStore.subscribe(loadMessages);
    return () => unsub();
  }, [room.id, activeChannel]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    roomCommonsStore.addMessage({
      roomId: room.id,
      channel: activeChannel,
      senderId: activeMemberId,
      senderName: activeMemberName,
      senderCapacity: actingCapacity,
      content: newMessage.trim(),
    });

    setNewMessage('');
  };

  const channels: { id: RoomCommunicationChannel; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'ROOM_MEMBERS',
      label: 'Room Members',
      icon: <Users className="w-3.5 h-3.5" />,
      desc: 'Shared room discussions with fellow occupants',
    },
    {
      id: 'COORDINATOR_DISPATCH',
      label: 'Coordinator Dispatch',
      icon: <Radio className="w-3.5 h-3.5" />,
      desc: 'Direct operational communications with Coordinator',
    },
    {
      id: 'WELFARE_ESCALATION',
      label: 'Welfare & Mediation',
      icon: <ShieldAlert className="w-3.5 h-3.5" />,
      desc: 'Confidential support & living space mediation',
    },
  ];

  return (
    <div id={`room-communication-${room.id}`} className="space-y-6">
      <section
        aria-labelledby="communication-heading"
        className="rounded-2xl p-5 sm:p-7 border-2 border-b-4 transition-all duration-200 shadow-md backdrop-blur-md"
        style={{
          backgroundColor: isDark ? 'rgba(23, 21, 19, 0.55)' : '#FFF0D6',
          borderColor: isDark ? 'rgba(200, 141, 58, 0.35)' : '#CF9F68',
        }}
      >
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b-2 gap-2"
          style={{ borderColor: isDark ? 'rgba(200, 141, 58, 0.20)' : '#CF9F68' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#C46F18] dark:text-[#C88D3A]" />
              <h2
                id="communication-heading"
                className="text-xs sm:text-sm font-semibold uppercase tracking-wider"
                style={{ color: isDark ? '#FFF9EE' : '#432006' }}
              >
                Room Communication &bull; {room.roomNumber}
              </h2>
            </div>
            <p
              className="text-xs mt-0.5"
              style={{ color: isDark ? '#D9C4AC' : '#5A3013' }}
            >
              Audited room channels with explicit sender role attribution.
            </p>
          </div>
        </div>

        {/* Channel Switcher */}
        <div className="flex flex-wrap gap-2 mb-6">
          {channels.map((ch) => {
            const isActive = activeChannel === ch.id;

            return (
              <button
                key={ch.id}
                type="button"
                id={`btn-channel-${ch.id.toLowerCase()}`}
                onClick={() => setActiveChannel(ch.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl border-2 border-b-3 transition-all duration-150 cursor-pointer flex items-center gap-2 active:translate-y-[1px] ${
                  isActive
                    ? isDark
                      ? 'bg-[#C88D3A] text-[#241104] border-[#915B15]'
                      : 'bg-[#432006] text-[#FFF0D6] border-[#381B07]'
                    : isDark
                    ? 'bg-[rgba(30,27,24,0.5)] text-[#D9C4AC] border-[rgba(200,141,58,0.2)] hover:border-[rgba(200,141,58,0.4)]'
                    : 'bg-[#FAE5C5] text-[#5A3013] border-[#CF9F68] hover:border-[#C46F18]'
                }`}
              >
                {ch.icon}
                <span>{ch.label}</span>
              </button>
            );
          })}
        </div>

        {/* Message Stream */}
        <div
          className="p-4 rounded-xl border-2 border-b-3 mb-4 max-h-96 overflow-y-auto space-y-3"
          style={{
            backgroundColor: isDark ? 'rgba(30, 27, 24, 0.40)' : '#FFF8EE',
            borderColor: isDark ? 'rgba(200, 141, 58, 0.25)' : '#CF9F68',
          }}
        >
          {messages.length === 0 ? (
            <div className="py-8 text-center">
              <MessageSquare className="w-8 h-8 mx-auto text-[#C46F18] dark:text-[#C88D3A] mb-2 opacity-60" />
              <p
                className="text-xs"
                style={{ color: isDark ? '#D9C4AC' : '#5A3013' }}
              >
                No messages yet in this channel. Start the conversation below.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === activeMemberId;

              return (
                <div
                  key={msg.id}
                  id={`msg-${msg.id}`}
                  className={`p-3.5 rounded-xl border-2 border-b-3 shadow-xs max-w-xl ${
                    isMine ? 'ml-auto' : 'mr-auto'
                  }`}
                  style={{
                    backgroundColor: isMine
                      ? isDark
                        ? 'rgba(45, 37, 30, 0.70)'
                        : '#FFF0D6'
                      : isDark
                      ? 'rgba(30, 27, 24, 0.60)'
                      : '#FAE5C5',
                    borderColor: isMine
                      ? isDark
                        ? 'rgba(200, 141, 58, 0.40)'
                        : '#C46F18'
                      : isDark
                      ? 'rgba(200, 141, 58, 0.20)'
                      : '#CF9F68',
                  }}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b"
                    style={{ borderColor: isDark ? 'rgba(200, 141, 58, 0.15)' : '#CF9F68' }}
                  >
                    <span
                      className="font-bold text-xs"
                      style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                    >
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] font-mono text-[#C46F18] dark:text-[#C88D3A]">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: isDark ? '#FFF9EE' : '#432006' }}
                  >
                    {msg.content}
                  </p>

                  <div
                    className="mt-2 text-[10px] font-mono"
                    style={{ color: isDark ? '#D9C4AC' : '#5A3013' }}
                  >
                    {msg.senderCapacity}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            id="input-room-message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${channels.find((c) => c.id === activeChannel)?.label}...`}
            className="flex-1 text-xs p-3 rounded-xl border-2 border-b-3 focus:outline-none focus:ring-2 focus:ring-[#C46F18]"
            style={{
              backgroundColor: isDark ? 'rgba(23, 21, 19, 0.8)' : '#FFF8EE',
              borderColor: isDark ? 'rgba(200, 141, 58, 0.3)' : '#CF9F68',
              color: isDark ? '#FFF9EE' : '#432006',
            }}
          />
          <button
            type="submit"
            id="btn-send-message"
            disabled={!newMessage.trim()}
            className={`px-5 py-3 text-xs font-bold rounded-xl border-2 border-b-3 transition-all duration-150 cursor-pointer flex items-center gap-1.5 active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark
                ? 'bg-[#C88D3A] text-[#241104] border-[#915B15]'
                : 'bg-[#432006] text-[#FFF0D6] border-[#381B07]'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </section>
    </div>
  );
};
