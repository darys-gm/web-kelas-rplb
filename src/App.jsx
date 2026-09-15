import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route Landing Page - Tanpa Navbar & Footer */}
        <Route path="/" element={<Landing />} />
        
        {/* Route Home dengan Navbar & Footer */}
        <Route path="/home" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        
        {/* Route lainnya dengan Navbar & Footer */}
        <Route path="/murid" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        
        <Route path="/piket" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        
        <Route path="/pelajaran" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        
        <Route path="/gallery" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
        
        <Route path="/struktur" element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;