import React from 'react';

const availableQuizzes = [];
const completedQuizzes = [];

const Quizzes = () => (
  <div className="p-4 sm:p-6 md:p-8">
    <h2 className="text-2xl font-bold mb-6"><span className="text-orange-500">Quizzes</span></h2>
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Available Quizzes</h3>
      {availableQuizzes.length === 0 ? (
        <div className="text-center text-gray-500">No quizzes available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {availableQuizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 flex flex-col border-l-4" style={{ borderImage: 'linear-gradient(to bottom, #FF6A00, #7F00FF) 1' }}>
              <div className="font-semibold text-lg mb-1">{quiz.title}</div>
              <div className="text-sm text-gray-500 mb-2">{quiz.description}</div>
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700 font-medium mb-2">{quiz.status}</span>
              <button className="mt-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded font-bold hover:from-orange-600 hover:to-purple-700 transition">Take Quiz</button>
            </div>
          ))}
        </div>
      )}
    </div>
    <div>
      <h3 className="text-lg font-semibold mb-4">Completed Quizzes</h3>
      {completedQuizzes.length === 0 ? (
        <div className="text-center text-gray-500">No completed quizzes yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {completedQuizzes.map(quiz => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-4 flex flex-col">
              <div className="font-semibold text-lg mb-1">{quiz.title}</div>
              <div className="text-sm text-gray-500 mb-2">{quiz.description}</div>
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700 font-medium mb-2">{quiz.status}</span>
              <div className="text-xs text-gray-600 mb-2">Score: <span className="font-bold">{quiz.score}</span> | Date: {quiz.date}</div>
              <button className="mt-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded font-bold hover:from-orange-600 hover:to-purple-700 transition">Retry</button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default Quizzes; 