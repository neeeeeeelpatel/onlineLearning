import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../utils/mockData';
import { getUserData } from '../utils/authUtils';
import Navbar from '../components/Navbar';
import { CheckCircleIcon, CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/solid';

const PaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // Load course data
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
    setIsLoading(false);
    
    // Check if course is already purchased
    const purchasedCourses = JSON.parse(localStorage.getItem('purchased_courses') || '[]');
    if (purchasedCourses.includes(parseInt(courseId))) {
      setPaymentSuccess(true);
    }
  }, [courseId, navigate]);
  
  // Apply coupon code
  const applyCoupon = () => {
    // Reset previous error
    setCouponError('');
    
    // Mock coupon codes
    const validCoupons = {
      'NEXTRA10': 10,
      'NEXTRA20': 20,
      'NEXTRA50': 50,
      'WELCOME25': 25
    };
    
    if (!couponCode) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    const couponDiscount = validCoupons[couponCode.toUpperCase()];
    if (couponDiscount) {
      setDiscount(couponDiscount);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setDiscount(0);
    }
  };
  
  // Calculate final price
  const calculateFinalPrice = () => {
    if (!course) return 0;
    
    // If course already has a discount price, use that as the base
    const basePrice = course.discountPrice || course.price;
    
    // Apply coupon discount if any
    if (discount > 0) {
      return basePrice - (basePrice * (discount / 100));
    }
    
    return basePrice;
  };
  
  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Handle payment
  const handlePayment = () => {
    setPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Save purchased course to localStorage
      const purchasedCourses = JSON.parse(localStorage.getItem('purchased_courses') || '[]');
      if (!purchasedCourses.includes(parseInt(courseId))) {
        purchasedCourses.push(parseInt(courseId));
        localStorage.setItem('purchased_courses', JSON.stringify(purchasedCourses));
      }
      
      // Save payment history
      const paymentHistory = JSON.parse(localStorage.getItem('payment_history') || '[]');
      paymentHistory.push({
        id: Date.now(),
        courseId: parseInt(courseId),
        courseName: course.title,
        amount: calculateFinalPrice(),
        date: new Date().toISOString(),
        paymentMethod: paymentMethod,
        transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
      localStorage.setItem('payment_history', JSON.stringify(paymentHistory));
      
      setPaymentProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };
  
  // Handle continue to course
  const handleContinueToCourse = () => {
    navigate(`/course-player/${courseId}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
          <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/courses')} 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Payment Success */}
          {paymentSuccess ? (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6 sm:p-10 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                  <CheckCircleIcon className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h2>
                <p className="mt-2 text-gray-600">
                  Thank you for purchasing {course.title}. You now have full access to this course.
                </p>
                <div className="mt-8">
                  <button
                    onClick={handleContinueToCourse}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Start Learning Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h1 className="text-xl font-semibold text-gray-900">Checkout</h1>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:space-x-8">
                  {/* Course Summary */}
                  <div className="md:w-1/2">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden">
                        <img 
                          src={course.thumbnail || 'https://via.placeholder.com/150'} 
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{course.title}</h3>
                        <p className="mt-1 text-sm text-gray-500">By {course.instructor}</p>
                        <div className="mt-2 flex items-center">
                          {course.discountPrice ? (
                            <>
                              <span className="text-lg font-medium text-gray-900">{formatPrice(course.discountPrice)}</span>
                              <span className="ml-2 text-sm text-gray-500 line-through">{formatPrice(course.price)}</span>
                              <span className="ml-2 text-sm text-green-600">
                                {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% off
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-medium text-gray-900">{formatPrice(course.price)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Coupon Code */}
                    <div className="mt-6">
                      <label htmlFor="coupon" className="block text-sm font-medium text-gray-700">
                        Coupon Code
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="coupon"
                          id="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="focus:ring-primary-500 focus:border-primary-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                          placeholder="Enter coupon code"
                        />
                        <button
                          type="button"
                          onClick={applyCoupon}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="mt-2 text-sm text-red-600">{couponError}</p>
                      )}
                      {discount > 0 && (
                        <p className="mt-2 text-sm text-green-600">
                          Coupon applied! {discount}% discount
                        </p>
                      )}
                    </div>
                    
                    {/* Price Breakdown */}
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <dl className="space-y-2">
                        <div className="flex items-center justify-between">
                          <dt className="text-sm text-gray-600">Original Price</dt>
                          <dd className="text-sm font-medium text-gray-900">{formatPrice(course.price)}</dd>
                        </div>
                        
                        {course.discountPrice && course.discountPrice < course.price && (
                          <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Course Discount</dt>
                            <dd className="text-sm font-medium text-green-600">
                              -{formatPrice(course.price - course.discountPrice)}
                            </dd>
                          </div>
                        )}
                        
                        {discount > 0 && (
                          <div className="flex items-center justify-between">
                            <dt className="text-sm text-gray-600">Coupon Discount ({discount}%)</dt>
                            <dd className="text-sm font-medium text-green-600">
                              -{formatPrice((course.discountPrice || course.price) * (discount / 100))}
                            </dd>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                          <dt className="text-base font-medium text-gray-900">Total</dt>
                          <dd className="text-base font-medium text-gray-900">{formatPrice(calculateFinalPrice())}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div className="md:w-1/2 mt-8 md:mt-0">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                    
                    <div className="space-y-4">
                      {/* Credit/Debit Card */}
                      <div className="relative">
                        <div className="flex items-center">
                          <input
                            id="card"
                            name="paymentMethod"
                            type="radio"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                          />
                          <label htmlFor="card" className="ml-3 flex items-center">
                            <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="block text-sm font-medium text-gray-700">Credit/Debit Card</span>
                          </label>
                        </div>
                        
                        {paymentMethod === 'card' && (
                          <div className="mt-4 rounded-md border border-gray-300 p-4">
                            <div className="mb-4">
                              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                Card Number
                              </label>
                              <input
                                type="text"
                                name="cardNumber"
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  name="expiry"
                                  id="expiry"
                                  placeholder="MM/YY"
                                  className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                              <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  name="cvv"
                                  id="cvv"
                                  placeholder="123"
                                  className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name on Card
                              </label>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="John Doe"
                                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* UPI */}
                      <div>
                        <div className="flex items-center">
                          <input
                            id="upi"
                            name="paymentMethod"
                            type="radio"
                            checked={paymentMethod === 'upi'}
                            onChange={() => setPaymentMethod('upi')}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                          />
                          <label htmlFor="upi" className="ml-3 block text-sm font-medium text-gray-700">
                            UPI
                          </label>
                        </div>
                        
                        {paymentMethod === 'upi' && (
                          <div className="mt-4 rounded-md border border-gray-300 p-4">
                            <div>
                              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                                UPI ID
                              </label>
                              <input
                                type="text"
                                name="upiId"
                                id="upiId"
                                placeholder="username@upi"
                                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Net Banking */}
                      <div>
                        <div className="flex items-center">
                          <input
                            id="netbanking"
                            name="paymentMethod"
                            type="radio"
                            checked={paymentMethod === 'netbanking'}
                            onChange={() => setPaymentMethod('netbanking')}
                            className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                          />
                          <label htmlFor="netbanking" className="ml-3 block text-sm font-medium text-gray-700">
                            Net Banking
                          </label>
                        </div>
                        
                        {paymentMethod === 'netbanking' && (
                          <div className="mt-4 rounded-md border border-gray-300 p-4">
                            <div>
                              <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                                Select Bank
                              </label>
                              <select
                                id="bank"
                                name="bank"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                              >
                                <option value="">Select a bank</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                                <option value="kotak">Kotak Mahindra Bank</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Secure Payment Notice */}
                    <div className="mt-6 flex items-center">
                      <LockClosedIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-500">
                        Payments are secure and encrypted. Your payment information is never stored.
                      </p>
                    </div>
                    
                    {/* Pay Button */}
                    <div className="mt-8">
                      <button
                        type="button"
                        onClick={handlePayment}
                        disabled={paymentProcessing}
                        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {paymentProcessing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing Payment...
                          </>
                        ) : (
                          <>Pay {formatPrice(calculateFinalPrice())}</>
                        )}
                      </button>
                    </div>
                    
                    {/* Demo Notice */}
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        This is a demo payment page. No actual payment will be processed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;