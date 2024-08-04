import React from 'react';
import { MessageList } from './MessageList';
import { Message } from '../utils/types';

interface ChatMessageListProps {
    messages: Message[];
    currentUser: string;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, currentUser, messagesEndRef }) => (
    <div className="p-4 w-full">
        <MessageList
            messages={messages}
            currentUser={currentUser}
            messagesEndRef={messagesEndRef}
        />
    </div>
);
