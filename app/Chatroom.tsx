"use client";

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

interface Message {
  user: string;
  message: string;
}

export const Chatroom = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [hasUserName, setHasUserName] = useState<boolean>(false);

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h2>Chat Room</h2>

      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="fixed h-[300] bg-amber-300 w-full bottom-0 left-0">
        {hasUserName ? (
          <div>
            <input
              className="text-amber-900"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        ) : (
          <div>
            <input
              className="text-amber-900"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter your name"
            />
            <button
              type="button"
              onClick={() => {
                if (user.length) {
                  setHasUserName(true);
                }
              }}
            >
              Set Name
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
