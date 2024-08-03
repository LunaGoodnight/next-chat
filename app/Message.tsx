import { Avatar } from './Avatar';

interface MessageProps {
    message: string;
    user: string;
    avatar: string;
    isCurrentUser: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, user, avatar, isCurrentUser }) => {
    return (
        <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-start w-full space-x-4 gap-4 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
                <Avatar src={avatar} user={user} />
                <div className={`p-3 max-w-full rounded-lg ${isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
};
