import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, hasRole, getUserData } from '../utils/authUtils';
import { courseService } from '../utils/courseService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/solid';
import { FaCheckCircle, FaRegEdit, FaPlus, FaTrash, FaUpload, FaChevronRight, FaChevronLeft, FaSave, FaEye, FaCloudUploadAlt, FaTag } from 'react-icons/fa';

const TABS = [
  'Basic Info',
  'Curriculum',
  'Requirements',
  'Pricing',
];

const defaultCourse = {
  title: '',
  description: '',
  category: '',
  customCategory: '',
  thumbnail: null,
  thumbnailUrl: '',
  learningOutcomes: [''],
  requirements: [''],
  targetAudience: [''],
  modules: [
    {
      name: '',
      lessons: [
        { title: '', content: '', quiz: [] },
      ],
    },
  ],
  price: '',
  discount: '',
  status: 'Draft',
};

const categories = ['Development', 'Design', 'Business', 'Marketing', 'Custom'];

const CourseBuilder = () => {
  const navigate = useNavigate();
  
  // Check if user is an instructor
  useEffect(() => {
    if (!hasRole('instructor')) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const [tab, setTab] = useState(0);
  const [course, setCourse] = useState(defaultCourse);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState('');
  
  // Course state
  const [courseState, setCourseState] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    price: '',
    discountPrice: '',
    thumbnail: '',
    learningOutcomes: [''],
    requirements: [''],
    targetAudience: [''],
    modules: [{
      title: 'Module 1',
      lessons: [{
        title: 'Introduction',
        type: 'video',
        duration: '00:05:00',
        content: ''
      }]
    }]
  });
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('basic');
  
  // Active module and lesson for editing
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  
  // Handle input change for basic course info
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle array input changes (learning outcomes, requirements, target audience)
  const handleArrayInputChange = (arrayName, index, value) => {
    setCourse(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };
  
  // Add new item to array (learning outcomes, requirements, target audience)
  const handleAddArrayItem = (arrayName) => {
    setCourse(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };
  
  // Remove item from array (learning outcomes, requirements, target audience)
  const handleRemoveArrayItem = (arrayName, index) => {
    setCourse(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [arrayName]: newArray
      };
    });
  };
  
  // Handle module title change
  const handleModuleTitleChange = (index, value) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[index] = {
        ...newModules[index],
        title: value
      };
      return {
        ...prev,
        modules: newModules
      };
    });
  };
  
  // Add new module
  const handleAddModule = () => {
    setCourse(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: `Module ${prev.modules.length + 1}`,
          lessons: [{
            title: 'Introduction',
            type: 'video',
            duration: '00:05:00',
            content: ''
          }]
        }
      ]
    }));
    setActiveModuleIndex(course.modules.length);
    setActiveLessonIndex(0);
  };
  
  // Remove module
  const handleRemoveModule = (index) => {
    if (course.modules.length === 1) {
      alert('Course must have at least one module');
      return;
    }
    
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules.splice(index, 1);
      return {
        ...prev,
        modules: newModules
      };
    });
    
    if (activeModuleIndex >= index) {
      setActiveModuleIndex(Math.max(0, activeModuleIndex - 1));
      setActiveLessonIndex(0);
    }
  };
  
  // Handle lesson change
  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        lessons: newModules[moduleIndex].lessons.map((lesson, i) => {
          if (i === lessonIndex) {
            return {
              ...lesson,
              [field]: value
            };
          }
          return lesson;
        })
      };
      return {
        ...prev,
        modules: newModules
      };
    });
  };
  
  // Add new lesson
  const handleAddLesson = (moduleIndex) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        lessons: [
          ...newModules[moduleIndex].lessons,
          {
            title: `Lesson ${newModules[moduleIndex].lessons.length + 1}`,
            type: 'video',
            duration: '00:05:00',
            content: ''
          }
        ]
      };
      return {
        ...prev,
        modules: newModules
      };
    });
    setActiveLessonIndex(course.modules[moduleIndex].lessons.length);
  };
  
  // Remove lesson
  const handleRemoveLesson = (moduleIndex, lessonIndex) => {
    if (course.modules[moduleIndex].lessons.length === 1) {
      alert('Module must have at least one lesson');
      return;
    }
    
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        lessons: newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
      };
      return {
        ...prev,
        modules: newModules
      };
    });
    
    if (activeLessonIndex >= lessonIndex) {
      setActiveLessonIndex(Math.max(0, activeLessonIndex - 1));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!course.title || !course.description || !course.category || !course.price) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Get current user data
    const userData = getUserData();
    
    // Prepare course data with instructor information
    const courseData = {
      ...course,
      instructor: userData.email,
      instructorId: userData.id || Date.now(),
      duration: calculateTotalDuration(),
      thumbnail: course.thumbnail || 'https://via.placeholder.com/640x360?text=Course+Thumbnail',
      status: 'draft',
      isPublished: false
    };
    
    try {
      // Save course using the service
      const savedCourse = courseService.addCourse(courseData);
      console.log('Course saved successfully:', savedCourse);
      
      alert('Course saved successfully! You can now publish it to make it visible to students.');
      
      // Redirect to instructor dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course. Please try again.');
    }
  };
  
  // Calculate total duration from modules
  const calculateTotalDuration = () => {
    const totalMinutes = course.modules.reduce((total, module) => {
      return total + module.lessons.reduce((moduleTotal, lesson) => {
        const duration = lesson.duration || '00:05:00';
        const [hours, minutes] = duration.split(':').slice(0, 2);
        return moduleTotal + (parseInt(hours) * 60 + parseInt(minutes));
      }, 0);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} hours ${minutes} minutes`;
  };

  // Tab content renderers
  const renderTab = () => {
    switch (tab) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Course Title</label>
              <input type="text" className="input" value={course.title} onChange={e => handleInputChange(e)} placeholder="Enter course title" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Description</label>
              <textarea className="input" value={course.description} onChange={e => handleInputChange(e)} placeholder="Course description" rows={3} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Category</label>
              <select className="input" value={course.category} onChange={e => handleInputChange(e)}>
                <option value="">Select category</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {course.category === 'Custom' && (
                <input type="text" className="input mt-2" value={course.customCategory} onChange={e => handleInputChange(e)} placeholder="Custom category" />
              )}
            </div>
            <div>
              <label className="block font-semibold mb-1">Thumbnail</label>
              <input type="file" accept="image/*" onChange={e => handleInputChange(e)} className="block" />
              {course.thumbnailUrl && <img src={course.thumbnailUrl} alt="Thumbnail preview" className="mt-2 w-32 h-20 object-cover rounded shadow" />}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            {course.modules.map((mod, mIdx) => (
              <div key={mIdx} className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <input type="text" className="input flex-1" value={mod.title} onChange={e => handleModuleTitleChange(mIdx, e.target.value)} placeholder={`Module ${mIdx + 1} name`} />
                  <button className="p-2 rounded hover:bg-red-100" onClick={() => handleRemoveModule(mIdx)} title="Remove module"><FaTrash className="text-red-500" /></button>
                </div>
                {/* Lessons */}
                {mod.lessons.map((lesson, lIdx) => (
                  <div key={lIdx} className="ml-4 mb-2 bg-white rounded p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="text" className="input flex-1" value={lesson.title} onChange={e => handleLessonChange(mIdx, lIdx, 'title', e.target.value)} placeholder={`Lesson ${lIdx + 1} title`} />
                      <button className="p-2 rounded hover:bg-red-100" onClick={() => handleRemoveLesson(mIdx, lIdx)} title="Remove lesson"><FaTrash className="text-red-500" /></button>
                    </div>
                    <textarea className="input w-full" value={lesson.content} onChange={e => handleLessonChange(mIdx, lIdx, 'content', e.target.value)} placeholder="Lesson content" rows={2} />
                    {/* Quiz Builder */}
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-xs text-gray-600">Quiz</span>
                        <button className="p-1 rounded bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs" onClick={() => handleAddLesson(mIdx)}><FaPlus /> Add MCQ</button>
                      </div>
                      {lesson.quiz && lesson.quiz.length > 0 && lesson.quiz.map((q, qIdx) => (
                        <div key={qIdx} className="bg-gray-100 rounded p-2 mb-2">
                          <input type="text" className="input mb-1" value={q.question} onChange={e => handleQuizChange(mIdx, lIdx, qIdx, 'question', e.target.value)} placeholder="Question" />
                          <div className="grid grid-cols-2 gap-2 mb-1">
                            {q.options.map((opt, oIdx) => (
                              <input key={oIdx} type="text" className="input" value={opt} onChange={e => {
                                const opts = [...q.options]; opts[oIdx] = e.target.value;
                                handleQuizChange(mIdx, lIdx, qIdx, 'options', opts);
                              }} placeholder={`Option ${oIdx + 1}`} />
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            <label className="text-xs">Correct:</label>
                            <select className="input" value={q.correct} onChange={e => handleQuizChange(mIdx, lIdx, qIdx, 'correct', Number(e.target.value))}>
                              {q.options.map((_, oIdx) => <option key={oIdx} value={oIdx}>{`Option ${oIdx + 1}`}</option>)}
                            </select>
                            <label className="text-xs ml-2">Time (sec):</label>
                            <input type="number" className="input w-20" value={q.time} min={10} max={600} onChange={e => handleQuizChange(mIdx, lIdx, qIdx, 'time', Number(e.target.value))} />
                          </div>
                          <button className="p-1 rounded hover:bg-red-100 text-xs text-red-600" onClick={() => handleRemoveQuiz(mIdx, lIdx, qIdx)}><FaTrash /> Remove MCQ</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="mt-2 flex items-center gap-1 px-3 py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded text-sm" onClick={() => handleAddLesson(mIdx)}><FaPlus /> Add Lesson</button>
              </div>
            ))}
            <button className="flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 font-semibold" onClick={handleAddModule}><FaPlus /> Add Module</button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Learning Outcomes */}
            <div>
              <label className="block font-semibold mb-1">Learning Outcomes</label>
              {course.learningOutcomes.map((out, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input type="text" className="input flex-1" value={out} onChange={e => handleArrayInputChange('learningOutcomes', idx, e.target.value)} placeholder={`Outcome ${idx + 1}`} />
                  <button className="p-2 rounded hover:bg-red-100" onClick={() => handleRemoveArrayItem('learningOutcomes', idx)} title="Remove"><FaTrash className="text-red-500" /></button>
                </div>
              ))}
              <button className="flex items-center gap-1 px-3 py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded text-sm" onClick={() => handleAddArrayItem('learningOutcomes')}><FaPlus /> Add Outcome</button>
            </div>
            {/* Requirements */}
            <div>
              <label className="block font-semibold mb-1">Requirements</label>
              {course.requirements.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input type="text" className="input flex-1" value={req} onChange={e => handleArrayInputChange('requirements', idx, e.target.value)} placeholder={`Requirement ${idx + 1}`} />
                  <button className="p-2 rounded hover:bg-red-100" onClick={() => handleRemoveArrayItem('requirements', idx)} title="Remove"><FaTrash className="text-red-500" /></button>
                </div>
              ))}
              <button className="flex items-center gap-1 px-3 py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded text-sm" onClick={() => handleAddArrayItem('requirements')}><FaPlus /> Add Requirement</button>
            </div>
            {/* Target Audience */}
            <div>
              <label className="block font-semibold mb-1">Target Audience</label>
              {course.targetAudience.map((aud, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <input type="text" className="input flex-1" value={aud} onChange={e => handleArrayInputChange('targetAudience', idx, e.target.value)} placeholder={`Audience ${idx + 1}`} />
                  <button className="p-2 rounded hover:bg-red-100" onClick={() => handleRemoveArrayItem('targetAudience', idx)} title="Remove"><FaTrash className="text-red-500" /></button>
                </div>
              ))}
              <button className="flex items-center gap-1 px-3 py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded text-sm" onClick={() => handleAddArrayItem('targetAudience')}><FaPlus /> Add Audience</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Price (USD)</label>
              <input type="number" className="input" value={course.price} onChange={e => handleInputChange(e)} placeholder="e.g. 49.99" min={0} />
            </div>
            <div>
              <label className="block font-semibold mb-1">Discount (%)</label>
              <input type="number" className="input" value={course.discount} onChange={e => handleInputChange(e)} placeholder="e.g. 20" min={0} max={100} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <FaTag className="text-primary-600" />
              <span className="text-sm text-gray-600">Final Price: <span className="font-bold text-primary-700">${course.price && course.discount ? (course.price * (1 - course.discount / 100)).toFixed(2) : course.price}</span></span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Quiz builder for lessons
  const handleQuizChange = (mIdx, lIdx, qIdx, field, value) => {
    setCourse(prev => {
      const modules = [...prev.modules];
      const quiz = [...(modules[mIdx].lessons[lIdx].quiz || [])];
      quiz[qIdx][field] = value;
      modules[mIdx].lessons[lIdx].quiz = quiz;
      return { ...prev, modules };
    });
  };

  // Save/Publish/Preview
  const handleSave = (status) => {
    setSaving(true);
    setTimeout(() => {
      setCourse(prev => ({ ...prev, status }));
      setSaving(false);
    }, 800);
  };

  const handleRemoveQuiz = (mIdx, lIdx, qIdx) => {
    setCourse(prev => {
      const modules = [...prev.modules];
      const quiz = [...(modules[mIdx].lessons[lIdx].quiz || [])];
      quiz.splice(qIdx, 1);
      modules[mIdx].lessons[lIdx].quiz = quiz;
      return { ...prev, modules };
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-6 md:ml-64">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Course Builder</h1>
            <button
              onClick={() => handleSave('Draft')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={saving}
            >
              <FaSave className="-ml-1 mr-2 h-5 w-5" />
              {saving ? 'Saving...' : 'Save Course'}
            </button>
          </div>
          
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {TABS.map((t, idx) => (
                  <button
                    key={t}
                    onClick={() => setTab(idx)}
                    className={`${tab === idx
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                  >
                    {t}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="p-6">
              {/* Tab Content */}
              {renderTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;