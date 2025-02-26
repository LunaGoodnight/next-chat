import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#__next"); // Set the root element for accessibility

interface UserDetailsModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  user: string;
  avatar: string;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onRequestClose,
  user,
  avatar,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="User Details"
      className="bg-white p-6 rounded-lg shadow-md mx-4 text-gray-600 w-full max-w-md relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <button
        onClick={onRequestClose}
        className="absolute top-0 right-0 text-gray-600 hover:text-gray-800 text-2xl p-4 z-10"
      >
        &#x2715;
      </button>
      <div className="flex flex-col items-center">
        <div className="w-full rounded-full overflow-hidden" style={{ maxHeight: '60vh'}}>
          <img src={avatar} alt={`${user}'s avatar`} className="w-full mb-4" />
        </div>

        <h2 className="text-xl font-bold">{user}</h2>
      </div>
    </Modal>
  );
};
