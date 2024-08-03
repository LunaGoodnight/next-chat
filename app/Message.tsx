import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { UserDetailsModal } from './UserDetailsModal';

interface MessageProps {
    message: string;
    user: string;
    avatar: string;
    isCurrentUser: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, user, avatar, isCurrentUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAvatarClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start w-full space-x-4 gap-4 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                    <div onClick={handleAvatarClick} className="cursor-pointer">
                        <Avatar src={avatar} user={user} />
                    </div>
                    <div className={`p-3 max-w-full rounded-lg ${isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                        <p>{message}</p>
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
