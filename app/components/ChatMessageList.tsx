import React from 'react';
import { MessageList } from './MessageList';
import { Message } from '../utils/types';

interface ChatMessageListProps {
    messages: Message[];
    currentUser: string;
    chatListRef: React.RefObject<HTMLDivElement>;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, chatListRef, currentUser, messagesEndRef }) => (
    <div className="p-4 pt-0 w-full" ref={chatListRef}>
        <MessageList
            messages={messages}
            currentUser={currentUser}
            messagesEndRef={messagesEndRef}
        />
    </div>
);
