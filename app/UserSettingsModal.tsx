import React, { useState } from "react";
import Modal from "react-modal";
import { avatarUrls } from "@/app/avatarUrls";

Modal.setAppElement("#__next"); // Set the root element for accessibility

interface UserSettingsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  avatar: string;
  setAvatar: React.Dispatch<React.SetStateAction<string>>;
  saveSettings: () => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onRequestClose,
  user,
  setUser,
  avatar,
  setAvatar,
  saveSettings,
}) => {
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");

  const handleAvatarChange = (newAvatar: string) => {
    setAvatar(newAvatar);
    localStorage.setItem("avatar", newAvatar); // Save to localStorage
  };

  const handleCustomAvatarSubmit = () => {
    if (customAvatarUrl) {
      setAvatar(customAvatarUrl);
      localStorage.setItem("avatar", customAvatarUrl); // Save to localStorage
      setCustomAvatarUrl("");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Settings"
      className="bg-white p-6 rounded-lg shadow-md mx-4 "
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-gray-600">User Settings</h2>
      <label className="block mb-2">
        <div className='text-gray-600 text-lg'>Username:</div>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="border p-2 rounded w-full text-gray-600"
        />
      </label>
      <label className="block mb-2">
        Avatar:
        <div className="flex space-x-2 mt-2">
          {avatarUrls.map((url) => (
            <img
              key={url}
              src={url}
              alt="avatar"
              className={`w-12 h-12 rounded-full cursor-pointer ${avatar === url ? "border-2 border-blue-500" : ""}`}
              onClick={() => handleAvatarChange(url)}
            />
          ))}
        </div>
      </label>
      <label className="block mb-2">
        Custom Avatar URL:
        <input
          type="text"
          value={customAvatarUrl}
          onChange={(e) => setCustomAvatarUrl(e.target.value)}
          className="border p-2 rounded w-full text-gray-600 "
          placeholder="Enter Imgur URL"
        />
        <button
          onClick={handleCustomAvatarSubmit}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Set Custom Avatar
        </button>
      </label>
      <button
        onClick={() => {
          saveSettings();
          onRequestClose();
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </Modal>
  );
};
