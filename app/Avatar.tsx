
interface AvatarProps {
    src: string;
    user: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, user }) => {
    return (
        <div className="flex-shrink-0 text-center">
            <div className="rounded-full overflow-hidden w-10 h-10">
                <img style={{ width: "100%" }} src={src} alt="User avatar" />
            </div>
            <span className="text-xs text-gray-500">{user}</span>
        </div>
    );
};
