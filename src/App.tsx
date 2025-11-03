import { HashRouter, Routes, Route } from "react-router-dom";
import Root from "./pages/Root";
import Home from "./pages/Home";
import About from "./pages/About";
import Positions from "./pages/Positions";
import Contact from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Sponsors from "./pages/Sponsors";
import ScrollToTop from "./components/utils/ScrollToTop";
import { inject } from "@vercel/analytics";
import { Toaster } from "@/components/ui/sonner";

inject();

function App() {
  return (
    <>
      <HashRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/home' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/positions' element={<Positions />} />
          <Route path='/contacts' element={<Contact />} />
          <Route path='/sponsors' element={<Sponsors />} />
          <Route path='*' element={<NotFound />} /> {/* Catch-all for 404s */}
        </Routes>
      </HashRouter>
      <Toaster />
    </>
  );
}

export default App;
