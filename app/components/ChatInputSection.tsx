import React from "react";
import { ChatInput } from "./ChatInput";
import { UsernameInput } from "./UsernameInput";

interface ChatInputSectionProps {
  hasUserName: boolean;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (image?: File) => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  setUsername: () => void;
}

export const ChatInputSection: React.FC<ChatInputSectionProps> = ({
  hasUserName,
  message,
  setMessage,
  sendMessage,
  handleKeyPress,
  user,
  setUser,
  setUsername,

}) =>
  hasUserName ? (
    <ChatInput
      message={message}
      onMessageChange={(e) => setMessage(e.target.value)}
      sendMessage={sendMessage}
      onKeyPress={handleKeyPress}

    />
  ) : (
    <UsernameInput
      username={user}
      onUsernameChange={(e) => setUser(e.target.value)}
      onSetUsername={setUsername}
    />
  );
