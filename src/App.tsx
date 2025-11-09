import { HashRouter, Routes, Route } from 'react-router-dom';
import { Root, Home, About, Positions, Contacts, NotFound, Sponsors } from '@/pages';
import { Navbar } from '@/components';
import { ScrollToTop } from '@/components/utils';
import { inject } from '@vercel/analytics';
import { Toaster } from '@/components/ui';

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
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/sponsors' element={<Sponsors />} />
          <Route path='*' element={<NotFound />} /> {/* Catch-all for 404s */}
        </Routes>
      </HashRouter>
      <Toaster />
    </>
  );
}

export default App;
