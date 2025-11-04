// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import MeetingScheduler from './components/MeetingScheduler';
import './index.css'; // Use index.css for global styles

function App() {
    return (
        <main>
            <Routes>
                <Route path="/" element={<MeetingScheduler />} />
            </Routes>
        </main>
    );
}

export default App;
