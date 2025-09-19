import { Outlet } from 'react-router-dom';

import Header from './Header';
import NavBar from './NavBar';

export default function ProtectedLayout() {
  return (
    <div className="relative flex h-[100dvh] w-full max-w-[var(--frame-width)] flex-col shadow">
      <Header />
      <main className="scrollbar-hide flex-1 overflow-y-auto pt-16 pb-16">
        <Outlet />
      </main>
      <div className="pb-[env(safe-area-inset-bottom)]">
        <NavBar />
      </div>
    </div>
  );
}
