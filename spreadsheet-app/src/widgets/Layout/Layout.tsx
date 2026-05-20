import { ReactNode } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-layout__content">
        <Sidebar />
        <main className="app-layout__main">
          {children}
        </main>
      </div>
    </div>
  );
};