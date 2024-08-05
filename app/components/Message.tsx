import React, { useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Avatar } from "./Avatar";
import { UserDetailsModal } from "./UserDetailsModal";

dayjs.extend(utc);
dayjs.extend(timezone);

interface MessageProps {
  message: string;
  user: string;
  avatar: string;
  isCurrentUser: boolean;
  timestamp: number; // New prop for timestamp
  imageUrl: string | null;
}

export const Message: React.FC<MessageProps> = ({
                                                  message,
                                                  user,
                                                  avatar,
                                                  isCurrentUser,
                                                  timestamp,
                                                  imageUrl
                                                }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const localTime = dayjs(timestamp).tz(dayjs.tz.guess()).format("HH:mm");

  return (
      <>
        <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
          <div
              className={`flex items-start w-full space-x-4 gap-4 ${
                  isCurrentUser ? "flex-row-reverse" : ""
              }`}
          >
            <div onClick={handleAvatarClick} className="cursor-pointer">
              <Avatar src={avatar} user={user} />
            </div>
            <div
                className={`flex gap-4 place-items-end ${
                    isCurrentUser ? "justify-end" : ""
                }`}
            >
              {isCurrentUser && (
                  <span className="text-xs text-gray-500">{localTime}</span>
              )}
              {imageUrl ? (
                  <div
                      className={`w-3/4 rounded-lg ${
                          isCurrentUser
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    <img src={imageUrl} alt="user-images" className="w-full" />
                  </div>
              ) : (
                  <div
                      className={`p-3 max-w-full rounded-lg ${
                          isCurrentUser
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    <p>{message}</p>
                  </div>
              )}

              {!isCurrentUser && (
                  <span className="text-xs text-gray-500">{localTime}</span>
              )}
            </div>
          </div>
        </div>
        <UserDetailsModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            user={user}
            avatar={avatar}
        />
      </>
  );
};
