import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full h-[50px] bg-[var(--header-background)] border border-[var(--border-color)] flex justify-between items-center">
      <img
        src="/assets/IconOnly_mashlomme.png"
        alt="Emek Logo"
        className="h-[42px] w-[80px] rounded-[50px] object-contain"
      />
      <span className="flex-1 text-[var(--header-text-color)] text-center font-semibold text-[13px] font-helvetica">
        mashlom.me - כלי עזר לצוות רפואה
      </span>
      <div className="w-[80px]" />
    </header>
  );
};

export default Header;