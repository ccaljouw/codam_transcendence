import MenuBar from './MenuBar.tsx';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
        <div>
          <div>
            <MenuBar/>
          </div>
          <div>
            {children}
          </div>
        </div>
    </>
  );
};

export default Layout;
