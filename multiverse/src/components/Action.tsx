import React from 'react';

interface ActionProps {
    onClick: () => void;
    children: React.ReactNode;
}

const Action: React.FC<ActionProps> = ({ onClick, children }) => {
    return (
        <button
            className="border-black border-solid border rounded p-1 m-1 w-20 bg-slate-100"
            onClick={onClick}>
            {children}
        </button>
    );
}

export default Action;
