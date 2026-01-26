import { useState } from 'react';
import BasicScene from './lessons/01-basic-scene/BasicScene';

const lessons = [
    { id: '01', title: 'Basic Scene', component: BasicScene },
];

function App() {
    const [currentLesson, setCurrentLesson] = useState('01');

    const LessonComponent = lessons.find((l) => l.id === currentLesson)?.component || BasicScene;

    return (
        <div className="app">
            <nav className="sidebar">
                <h1>Three.js Learning</h1>
                <h2>React Three Fiber</h2>
                <ul className="lesson-list">
                    {lessons.map((lesson) => (
                        <li key={lesson.id}>
                            <button
                                className={currentLesson === lesson.id ? 'active' : ''}
                                onClick={() => setCurrentLesson(lesson.id)}
                            >
                                {lesson.id}. {lesson.title}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <main className="canvas-container">
                <LessonComponent />
            </main>
        </div>
    );
}

export default App;
