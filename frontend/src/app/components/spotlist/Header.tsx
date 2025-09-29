// components/spotlist/Header.tsx

'use client';

interface HeaderProps {
  onBackClick: () => void;
  onSkipClick: () => void;
}

export default function Header({ onBackClick, onSkipClick }: HeaderProps) {
  return (
    <>
      <div className="header-container">
        <div className="header-left">
          <button className="back-button" onClick={onBackClick}>
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.7912 7.5051H3.62124L8.50124 2.6251C8.89124 2.2351 8.89124 1.5951 8.50124 1.2051C8.11124 0.815098 7.48124 0.815098 7.09124 1.2051L0.50124 7.7951C0.11124 8.1851 0.11124 8.8151 0.50124 9.2051L7.09124 15.7951C7.48124 16.1851 8.11124 16.1851 8.50124 15.7951C8.89124 15.4051 8.89124 14.7751 8.50124 14.3851L3.62124 9.5051H14.7912C15.3412 9.5051 15.7912 9.0551 15.7912 8.5051C15.7912 7.9551 15.3412 7.5051 14.7912 7.5051Z" fill="white"/>
            </svg>
          </button>
          <h1 className="header-title">景点选择</h1>
        </div>
        <button className="skip-button" onClick={onSkipClick}>
          跳过
        </button>
      </div>
      <style jsx>{`
        .header-container {
          padding: 48px 16px 16px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #D9D9D9;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .back-button {
          width: 56px;
          height: 37px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 18.5px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .header-title {
          font-family: 'Inter', semi-bold;
          font-size: 20px;
          font-weight: 500;
          color: #ffffff;
        }
        .skip-button {
          width: 79px;
          height: 37px;
          font-family: 'Inter', semi-bold;
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
          background-color: #0768FD;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}