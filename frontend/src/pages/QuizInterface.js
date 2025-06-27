import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../utils/mockData';
import { getUserData } from '../utils/authUtils';
import Navbar from '../components/Navbar';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const QuizInterface = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [matchAnswers, setMatchAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Load quiz data
  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      navigate('/login');
      return;
    }
    
    // Find the course
    const foundCourse = courses.find(c => c.id === parseInt(courseId));
    if (!foundCourse) {
      navigate('/courses');
      return;
    }
    
    setCourse(foundCourse);
    
    // Find the quiz (in a real app, this would come from an API)
    // For this mock, we'll create a sample quiz
    const mockQuiz = {
      id: parseInt(quizId) || 1,
      title: 'Module Assessment Quiz',
      description: 'Test your knowledge of the concepts covered in this module.',
      timeLimit: 10, // in minutes
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: 'mcq',
          question: 'What is the main advantage of using React.js?',
          options: [
            'Server-side rendering only',
            'Virtual DOM for better performance',
            'Built-in database functionality',
            'Native mobile development'
          ],
          correctAnswer: 1 // index of correct option
        },
        {
          id: 2,
          type: 'mcq',
          question: 'Which hook is used to perform side effects in a function component?',
          options: [
            'useState',
            'useReducer',
            'useEffect',
            'useContext'
          ],
          correctAnswer: 2
        },
        {
          id: 3,
          type: 'mcq',
          question: 'What does JSX stand for?',
          options: [
            'JavaScript XML',
            'JavaScript Extension',
            'JavaScript Syntax',
            'Java Syntax Extension'
          ],
          correctAnswer: 0
        },
        {
          id: 4,
          type: 'match',
          question: 'Match the following React concepts with their descriptions:',
          items: [
            { id: 'a', text: 'Props' },
            { id: 'b', text: 'State' },
            { id: 'c', text: 'Context' }
          ],
          options: [
            { id: '1', text: 'Internal data that can change over time' },
            { id: '2', text: 'Pass data from parent to child components' },
            { id: '3', text: 'Provides a way to share data without passing props' }
          ],
          correctMatches: { 'a': '2', 'b': '1', 'c': '3' }
        },
        {
          id: 5,
          type: 'match',
          question: 'Match the following lifecycle methods with their timing:',
          items: [
            { id: 'a', text: 'componentDidMount' },
            { id: 'b', text: 'componentDidUpdate' },
            { id: 'c', text: 'componentWillUnmount' }
          ],
          options: [
            { id: '1', text: 'After component updates' },
            { id: '2', text: 'Before component is removed' },
            { id: '3', text: 'After first render' }
          ],
          correctMatches: { 'a': '3', 'b': '1', 'c': '2' }
        }
      ]
    };
    
    setQuiz(mockQuiz);
    setTimeLeft(mockQuiz.timeLimit * 60); // Convert minutes to seconds
    setTimerActive(true);
    setIsLoading(false);
    
    // Initialize answers object
    const initialAnswers = {};
    const initialMatchAnswers = {};
    mockQuiz.questions.forEach(q => {
      if (q.type === 'mcq') {
        initialAnswers[q.id] = null;
      } else if (q.type === 'match') {
        const matches = {};
        q.items.forEach(item => {
          matches[item.id] = '';
        });
        initialMatchAnswers[q.id] = matches;
      }
    });
    setAnswers(initialAnswers);
    setMatchAnswers(initialMatchAnswers);
  }, [courseId, quizId, navigate]);
  
  // Timer effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle MCQ answer selection
  const handleAnswerSelect = (questionId, optionIndex) => {
    if (submitted) return;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };
  
  // Handle match answer selection
  const handleMatchSelect = (questionId, itemId, optionId) => {
    if (submitted) return;
    
    setMatchAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [itemId]: optionId
      }
    }));
  };
  
  // Calculate if an option is already selected in another match
  const isOptionSelected = (questionId, optionId) => {
    if (!matchAnswers[questionId]) return false;
    
    return Object.values(matchAnswers[questionId]).includes(optionId);
  };
  
  // Handle quiz submission
  const handleSubmit = () => {
    if (submitted) return;
    
    let totalQuestions = 0;
    let correctAnswers = 0;
    
    // Check MCQ answers
    quiz.questions.forEach(question => {
      if (question.type === 'mcq') {
        totalQuestions++;
        if (answers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      } else if (question.type === 'match') {
        // Each match item counts as one question
        const matchQuestion = matchAnswers[question.id] || {};
        Object.entries(question.correctMatches).forEach(([itemId, correctOptionId]) => {
          totalQuestions++;
          if (matchQuestion[itemId] === correctOptionId) {
            correctAnswers++;
          }
        });
      }
    });
    
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(calculatedScore);
    setSubmitted(true);
    setTimerActive(false);
    
    // Save quiz result to localStorage
    const quizResults = JSON.parse(localStorage.getItem('quiz_results') || '{}');
    quizResults[`${courseId}_${quizId}`] = {
      score: calculatedScore,
      passed: calculatedScore >= quiz.passingScore,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('quiz_results', JSON.stringify(quizResults));
  };
  
  // Check if all questions are answered
  const allQuestionsAnswered = () => {
    let allAnswered = true;
    
    // Check MCQ answers
    quiz?.questions.forEach(question => {
      if (question.type === 'mcq' && answers[question.id] === null) {
        allAnswered = false;
      } else if (question.type === 'match') {
        const matchQuestion = matchAnswers[question.id] || {};
        question.items.forEach(item => {
          if (!matchQuestion[item.id]) {
            allAnswered = false;
          }
        });
      }
    });
    
    return allAnswered;
  };
  
  // Continue to next lesson
  const handleContinue = () => {
    navigate(`/course-player/${courseId}`);
  };
  
  // Retry quiz
  const handleRetry = () => {
    // Reset quiz state
    const initialAnswers = {};
    const initialMatchAnswers = {};
    quiz.questions.forEach(q => {
      if (q.type === 'mcq') {
        initialAnswers[q.id] = null;
      } else if (q.type === 'match') {
        const matches = {};
        q.items.forEach(item => {
          matches[item.id] = '';
        });
        initialMatchAnswers[q.id] = matches;
      }
    });
    
    setAnswers(initialAnswers);
    setMatchAnswers(initialMatchAnswers);
    setSubmitted(false);
    setScore(0);
    setTimeLeft(quiz.timeLimit * 60);
    setTimerActive(true);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Quiz not found</h2>
          <p className="mt-2 text-gray-600">The quiz you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate(`/course-player/${courseId}`)} 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Quiz Header */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                <p className="mt-1 text-gray-600">{quiz.description}</p>
              </div>
              
              {!submitted && (
                <div className="mt-4 md:mt-0 flex items-center bg-yellow-50 px-4 py-2 rounded-md">
                  <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-medium text-yellow-700">
                    Time Remaining: {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quiz Results (if submitted) */}
        {submitted && (
          <div className={`mb-6 p-6 rounded-lg shadow-md ${score >= quiz.passingScore ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center">
              {score >= quiz.passingScore ? (
                <CheckCircleIcon className="h-12 w-12 text-green-500 mr-4" />
              ) : (
                <XCircleIcon className="h-12 w-12 text-red-500 mr-4" />
              )}
              
              <div>
                <h2 className={`text-xl font-bold ${score >= quiz.passingScore ? 'text-green-800' : 'text-red-800'}`}>
                  {score >= quiz.passingScore ? 'Quiz Passed!' : 'Quiz Failed'}
                </h2>
                <p className="text-gray-700 mt-1">
                  Your score: <span className="font-bold">{score}%</span> 
                  (Passing score: {quiz.passingScore}%)
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              {score < quiz.passingScore && (
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Retry Quiz
                </button>
              )}
              
              <button
                onClick={handleContinue}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Continue to Next Lesson
              </button>
            </div>
          </div>
        )}
        
        {/* Quiz Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, qIndex) => (
            <div key={question.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Question {qIndex + 1}: {question.question}
                </h3>
                
                {question.type === 'mcq' && (
                  <div className="space-y-3">
                    {question.options.map((option, oIndex) => {
                      const isSelected = answers[question.id] === oIndex;
                      const isCorrect = submitted && question.correctAnswer === oIndex;
                      const isWrong = submitted && isSelected && !isCorrect;
                      
                      return (
                        <div 
                          key={oIndex} 
                          className={`flex items-center p-3 rounded-md cursor-pointer ${isSelected ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50 border border-gray-200'} ${submitted && isCorrect ? 'bg-green-50 border-green-200' : ''} ${isWrong ? 'bg-red-50 border-red-200' : ''}`}
                          onClick={() => handleAnswerSelect(question.id, oIndex)}
                        >
                          <div className={`w-5 h-5 rounded-full border ${isSelected ? 'border-primary-500' : 'border-gray-300'} flex items-center justify-center mr-3 ${submitted && isCorrect ? 'border-green-500' : ''} ${isWrong ? 'border-red-500' : ''}`}>
                            {isSelected && <div className={`w-3 h-3 rounded-full ${submitted && isCorrect ? 'bg-green-500' : isWrong ? 'bg-red-500' : 'bg-primary-500'}`}></div>}
                          </div>
                          <span className={`${submitted && isCorrect ? 'text-green-700 font-medium' : ''} ${isWrong ? 'text-red-700' : ''}`}>
                            {option}
                          </span>
                          
                          {submitted && isCorrect && (
                            <CheckCircleIcon className="h-5 w-5 text-green-500 ml-auto" />
                          )}
                          {isWrong && (
                            <XCircleIcon className="h-5 w-5 text-red-500 ml-auto" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {question.type === 'match' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Match
                          </th>
                          {submitted && (
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Result
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {question.items.map((item) => {
                          const selectedOption = matchAnswers[question.id]?.[item.id] || '';
                          const isCorrect = submitted && selectedOption === question.correctMatches[item.id];
                          const isWrong = submitted && selectedOption && !isCorrect;
                          
                          return (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {item.text}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <select
                                  value={selectedOption}
                                  onChange={(e) => handleMatchSelect(question.id, item.id, e.target.value)}
                                  disabled={submitted}
                                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${isCorrect ? 'border-green-500 text-green-700' : ''} ${isWrong ? 'border-red-500 text-red-700' : ''}`}
                                >
                                  <option value="">Select a match</option>
                                  {question.options.map((option) => (
                                    <option 
                                      key={option.id} 
                                      value={option.id}
                                      disabled={isOptionSelected(question.id, option.id) && option.id !== selectedOption}
                                    >
                                      {option.text}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              {submitted && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {isCorrect ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <CheckCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-green-400" />
                                      Correct
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      <XCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4 text-red-400" />
                                      Incorrect
                                    </span>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    
                    {submitted && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Correct Matches:</h4>
                        <ul className="space-y-1">
                          {question.items.map((item) => {
                            const correctOptionId = question.correctMatches[item.id];
                            const correctOption = question.options.find(o => o.id === correctOptionId);
                            
                            return (
                              <li key={item.id} className="text-sm text-gray-600">
                                <span className="font-medium">{item.text}</span> → {correctOption?.text}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Submit Button */}
        {!submitted && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={!allQuestionsAnswered()}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${allQuestionsAnswered() ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;