import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./MainLayout.css";

const MainLayout = () => {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <main key={location.pathname} className="animate-page-entrance">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;