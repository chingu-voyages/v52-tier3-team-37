import React, { useState, ReactNode } from "react";

interface CollapsibleProps {
  title: string;
  children: ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xl font-semibold text-simmpy-gray-800 flex justify-between items-center px-4 py-2 bg-simmpy-gray-100 rounded-lg"
      >
        {title}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="mt-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;
