"use client";

import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";

interface Message {
  user: string;
  message: string;
  avatar: string;
  timestamp: string; // Ensure this field is included in the message
}

export const Chatroom = () => {
  const avatarUrls = [
    "https://i.imgur.com/koIi2mu.png",
    "https://i.imgur.com/WnAQfyr.png",
    "https://i.imgur.com/z154J8B.png",
    "https://i.imgur.com/Ok1k8Gi.png",
    "https://i.imgur.com/BK8tOhE.png",
    // Add more URLs as needed
  ];

  const getRandomAvatar = () => {
    return avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
  };

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState(getRandomAvatar());
  const [hasUserName, setHasUserName] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Access localStorage safely
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Chat`);
        const data = await response.json();
        // Sort messages by timestamp
        data.sort((a: Message, b: Message) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
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
      setMessages((messages) => [...messages, { user, message, avatar, timestamp }]);
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
    if (e.key === 'Enter') {
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
        <div
            className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4 overflow-y-auto"
            style={{ height: "calc(100vh - 160px)" }}
        >
          {messages.map((msg, index) => (
              <div
                  key={index}
                  className={`flex ${msg.user === user ? "justify-end" : "justify-start"}`}
              >
                <div
                    className={`flex items-start w-full space-x-4 gap-4 ${msg.user === user ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex-shrink-0 text-center">
                    <img
                        className="h-10 w-10 rounded-full"
                        src={msg.avatar || 'https://i.imgur.com/z154J8B.png'}
                        alt="User avatar"
                    />
                    <span className="text-xs text-gray-500">{msg.user}</span>
                  </div>

                  <div
                      className={`p-3 max-w-full rounded-lg ${msg.user === user ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
                  >
                    <p>{msg.message}</p>
                  </div>
                </div>
              </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="fixed bottom-0 left-0 w-full bg-white p-4">
          {hasUserName ? (
              <div className="flex space-x-4">
                <input
                    className="flex-1 px-4 py-2 border rounded-lg text-gray-600"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your message"
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    onClick={sendMessage}
                >
                  Send
                </button>
              </div>
          ) : (
              <div className="flex space-x-4">
                <input
                    className="flex-1 px-4 py-2 border rounded-lg text-gray-600"
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Enter your name"
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    type="button"
                    onClick={setUsername}
                >
                  Set Name
                </button>
              </div>
          )}
        </div>
      </div>
  );
};
