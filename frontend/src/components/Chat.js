import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Search } from 'lucide-react';

function Chat() {
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost/ws/chat/me`); // Simulated user id 'me'
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChat(prev => [...prev, data]);
    };
    setSocket(ws);
    return () => ws.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim() || !receiverId) return;

    const data = { receiver_id: receiverId, content: message };
    socket.send(JSON.stringify(data));
    setChat(prev => [...prev, { sender_id: 'me', content: message }]);
    setMessage('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Contacts Sidebar */}
      <div className="hidden md:flex flex-col w-80 card bg-white">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search messages..."
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Recent Chats</p>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <User size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">User {i+1}</p>
                <p className="text-xs text-slate-500 truncate">Last message preview...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col card bg-white overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold">
              {receiverId ? receiverId[0].toUpperCase() : '?'}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{receiverId || 'Select a contact'}</h3>
              <p className="text-xs text-green-500 font-medium">Online</p>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50"
        >
          {chat.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Start a conversation by entering a user ID</p>
            </div>
          ) : (
            chat.map((m, i) => (
              <div key={i} className={`flex ${m.sender_id === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${
                  m.sender_id === 'me'
                    ? 'bg-brand-primary text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  <p className="text-sm">{m.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex gap-3">
            <div className="md:hidden flex-1">
              <input
                type="text"
                className="input-field"
                value={receiverId}
                onChange={e => setReceiverId(e.target.value)}
                placeholder="Receiver ID"
              />
            </div>
            <input
              type="text"
              className="flex-1 input-field"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="btn-primary px-4 flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
