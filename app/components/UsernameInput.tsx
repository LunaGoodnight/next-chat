interface UsernameInputProps {
    username: string;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSetUsername: () => void;
}

export const UsernameInput: React.FC<UsernameInputProps> = ({ username, onUsernameChange, onSetUsername }) => {
    return (
        <div className="w-full bg-white p-4 shrink-0">
            <div className="flex space-x-4">
                <input
                    className="flex-1 px-4 py-2 border rounded-lg text-gray-600"
                    type="text"
                    value={username}
                    onChange={onUsernameChange}
                    placeholder="Enter your name"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" type="button" onClick={onSetUsername}>
                    Set Name
                </button>
            </div>
        </div>
    );
};
