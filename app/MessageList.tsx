import { Message } from './types';
import { Message as MessageComponent } from './Message';

interface MessageListProps {
    messages: Message[];
    currentUser: string;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUser, messagesEndRef }) => {
    return (
        <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4 overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
            {messages.map((msg, index) => (
                <MessageComponent key={index} message={msg.message} user={msg.user} avatar={msg.avatar} isCurrentUser={msg.user === currentUser} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
