import "./App.css";
import NavBar from "./components/NavBar";
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from "./components/Home";
import About from "./components/About";
import HomeAbout from "./Home/HomeAbout";
import Footer from "./components/Footer";
import Vision from "./components/Vision";
import Gallery from "./components/Gallery";
import Media from "./components/Media";
import Contact from "./components/Contact";
import ScrollToTop from "./components/ScrollToTop";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PrayerRequest from "./Home/PrayerRequest";
import Articles from "./components/Articles";

// Admin Imports
import { AuthProvider } from "./admin/utils/AuthContext";
import AdminLayout from "./admin/components/AdminLayout";
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import KalpanaManage from "./admin/pages/KalpanaManage";
import AboutManage from "./admin/pages/AboutManage";
import EventsManage from "./admin/pages/EventsManage";
import GalleryManage from "./admin/pages/GalleryManage";
import ArticlesManage from "./admin/pages/ArticlesManage";
import ActivityLogs from "./admin/pages/ActivityLogs";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Avoid redirecting when loading or refreshing administrative panels
    if (window.location.pathname.startsWith("/admin")) {
      return;
    }
    // Only redirect from index.html
    if (window.location.pathname === "/index.html") {
      navigate("/", { replace: true });
    }
  }, []);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        {/* Do not render public header/footer on administrative dashboard views */}
        {!isAdminRoute && <NavBar />}

        <main className="flex-grow">
          {!isAdminRoute && <ScrollToTop />}
          <Routes>
            {/* Public Page Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/homeAbout" element={<HomeAbout />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/media" element={<Media />} />
            <Route path="/media/:eventId" element={<Media />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/request" element={<PrayerRequest />} />
            <Route path="/articles" element={<Articles />} />

            {/* Admin CMS routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/kalpanas" element={<KalpanaManage />} />
              <Route path="/admin/team-members" element={<AboutManage />} />
              <Route path="/admin/events" element={<EventsManage />} />
              <Route path="/admin/gallery" element={<GalleryManage />} />
              <Route path="/admin/articles" element={<ArticlesManage />} />
              <Route path="/admin/logs" element={<ActivityLogs />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;

