import React from 'react';
import { IoCloseOutline } from "react-icons/io5";


interface ConfirmationMessageProps {
  status: 'success' | 'error';
  errorMsg?: string | null;
  onClose: () => void;
}

const ConfirmationMessage: React.FC<ConfirmationMessageProps> = ({ status, errorMsg, onClose }) => {
  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay background */}
        <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
        {/* Modal content */}
        <div className="relative p-8 bg-green-50 border thanksforSubscribing rounded-xl xl:max-w-2xl xl:w-full w-96 xl:text-md text-sm z-10 shadow-lg flex flex-col items-center gap-8 text-zinc-900 text-md font-satoshi">
          <IoCloseOutline 
            size={30} 
            onClick={onClose}
            className="absolute right-0 top-0 mt-3 mr-3 cursor-pointer"
          />
          <h2 className="text-xl">Thanks for Subscribing!</h2>
          <p>We&apos;re thrilled to have you as part of our community.
            <br/><br/>
            Your support means the world to us, and we can&apos;t wait to share exclusive updates, behind-the-scenes content, and more directly with you.
            <br/><br/>    
            Keep an eye on your inbox, something exciting is always around the corner. 
            <br/><br/>
            If you ever have questions or just want to say hello, we&apos;re only a message away.  
          </p>
        </div>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded relative">
        <IoCloseOutline 
          size={24} 
          onClick={onClose}
          className="absolute right-0 top-0 mt-2 mr-2 cursor-pointer"
        />
        ❌ {errorMsg || 'Something went wrong. Please try again.'}
      </div>
    );
  }
  return null;
};

export default ConfirmationMessage;