import React from "react";

interface ActionProps {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
}

const Action: React.FC<ActionProps> = ({ onClick, disabled, children }) => {
    console.log(disabled);
    if (disabled) {
        return (
            <button
                className={`border-slate-500 border-solid border rounded p-1 px-4 bg-slate-300 text-slate-100 min-w-16 cursor-not-allowed`}
                onClick={() => {}}
            >
                {children}
            </button>
        );
    }
    return (
        <button
            className={`border-black border-solid border rounded p-1 px-4 bg-slate-100 text-black min-w-16 cursor-pointer`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Action;
