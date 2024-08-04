import React, { useState } from "react";
import Modal from "react-modal";
import { avatarUrls } from "@/app/utils/avatarUrls";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [isCustomAvatar, setIsCustomAvatar] = useState(false);

  const isValidImgurUrl = (url: string) => {
    const imgurRegex = /^https?:\/\/(i\.)?imgur\.com\/.+\.(jpg|jpeg|png|gif)$/;
    return imgurRegex.test(url);
  };

  const handleAvatarChange = (newAvatar: string) => {
    setAvatar(newAvatar);
    localStorage.setItem("avatar", newAvatar); // Save to localStorage
  };

  const handleSaveSettings = () => {
    if (isCustomAvatar) {
      if (!isValidImgurUrl(customAvatarUrl)) {
        setErrorMessage(
          "Please enter a valid Imgur URL ending with .jpg, .jpeg, .png, or .gif.",
        );
        return;
      } else if (customAvatarUrl === "") {
        setErrorMessage("Custom avatar URL cannot be empty.");
        return;
      } else {
        handleAvatarChange(customAvatarUrl);
      }
    }
    saveSettings();
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Settings"
      className="bg-white p-6 rounded-lg shadow-md mx-4 text-gray-600 w-full max-w-md"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold mb-4 text-center">User Settings</h2>
      <label className="block mb-2">
        <div className="text-lg">Username:</div>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </label>
      <div className="flex flex-col gap-4 mb-2">
        <div className="text-lg">Avatar:</div>
        <label className="mr-4 flex align-middle">
          <input
            type="radio"
            name="avatarType"
            value="default"
            checked={!isCustomAvatar}
            onChange={() => setIsCustomAvatar(false)}
            className="mr-2 h-6 w-6" // Increase size of radio button
          />
          <span>Select from provided avatars</span>
        </label>
        <label className="flex align-middle">
          <input
            type="radio"
            name="avatarType"
            value="custom"
            checked={isCustomAvatar}
            onChange={() => setIsCustomAvatar(true)}
            className="mr-2 h-6 w-6" // Increase size of radio button
          />
          <span>Custom Avatar URL</span>
        </label>
      </div>
      <div className="pt-2">

        {!isCustomAvatar ? (
          <div className="flex flex-wrap gap-4 text-left">
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
        ) : (
          <label className="block mb-2">
            <input
              type="text"
              value={customAvatarUrl}
              onChange={(e) => setCustomAvatarUrl(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Enter Imgur URL"
            />
            {errorMessage && (
              <div className="text-red-500 mt-2">{errorMessage}</div>
            )}
          </label>
        )}
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={onRequestClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveSettings}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};
