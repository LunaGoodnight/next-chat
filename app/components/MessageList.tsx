import { Message } from "../utils/types";
import { Message as MessageComponent } from "./Message";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface MessageListProps {
    messages: Message[];
    currentUser: string;
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
                                                            messages,
                                                            currentUser,
                                                            messagesEndRef,
                                                        }) => {
    return (
        <div
            className="flex-1 w-full bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4 overflow-y-auto"
            style={{ height: "calc(100vh - 220px)" }}
        >
            {messages.length === 0
                ? Array(7).fill(0).map((_, index) => (
                    <div key={index} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <div className="flex items-center space-x-4">
                            {index % 2 === 0 ? (
                                <>
                                    <Skeleton circle={true} height={40} width={40} />
                                    <div>
                                        <Skeleton height={20} width={150} />
                                        <Skeleton height={20} width={100} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-right">
                                        <Skeleton height={20} width={150} />
                                        <Skeleton height={20} width={100} />
                                    </div>
                                    <Skeleton circle={true} height={40} width={40} />
                                </>
                            )}
                        </div>
                    </div>
                ))
                : messages.map((msg, index) => (
                    <MessageComponent
                        key={index}
                        message={msg.message}
                        user={msg.user}
                        avatar={msg.avatar}
                        isCurrentUser={msg.user === currentUser}
                        timestamp={msg.timestamp}
                    />
                ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
