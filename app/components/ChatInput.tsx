import React from "react";

interface ChatInputProps {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setImage: (file: File | null) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onKeyPress,
  setImage,
}) => {
  return (
    <div className="w-full bg-white p-4 shrink-0">
      <div className="flex space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
        />
        <input
          className="flex-1 px-4 py-2 border rounded-lg text-gray-600"
          type="text"
          value={message}
          onChange={onMessageChange}
          onKeyPress={onKeyPress}
          placeholder="Enter your message"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={onSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};
