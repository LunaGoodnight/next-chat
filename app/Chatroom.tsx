"use client";
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { ChatMessageList } from "./components/ChatMessageList";
import { ChatInputSection } from "./components/ChatInputSection";
import { Header } from "./components/Header";
import { UserSettingsModal } from "./components/UserSettingsModal";
import { Message } from "./utils/types";
import { avatarUrls } from "@/app/utils/avatarUrls";
import { allImagesLoaded } from "@/app/utils/allImagesLoaded";

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-gray-400"></div>
    </div>
);

export const Chatroom: React.FC = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const sendLock = useRef<boolean>(false); // Lock to prevent multiple sends
  const chatListRef = useRef<HTMLDivElement | null>(null);

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

    connect.on(
        "ReceiveMessage",
        (user, message, avatar, timestamp, timeString, imageUrl) => {
          setMessages((messages) => [
            ...messages,
            { user, message, avatar, timestamp, timeString, imageUrl },
          ]);
          scrollToBottom();
        },
    );

    return () => {
      connect.stop();
    };
  }, []);

  const sendMessage = async (image?: File) => {
    if (sendLock.current) return; // Check if the lock is active

    if (connection) {
      if (message !== "" || image !== null) {
        sendLock.current = true; // Activate the lock

        try {
          let imageUrl = "";
          if (image) {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("file", image);

            const uploadResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/Upload`,
                {
                  method: "POST",
                  body: formData,
                },
            );

            const uploadData = await uploadResponse.json();

            imageUrl = uploadData.url;
          }

          await connection.invoke(
              "SendMessage",
              user,
              message,
              avatar,
              imageUrl,
          );
          setMessage("");

        } catch (err) {
          console.error("Error sending message:", err);
        } finally {
          sendLock.current = false; // Release the lock
          setIsLoading(false);
        }
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
    if (messagesEndRef.current && chatListRef.current) {
      allImagesLoaded(chatListRef.current)
          .then(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          })
          .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
      <div className="flex flex-col min-h-screen max-h-screen w-full h-full">
        {isLoading && <LoadingSpinner />}
        <Header onSettingsClick={() => setIsModalOpen(true)} />
        <ChatMessageList
            chatListRef={chatListRef}
            messages={messages}
            currentUser={user}
            messagesEndRef={messagesEndRef}
        />
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
