import { NavProvider } from '@/provider';
import { PrivateRoute } from '@/router/private-route';
import { Footer } from './footer';
import { Header } from './header';
import { SideBar } from './sidebar';

const Layout = () => {
  return (
    <section className="h-screen">
      <div
        className="flex w-full  bg-slate-100"
        id="app-content"
        style={{ height: 'calc(100% - var(--toastify-toast-max-height))' }}
      >
        <NavProvider>
          <aside className="xs:hidden z-10 shadow-sm">
            <SideBar />
          </aside>
          <aside className="w-full overflow-hidden bg-white" id="app-container">
            <Header />
            <main id="main-content" className="px-6 py-3">
              <PrivateRoute />
            </main>
          </aside>
        </NavProvider>
      </div>
      <Footer />
    </section>
  );
};

export default Layout;
