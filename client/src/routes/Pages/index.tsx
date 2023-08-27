import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import './Pages.scss';
import Home from './Home';

const Pages = () => {
  return (
    <div className="page-container">
      <Header />
      <Routes>
        <Route path="/" Component={Home} />
      </Routes>
    </div>
  );
};

export default Pages;
