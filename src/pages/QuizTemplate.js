import React, { useState } from 'react';
import quizData from '../data/QuizData';
import '../styles/Quiz.css';

const QuizTemplate = ({ quizId, title }) => {
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const questions = quizData[quizId];

    const handleChange = (question, value) => {
        setUserAnswers({ ...userAnswers, [question]: value });
    };

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const score = questions.filter(q => userAnswers[q.question] === q.answer).length;

    return (
        <div className="quiz-page">
            <h1>{title}</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                {questions.map((q, idx) => (
                    <div key={idx} className="question-block">
                        <p className="question">{idx + 1}. {q.question}</p>
                        {q.type === "multiple" ? (
                            q.options.map((opt, i) => (
                                <label key={i}>
                                    <input
                                        type="radio"
                                        name={q.question}
                                        value={opt}
                                        onChange={() => handleChange(q.question, opt)}
                                        disabled={submitted}
                                    />
                                    {opt}
                                </label>
                            ))
                        ) : (
                            <>
                                <label>
                                    <input
                                        type="radio"
                                        name={q.question}
                                        value="True"
                                        onChange={() => handleChange(q.question, "True")}
                                        disabled={submitted}
                                    /> True
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name={q.question}
                                        value="False"
                                        onChange={() => handleChange(q.question, "False")}
                                        disabled={submitted}
                                    /> False
                                </label>
                            </>
                        )}
                        {submitted && (
                            <p className={userAnswers[q.question] === q.answer ? "correct" : "incorrect"}>
                                {userAnswers[q.question] === q.answer ? "✅ Correct" : `❌ Incorrect (Answer: ${q.answer})`}
                            </p>
                        )}
                    </div>
                ))}

                {!submitted && <button onClick={handleSubmit} className="submit-btn">Submit Quiz</button>}
                {submitted && <h2 className="score">Your Score: {score} / {questions.length}</h2>}
            </form>
        </div>
    );
};

export default QuizTemplate;
