import { useState } from 'react';
import './App.css';
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Workout from './pages/Workout.jsx';
import FoodAnalysis from './pages/FoodAnalysis.jsx';
import Progress from './pages/Progress.jsx';
import ExerciseLibrary from './pages/ExerciseLibrary.jsx';
import AICoach from './pages/AICoach.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';

const pages = {
  dashboard: Dashboard,
  workout: Workout,
  food: FoodAnalysis,
  progress: Progress,
  exerciselibrary: ExerciseLibrary,
  coach: AICoach,
  history: History,
  profile: Profile,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="app-frame">
        <Header activePage={activePage} />
        <main
          className={`app-main ${activePage === 'coach' ? 'app-main-chat' : ''}`}
        >
          <PageComponent onNavigate={setActivePage} />
        </main>
      </div>
    </div>
  );
}
