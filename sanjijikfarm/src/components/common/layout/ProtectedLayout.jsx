import { Outlet } from 'react-router-dom';

import Header from './Header';
import NavBar from './NavBar';

export default function ProtectedLayout() {
  return (
    <div className="h-screen w-full">
      <div className="relative mx-auto h-full max-w-[var(--frame-width)] shadow">
        <Header />
        <main className="scrollbar-hide h-full w-full overflow-scroll pt-16 pb-16">
          <Outlet />
        </main>
        <NavBar />
      </div>
    </div>
  );
}
