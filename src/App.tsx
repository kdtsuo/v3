import { Navbar } from '@/components';
import { Toaster } from '@/components/ui';
import { ScrollToTop } from '@/components/utils';
import { About, Contacts, Home, NotFound, Positions, Root, Sponsors } from '@/pages';
import { inject } from '@vercel/analytics';
import { HashRouter, Route, Routes } from 'react-router-dom';

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
