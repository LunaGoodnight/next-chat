"use client";

import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { ChatMessageList } from './ChatMessageList';
import { ChatInputSection } from './ChatInputSection';
import { Header } from './Header';
import { UserSettingsModal } from './UserSettingsModal';
import { Message } from './types';
import { avatarUrls } from '@/app/avatarUrls';

export const Chatroom: React.FC = () => {
  const getRandomAvatar = () => {
    return avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
  };

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  const [avatar, setAvatar] = useState(getRandomAvatar());
  const [hasUserName, setHasUserName] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('username');
      const storedAvatar = localStorage.getItem('avatar');
      if (storedUser) setUser(storedUser);
      if (storedAvatar) setAvatar(storedAvatar);
      setHasUserName(!!storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/Chat`,
        );
        const data = await response.json();
        data.sort(
            (a: Message, b: Message) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchMessages();

    const connect = new signalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`, {
          transport: signalR.HttpTransportType.WebSockets,
          skipNegotiation: true,
        })
        .withAutomaticReconnect()
        .build();

    setConnection(connect);

    connect
        .start()
        .then(() => console.log('Connected to SignalR'))
        .catch((err) => console.error('Error connecting to SignalR:', err));

    connect.on('ReceiveMessage', (user, message, avatar, timestamp) => {
      setMessages((messages) => [
        ...messages,
        { user, message, avatar, timestamp },
      ]);
      scrollToBottom();
    });

    return () => {
      connect.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (connection && message !== '') {
      try {
        await connection.invoke('SendMessage', user, message, avatar);
        setMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const setUsername = () => {
    if (user.length) {
      localStorage.setItem('username', user);
      localStorage.setItem('avatar', avatar);
      setHasUserName(true);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
      <div className="h-full bg-gray-100 flex flex-col items-center max-h-screen">
        <Header onSettingsClick={() => setIsModalOpen(true)} />
        <ChatMessageList messages={messages} currentUser={user} messagesEndRef={messagesEndRef} />
        <ChatInputSection
            hasUserName={hasUserName}
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            handleKeyPress={handleKeyPress}
            user={user}
            setUser={setUser}
            setUsername={setUsername}
        />
        <UserSettingsModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            user={user}
            setUser={setUser}
            avatar={avatar}
            setAvatar={setAvatar}
            saveSettings={setUsername}
        />
      </div>
  );
};
