import React, { useState } from "react";
import { FaPaperclip } from "react-icons/fa"; // Importing the paperclip icon

interface ChatInputProps {
  message: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sendMessage: (image?: File) => Promise<void>;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
                                                      message,
                                                      onMessageChange,
                                                      sendMessage,
                                                      onKeyPress,

                                                    }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
      setImageFile(null);
    }
  };

  const handleConfirmSend = () => {
    if (imageFile) {
      setPreviewImage(null);
      setImageFile(null);
      sendMessage(imageFile);
    }
  };

  const handleCancelSend = () => {
    setPreviewImage(null);
    setImageFile(null);
  };

  return (
      <div className="w-full bg-white p-4 shrink-0">
        <div className="flex space-x-4 items-center">
          <label className="cursor-pointer">
            <FaPaperclip size={24} className="text-gray-600" />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
            />
          </label>
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
              onClick={() => sendMessage()}
          >
            Send
          </button>
        </div>

        {previewImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img src={previewImage} alt="Preview" className="max-w-xs max-h-xs mb-4" />
                <div className="flex space-x-4">
                  <button
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                      onClick={handleConfirmSend}
                  >
                    Confirm
                  </button>
                  <button
                      className="bg-red-600 text-white px-4 py-2 rounded-lg"
                      onClick={handleCancelSend}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};
