import "./App.css";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import { Home } from "./components/Home";
import About from "./components/About";
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
import  Articles  from "./components/Articles";

function App() {

    const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* This grows and pushes footer down */}
      <main className="flex-grow">
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/media" element={<Media />} />
          <Route path="/media/:eventId" element={<Media />} />
          <Route path="/contact" element={<Contact />} />
<Route path="/request" element={<PrayerRequest />} />
<Route path="/articles" element={<Articles />} />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
