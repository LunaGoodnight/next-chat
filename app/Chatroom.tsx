"use client";

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { UsernameInput } from "./UsernameInput";
import { Message } from "./types";

export const Chatroom = () => {
  const avatarUrls = [
    "https://i.imgur.com/koIi2mu.png",
    "https://i.imgur.com/WnAQfyr.png",
    "https://i.imgur.com/z154J8B.png",
    "https://i.imgur.com/Ok1k8Gi.png",
    "https://i.imgur.com/BK8tOhE.png",
    "https://i.imgur.com/FXgk0y1.png",
    "https://i.imgur.com/lnNQJCS.png",
  ];

  const getRandomAvatar = () => {
    return avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
  };

  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState(getRandomAvatar());
  const [hasUserName, setHasUserName] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("username");
      const storedAvatar = localStorage.getItem("avatar");
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
        console.error("Error fetching chat history:", error);
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
      .then(() => console.log("Connected to SignalR"))
      .catch((err) => console.error("Error connecting to SignalR:", err));

    connect.on("ReceiveMessage", (user, message, avatar, timestamp) => {
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
    if (connection && message !== "") {
      try {
        await connection.invoke("SendMessage", user, message, avatar);
        setMessage("");
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const setUsername = () => {
    if (user.length) {
      localStorage.setItem("username", user);
      localStorage.setItem("avatar", avatar);
      setHasUserName(true);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-600">Chat Room</h2>
      <MessageList
        messages={messages}
        currentUser={user}
        messagesEndRef={messagesEndRef}
      />
      {hasUserName ? (
        <ChatInput
          message={message}
          onMessageChange={(e) => setMessage(e.target.value)}
          onSendMessage={sendMessage}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <UsernameInput
          username={user}
          onUsernameChange={(e) => setUser(e.target.value)}
          onSetUsername={setUsername}
        />
      )}
    </div>
  );
};
