// src/app/read-earn/layout.jsx
export const metadata = {
  title: 'Read & Earn'
};

export default function ReadEarnLayout({ children }) {
  return (
    <div>
      {/* You can add a header/nav here if you like */}
      {children}
    </div>
  );
}