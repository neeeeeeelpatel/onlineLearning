import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, hasRole, getUserData } from '../../utils/authUtils';
import { courseService } from '../../utils/courseService';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';

const InstructorCourseBuilder = () => {
  const navigate = useNavigate();
  // Check if user is an instructor
  useEffect(() => {
    if (!hasRole('instructor')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Course state
  const [course, setCourse] = useState({
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

  // Add state for custom category
  const [customCategory, setCustomCategory] = useState('');

  // Add state for publish status and preview
  const [publishStatus, setPublishStatus] = useState('Draft');
  const [showPreview, setShowPreview] = useState(false);

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
      navigate('/instructor-dashboard');
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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 md:ml-64 relative">
          {/* Sticky Save Button */}
          <button
            onClick={handleSubmit}
            className="fixed top-24 right-10 z-30 inline-flex items-center px-6 py-2 border border-transparent text-base font-semibold rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            style={{ minWidth: '160px' }}
          >
            <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
            Save Course
          </button>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Course Builder</h1>
          </div>
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {['basic', 'curriculum', 'requirements', 'pricing'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize`}
                  >
                    {tab === 'basic' ? 'Basic Info' : tab}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div>
                  <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={course.title}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="e.g. Complete Web Development Bootcamp"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Course Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      value={course.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Provide a detailed description of your course"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        id="category"
                        name="category"
                        value={["Programming", "Design", "Marketing", "Web Development", "Mobile Development", "Data Science", "Machine Learning", "DevOps", "Business"].includes(course.category) ? course.category : 'Other'}
                        onChange={e => {
                          if (e.target.value === 'Other') {
                            setCustomCategory(course.category && !["Programming", "Design", "Marketing", "Web Development", "Mobile Development", "Data Science", "Machine Learning", "DevOps", "Business"].includes(course.category) ? course.category : '');
                            setCourse(prev => ({ ...prev, category: 'Other' }));
                          } else {
                            setCourse(prev => ({ ...prev, category: e.target.value }));
                            setCustomCategory('');
                          }
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Programming">Programming</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Business">Business</option>
                        <option value="Other">Other</option>
                      </select>
                      {course.category === 'Other' && (
                        <input
                          type="text"
                          className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="Enter custom category"
                          value={customCategory}
                          onChange={e => {
                            setCustomCategory(e.target.value);
                            setCourse(prev => ({ ...prev, category: e.target.value }));
                          }}
                          required
                        />
                      )}
                    </div>
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                      <select
                        id="level"
                        name="level"
                        value={course.level}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">Course Thumbnail URL</label>
                    <input
                      type="text"
                      id="thumbnail"
                      name="thumbnail"
                      value={course.thumbnail}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="https://example.com/thumbnail.jpg"
                    />
                    {course.thumbnail && (
                      <div className="mt-2">
                        <img 
                          src={course.thumbnail} 
                          alt="Course thumbnail preview" 
                          className="h-40 object-cover rounded-md"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/640x360?text=Thumbnail+Preview'}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Learning Outcomes</label>
                    <p className="text-sm text-gray-500 mb-4">What will students learn in your course?</p>
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={outcome}
                          onChange={(e) => handleArrayInputChange('learningOutcomes', index, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder={`Outcome ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('learningOutcomes', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          disabled={course.learningOutcomes.length === 1}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('learningOutcomes')}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-1 h-5 w-5" />
                      Add Learning Outcome
                    </button>
                  </div>
                </div>
              )}
              {/* Curriculum Tab */}
              {activeTab === 'curriculum' && (
                <div>
                  {/* Accordion for Modules */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900">Course Modules</h2>
                      <button
                        type="button"
                        onClick={handleAddModule}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <PlusIcon className="-ml-1 mr-1 h-5 w-5" />
                        Add Module
                      </button>
                    </div>
                    <div className="space-y-4">
                      {course.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="bg-white rounded-lg shadow">
                          <button
                            type="button"
                            className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none"
                            onClick={() => setActiveModuleIndex(moduleIndex)}
                          >
                            <span className="font-semibold text-primary-700">{module.title}</span>
                            <span className="text-xs text-gray-500">{module.lessons.length} lessons</span>
                          </button>
                          {activeModuleIndex === moduleIndex && (
                            <div className="border-t px-4 py-4">
                              <div className="mb-4 flex items-center gap-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
                                <input
                                  type="text"
                                  value={module.title}
                                  onChange={e => handleModuleTitleChange(moduleIndex, e.target.value)}
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveModule(moduleIndex)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                              {/* Lessons Accordion */}
                              <div className="space-y-4">
                                {module.lessons.map((lesson, lessonIndex) => (
                                  <div key={lessonIndex} className="bg-gray-50 rounded p-4">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">Lesson {lessonIndex + 1}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveLesson(moduleIndex, lessonIndex)}
                                        className="text-gray-400 hover:text-red-500"
                                        disabled={module.lessons.length === 1}
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </button>
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                                      <input
                                        type="text"
                                        value={lesson.title}
                                        onChange={e => handleLessonChange(moduleIndex, lessonIndex, 'title', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Description</label>
                                      <textarea
                                        value={lesson.description || ''}
                                        onChange={e => handleLessonChange(moduleIndex, lessonIndex, 'description', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        rows={2}
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">Video (URL or MP4)</label>
                                      <input
                                        type="text"
                                        value={lesson.videoUrl || ''}
                                        onChange={e => handleLessonChange(moduleIndex, lessonIndex, 'videoUrl', e.target.value)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                        placeholder="Paste video URL or upload below"
                                      />
                                      {/* File upload for video (optional) */}
                                      <input
                                        type="file"
                                        accept="video/mp4"
                                        className="mt-2"
                                        onChange={e => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            handleLessonChange(moduleIndex, lessonIndex, 'videoUrl', URL.createObjectURL(file));
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="mb-2">
                                      <label className="block text-sm font-medium text-gray-700 mb-1">PDF/Resource Upload</label>
                                      <input
                                        type="file"
                                        accept="application/pdf"
                                        className="block w-full"
                                        onChange={e => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            handleLessonChange(moduleIndex, lessonIndex, 'pdfUrl', URL.createObjectURL(file));
                                          }
                                        }}
                                      />
                                      {lesson.pdfUrl && (
                                        <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline text-xs mt-1 inline-block">View PDF</a>
                                      )}
                                    </div>
                                    {/* Quiz Builder Accordion */}
                                    <QuizBuilder lesson={lesson} onChange={quiz => handleLessonChange(moduleIndex, lessonIndex, 'quiz', quiz)} />
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => handleAddLesson(moduleIndex)}
                                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  <PlusIcon className="-ml-1 mr-1 h-5 w-5" />
                                  Add Lesson
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Publish Controls */}
                  <div className="flex items-center gap-4 mt-8">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${publishStatus === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{publishStatus}</span>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-semibold" onClick={() => setPublishStatus('Draft')}>Save as Draft</button>
                    <button className="px-4 py-2 bg-blue-200 text-blue-700 rounded font-semibold" onClick={() => setShowPreview(true)}>Preview Course</button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded font-semibold" onClick={() => setPublishStatus('Published')}>Publish</button>
                  </div>
                  {/* Preview Modal (mock) */}
                  {showPreview && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl relative">
                        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowPreview(false)}>&times;</button>
                        <h2 className="text-2xl font-bold mb-4">Course Preview</h2>
                        <div className="mb-2 font-semibold">{course.title}</div>
                        <div className="mb-2 text-gray-700">{course.description}</div>
                        <div className="mb-2 text-xs text-gray-500">{course.category} | {course.level}</div>
                        <div className="mb-2">Modules: {course.modules.length}</div>
                        <div className="mb-2">Lessons: {course.modules.reduce((sum, m) => sum + m.lessons.length, 0)}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* Requirements Tab */}
              {activeTab === 'requirements' && (
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                    <p className="text-sm text-gray-500 mb-4">What are the prerequisites for taking this course?</p>
                    {course.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => handleArrayInputChange('requirements', index, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder={`Requirement ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('requirements', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          disabled={course.requirements.length === 1}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('requirements')}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-1 h-5 w-5" />
                      Add Requirement
                    </button>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <p className="text-sm text-gray-500 mb-4">Who is this course for?</p>
                    {course.targetAudience.map((audience, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={audience}
                          onChange={(e) => handleArrayInputChange('targetAudience', index, e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder={`Target Audience ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('targetAudience', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                          disabled={course.targetAudience.length === 1}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('targetAudience')}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <PlusIcon className="-ml-1 mr-1 h-5 w-5" />
                      Add Target Audience
                    </button>
                  </div>
                </div>
              )}
              {/* Pricing Tab */}
              {activeTab === 'pricing' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Regular Price (₹) *</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={course.price}
                          onChange={handleInputChange}
                          className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">₹</span>
                        </div>
                        <input
                          type="number"
                          id="discountPrice"
                          name="discountPrice"
                          value={course.discountPrice}
                          onChange={handleInputChange}
                          className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Leave empty if no discount</p>
                    </div>
                  </div>
                  {course.price && course.discountPrice && parseFloat(course.discountPrice) < parseFloat(course.price) && (
                    <div className="mt-4 p-4 bg-green-50 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Discount Applied</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>You're offering a {Math.round(((parseFloat(course.price) - parseFloat(course.discountPrice)) / parseFloat(course.price)) * 100)}% discount on this course.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// QuizBuilder component (inline or above main component)
function QuizBuilder({ lesson, onChange }) {
  const [showQuiz, setShowQuiz] = useState(!!lesson.quiz);
  const [quiz, setQuiz] = useState(lesson.quiz || { title: '', questions: [], timeLimit: '' });

  useEffect(() => {
    if (showQuiz) onChange(quiz);
    else onChange(undefined);
    // eslint-disable-next-line
  }, [quiz, showQuiz]);

  const handleQuestionChange = (idx, field, value) => {
    setQuiz(prev => {
      const questions = [...prev.questions];
      questions[idx] = { ...questions[idx], [field]: value };
      return { ...prev, questions };
    });
  };
  const handleOptionChange = (qIdx, optIdx, value) => {
    setQuiz(prev => {
      const questions = [...prev.questions];
      const options = [...(questions[qIdx].options || ['', '', '', ''])];
      options[optIdx] = value;
      questions[qIdx] = { ...questions[qIdx], options };
      return { ...prev, questions };
    });
  };
  const handleCorrectChange = (qIdx, value) => {
    setQuiz(prev => {
      const questions = [...prev.questions];
      questions[qIdx] = { ...questions[qIdx], correct: value };
      return { ...prev, questions };
    });
  };
  const addQuestion = () => {
    setQuiz(prev => ({ ...prev, questions: [...prev.questions, { text: '', options: ['', '', '', ''], correct: 0 }] }));
  };
  const removeQuestion = idx => {
    setQuiz(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== idx) }));
  };

  if (!showQuiz) return <button className="mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded text-sm" onClick={() => setShowQuiz(true)}>+ Add Quiz</button>;

  return (
    <div className="mt-4 bg-white border rounded p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">Quiz</span>
        <button className="text-xs text-red-500" onClick={() => setShowQuiz(false)}>Remove Quiz</button>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
        <input
          type="text"
          value={quiz.title}
          onChange={e => setQuiz(prev => ({ ...prev, title: e.target.value }))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes, optional)</label>
        <input
          type="number"
          min="0"
          value={quiz.timeLimit || ''}
          onChange={e => setQuiz(prev => ({ ...prev, timeLimit: e.target.value }))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <div className="mb-2">
        <span className="block text-sm font-medium text-gray-700 mb-1">Questions</span>
        {quiz.questions.map((q, qIdx) => (
          <div key={qIdx} className="mb-4 border rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <span>Q{qIdx + 1}</span>
              <button className="text-xs text-red-500" onClick={() => removeQuestion(qIdx)}>Remove</button>
            </div>
            <input
              type="text"
              value={q.text}
              onChange={e => handleQuestionChange(qIdx, 'text', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm mb-1"
              placeholder="Question text"
            />
            <div className="grid grid-cols-2 gap-2 mb-1">
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={opt}
                    onChange={e => handleOptionChange(qIdx, optIdx, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder={`Option ${optIdx + 1}`}
                  />
                  <input
                    type="radio"
                    name={`correct-${qIdx}`}
                    checked={q.correct === optIdx}
                    onChange={() => handleCorrectChange(qIdx, optIdx)}
                  />
                  <span className="text-xs">Correct</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button className="mt-2 px-3 py-1 bg-primary-100 text-primary-700 rounded text-sm" onClick={addQuestion}>+ Add Question</button>
      </div>
    </div>
  );
}

export default InstructorCourseBuilder; 