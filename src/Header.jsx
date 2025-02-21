// src/Header.js
import React from 'react';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-red-800">
            <div className="max-w-4xl mx-auto flex justify-center items-center p-4">
                {/* Replace with your actual logo image */}
                <img src="/logo.png" alt="Logo" className="h-8" />
            </div>
        </header>
    );
};

export default Header;
