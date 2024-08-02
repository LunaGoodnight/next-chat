"use client";

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface Message {
  user: string;
  message: string;
}

export const Chatroom = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(localStorage.getItem("username") || "");
  const [hasUserName, setHasUserName] = useState<boolean>(!!user);

  useEffect(() => {
    // Fetch chat history
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Chat`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchMessages();

    const connect = new signalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`)
        .withAutomaticReconnect()
        .build();

    setConnection(connect);

    connect
        .start()
        .then(() => console.log("Connected to SignalR"))
        .catch((err) => console.error("Error connecting to SignalR:", err));

    connect.on("ReceiveMessage", (user, message) => {
      setMessages((messages) => [...messages, { user, message }]);
    });

    return () => {
      connect.stop();
    };
  }, []);

  const sendMessage = async () => {
    if (connection) {
      try {
        await connection.invoke("SendMessage", user, message);
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
      setHasUserName(true);
    }
  };

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-600">Chat Room</h2>
        <div
            className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4 overflow-y-hidden"
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
                        src="https://via.placeholder.com/40"
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
