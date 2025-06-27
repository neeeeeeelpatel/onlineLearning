import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    instructor,
    category,
    level,
    rating,
    reviews,
    students,
    price,
    discountPrice,
    thumbnail,
    description,
    duration,
    isBestseller,
    isNew,
  } = course;

  // Calculate discount percentage
  const discountPercentage = price && discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  // Truncate description
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 relative">
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-44 object-cover"
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
        {isBestseller && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded shadow">Bestseller</div>
        )}
        {isNew && !isBestseller && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">New</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[48px]">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">{instructor}</p>
        <div className="flex items-center mb-2">
          <span className="flex items-center text-yellow-500 mr-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400':'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
          </span>
          <span className="text-sm font-medium text-gray-700 mr-1">{rating}</span>
          <span className="text-xs text-gray-500">({reviews})</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          {students?.toLocaleString()} students
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {category}
          </span>
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {level}
          </span>
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {duration}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3 min-h-[32px]">{truncateDescription(description, 60)}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {discountPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ${discountPrice}
                </span>
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">${price}</span>
            )}
          </div>
          <Link
            to={`/courses/${id}`}
            className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;