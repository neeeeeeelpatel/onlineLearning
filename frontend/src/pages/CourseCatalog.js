import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../utils/mockData';
import { courseService } from '../utils/courseService';
import { hasRole } from '../utils/authUtils';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/solid';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const RATINGS = [4.5, 4, 3.5, 3];

const CourseCatalog = () => {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get the appropriate home/dashboard route based on user role
  const getHomeRoute = () => {
    if (hasRole('instructor')) return '/instructor-dashboard';
    if (hasRole('admin')) return '/dashboard';
    return '/dashboard'; // Default for learners
  };

  // Get category from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Initialize filtered courses with published courses
  useEffect(() => {
    const publishedCourses = courseService.getPublishedCourses();
    setFilteredCourses(publishedCourses);
  }, []);

  // Filter courses based on filters
  useEffect(() => {
    let result = courseService.getPublishedCourses();

    // Search
    if (searchTerm) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(course => course.category === selectedCategory);
    }
    // Level
    if (selectedLevels.length > 0) {
      result = result.filter(course => selectedLevels.includes(course.level));
    }
    // Price
    if (selectedPrice === 'free') {
      result = result.filter(course => course.price === 0 || course.discountPrice === 0);
    } else if (selectedPrice === 'paid') {
      result = result.filter(course => (course.discountPrice || course.price) > 0);
    }
    // Rating
    if (selectedRating !== 'all') {
      result = result.filter(course => course.rating >= Number(selectedRating));
    }
    // Sort
    switch (selectedSort) {
      case 'popular':
        result.sort((a, b) => b.students - a.students);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      case 'price-low':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    setFilteredCourses(result);
  }, [searchTerm, selectedCategory, selectedLevels, selectedSort, selectedPrice, selectedRating]);

  // Handlers
  const handleLevelChange = (level) => {
    setSelectedLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link
                to={getHomeRoute()}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                  Course Catalog
                </span>
              </div>
            </li>
            {selectedCategory !== 'all' && (
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {selectedCategory}
                  </span>
                </div>
              </li>
            )}
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white shadow-md p-6 rounded-lg sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button 
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Category */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Category</h3>
                <ul>
                  <li>
                    <button 
                      onClick={() => setSelectedCategory('all')} 
                      className={`block w-full text-left px-2 py-1 rounded ${selectedCategory==='all'?'bg-primary-100 text-primary-700':''}`}
                    >
                      All
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.name}>
                      <button 
                        onClick={() => setSelectedCategory(cat.name)} 
                        className={`block w-full text-left px-2 py-1 rounded ${selectedCategory===cat.name?'bg-primary-100 text-primary-700':''}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Level */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Level</h3>
                {LEVELS.map(level => (
                  <label key={level} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level)}
                      onChange={() => handleLevelChange(level)}
                      className="mr-2"
                    />
                    {level}
                  </label>
                ))}
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Price</h3>
                <label className="flex items-center mb-1">
                  <input type="radio" name="price" checked={selectedPrice==='all'} onChange={()=>setSelectedPrice('all')} className="mr-2" /> All
                </label>
                <label className="flex items-center mb-1">
                  <input type="radio" name="price" checked={selectedPrice==='free'} onChange={()=>setSelectedPrice('free')} className="mr-2" /> Free
                </label>
                <label className="flex items-center mb-1">
                  <input type="radio" name="price" checked={selectedPrice==='paid'} onChange={()=>setSelectedPrice('paid')} className="mr-2" /> Paid
                </label>
              </div>
              
              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Rating</h3>
                <label className="flex items-center mb-1">
                  <input type="radio" name="rating" checked={selectedRating==='all'} onChange={()=>setSelectedRating('all')} className="mr-2" /> All
                </label>
                {RATINGS.map(rating => (
                  <label key={rating} className="flex items-center mb-1">
                    <input type="radio" name="rating" checked={selectedRating===String(rating)} onChange={()=>setSelectedRating(String(rating))} className="mr-2" />
                    <span className="flex items-center">
                      {[...Array(5)].map((_,i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400':'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      &nbsp;{rating}+
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white shadow-md p-6 rounded-lg mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Course Catalog</h1>
                  <p className="text-gray-600 mt-1">{filteredCourses.length} courses available</p>
                </div>
                
                {/* Mobile sidebar toggle */}
                <button 
                  className="lg:hidden px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  onClick={() => setSidebarOpen(true)}
                >
                  Show Filters
                </button>
              </div>
              
              {/* Search and Sort */}
              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
            
            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            
            {/* No Results */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-80 h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Filters</h2>
                <button 
                  className="p-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Category */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Category</h3>
                <ul>
                  <li>
                    <button 
                      onClick={() => setSelectedCategory('all')} 
                      className={`block w-full text-left px-2 py-1 rounded ${selectedCategory==='all'?'bg-primary-100 text-primary-700':''}`}
                    >
                      All
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.name}>
                      <button 
                        onClick={() => setSelectedCategory(cat.name)} 
                        className={`block w-full text-left px-2 py-1 rounded ${selectedCategory===cat.name?'bg-primary-100 text-primary-700':''}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Level */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Level</h3>
                {LEVELS.map(level => (
                  <label key={level} className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={selectedLevels.includes(level)}
                      onChange={() => handleLevelChange(level)}
                      className="mr-2"
                    />
                    {level}
                  </label>
                ))}
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Price</h3>
                <label className="flex items-center mb-1">
                  <input type="radio" name="price" checked={selectedPrice==='all'} onChange={()=>setSelectedPrice('all')} className="mr-2" /> All
                </label>
                <label className="flex items-center mb-1">
                  <input type="radio" name="price" checked={selectedPrice==='free'} onChange={()=>setSelectedPrice('free')} className="mr-2" /> Free
                </label>
                <label className="flex items-center mb-1">
                  <input type="radio" name="price" checked={selectedPrice==='paid'} onChange={()=>setSelectedPrice('paid')} className="mr-2" /> Paid
                </label>
              </div>
              
              {/* Rating */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Rating</h3>
                <label className="flex items-center mb-1">
                  <input type="radio" name="rating" checked={selectedRating==='all'} onChange={()=>setSelectedRating('all')} className="mr-2" /> All
                </label>
                {RATINGS.map(rating => (
                  <label key={rating} className="flex items-center mb-1">
                    <input type="radio" name="rating" checked={selectedRating===String(rating)} onChange={()=>setSelectedRating(String(rating))} className="mr-2" />
                    <span className="flex items-center">
                      {[...Array(5)].map((_,i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400':'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      &nbsp;{rating}+
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;