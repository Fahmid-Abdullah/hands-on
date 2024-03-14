import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import Learn from './pages/Learn';
import Lessons from './pages/Lessons';
import Translator from './pages/Translator';
import Menu from './pages/Menu';

function App() {
  return (
    <div className = "App">
      <Router>
        <Navbar />
        <Routes>
          <Route path = "/" exact element={<Home />} />
          <Route path = "/learn" exact element={<Learn />} />
          <Route path = "/lessons" exact element={<Lessons />} />
          <Route path = "/translator" exact element={<Translator />} />
          <Route path = "/menu" exact element={<Menu />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
