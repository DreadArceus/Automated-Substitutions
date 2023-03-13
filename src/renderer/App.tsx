import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';
import { Header } from './components/Header';
import { Add } from './views/Add';
import { Delete } from './views/Delete';

const Home: React.FC = () => {
  return (
    <div className="home">
      <h1>Welcome</h1>
      <div>
        <Link to={'get-subs'}>Get Substitutions</Link>
      </div>
      <div>
        <Link to={'add'}>Add New Teacher/Class/Subject</Link>
        <Link to={'delete'}>Delete Teacher/Class/Subject</Link>
      </div>
      <div>
        <Link to={'tt/add'}>Add Timetable Entry</Link>
        <Link to={'tt/delete'}>Delete Timetable Entry</Link>
        <Link to={'tt/validate'}>Validate Timetable</Link>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
        <Route path="/delete" element={<Delete />} />
      </Routes>
    </Router>
  );
};

export default App;
