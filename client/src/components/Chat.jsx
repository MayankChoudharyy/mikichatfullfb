import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io();

const Chat = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    socket.emit('join', { friendId: id });

    socket.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    socket.on('typing', (status) => {
      setTyping(status);
    });

    return () => socket.disconnect();
  }, [id]);

  const sendMsg = () => {
    socket.emit('message', { to: id, msg });
    setMessages(prev => [...prev, { self: true, msg }]);
    setMsg('');
  };

  const handleTyping = () => {
    socket.emit('typing', { to: id });
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((m, i) => (
          <p key={i} className={m.self ? 'self' : 'friend'}>{m.msg}</p>
        ))}
        {typing && <p><em>Typing...</em></p>}
      </div>
      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={handleTyping}
        placeholder="Type a message..."
      />
      <button onClick={sendMsg}>Send</button>
    </div>
  );
};

export default Chat;
