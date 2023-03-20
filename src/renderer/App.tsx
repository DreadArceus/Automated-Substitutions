import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.scss';
import { Header } from './components/Header';
import { Add } from './views/Add';
import { Config } from './views/Config';
import { Delete } from './views/Delete';
import { EditTT } from './views/EditTT';
import { Subs } from './views/Subs';
import { Validate } from './views/Validate';

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
        <Link to={'tt/config'}>Configure Timetable</Link>
        <Link to={'tt/edit'}>Edit Timetable</Link>
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
        <Route path="get-subs" element={<Subs />} />
        <Route path="/add" element={<Add />} />
        <Route path="/delete" element={<Delete />} />
        <Route path="/tt/config" element={<Config />} />
        <Route path="/tt/edit" element={<EditTT />} />
        <Route path="/tt/validate" element={<Validate />} />
      </Routes>
    </Router>
  );
};

export default App;
