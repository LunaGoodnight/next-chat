import React from 'react';
import { IoMdSettings } from 'react-icons/io';

interface HeaderProps {
    onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => (
    <div className="p-4 w-full relative">
        <h2 className="text-2xl font-bold text-gray-600 w-full text-center">
            Chat Room
        </h2>
        <div className="absolute right-0 top-0 text-gray-400 cursor-pointer p-4" onClick={onSettingsClick}>
            <IoMdSettings style={{ fontSize: '30px' }} />
        </div>
    </div>
);
