import React from 'react';

const steps = [];

const LearningPath = () => (
  <div className="p-4 sm:p-6 md:p-8">
    <h2 className="text-2xl font-bold mb-6"><span className="text-orange-500">Learning</span> <span className="text-purple-600">Path</span></h2>
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4" style={{ borderImage: 'linear-gradient(to bottom, #FF6A00, #7F00FF) 1' }}>
      {steps.length === 0 ? (
        <div className="text-center text-gray-500">No learning path available yet.</div>
      ) : (
        <ol className="relative border-l-4 border-primary-200 ml-4">
          {steps.map((step, idx) => (
            <li key={step.id} className="mb-10 ml-6">
              <span className={`absolute -left-6 flex items-center justify-center w-8 h-8 rounded-full border-4 ${step.status === 'Completed' ? 'bg-orange-500 border-orange-200' : step.status === 'Current' ? 'bg-purple-600 border-purple-200' : 'bg-gray-300 border-gray-200'} text-white font-bold text-lg`}>{idx + 1}</span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-lg mb-1">{step.title}</div>
                  <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${step.status === 'Completed' ? 'bg-gradient-to-r from-orange-100 to-purple-100 text-orange-700' : step.status === 'Current' ? 'bg-gradient-to-r from-purple-100 to-orange-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{step.status}</span>
                </div>
                {step.status === 'Current' && (
                  <div className="mt-2 sm:mt-0 text-primary-700 font-medium">This is your current step. Keep going!</div>
                )}
                {step.status === 'Upcoming' && idx === steps.findIndex(s => s.status === 'Upcoming') && (
                  <div className="mt-2 sm:mt-0 text-primary-600 font-medium">Next up: {step.title}</div>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  </div>
);

export default LearningPath; 