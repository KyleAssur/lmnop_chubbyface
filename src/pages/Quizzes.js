import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Quiz.css';

const Quizzes = () => {
    const quizList = [
        { id: 1, title: "Introduction to Programming" },
        { id: 2, title: "Web Development" },
        { id: 3, title: "Database Management" },
        { id: 4, title: "Networking Fundamentals" },
        { id: 5, title: "Cybersecurity Basics" },
    ];

    return (
        <div className="quiz-container">
            <h1 className="quiz-title">Course Quizzes</h1>
            <div className="quiz-grid">
                {quizList.map((quiz) => (
                    <div className="quiz-card" key={quiz.id}>
                        <h2>{quiz.title}</h2>
                        <Link to={`/quiz${quiz.id}`} className="start-btn">Start Quiz</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Quizzes;
