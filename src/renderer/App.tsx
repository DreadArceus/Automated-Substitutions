import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';
import { Add } from './views/add';

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<Add />} />
      </Routes>
    </Router>
  );
};

export default App;
