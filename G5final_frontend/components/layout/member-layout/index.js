import Navbar from '../default-layout/navbar';
import Footer from '../default-layout/footer';
import MbSideBar from '@/components/member/sidebar';
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs';
import { useAuth } from '@/hooks/use-auth';

export default function MemberLayout({ children }) {
  const { auth } = useAuth();
  if (!auth.isAuth) {
    return <></>
  }
  return (
    <>
      <Navbar />
      <main>
        <div className="container my-5">
          <Breadcrumbs />
          <div className="row">
            <aside className="col-lg-3">
              {/* <aside className="col-3 d-none d-lg-block"> */}
              <MbSideBar />
            </aside>
            <article className="col-lg-9">{children}</article>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
