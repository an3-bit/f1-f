import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Joyce Kimani",
      role: "Solar Solutions Buyer",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "The AI-Solar Water Assistant transformed how we plan our solar installations. It saved us 40% in planning time and helped us optimize our system perfectly for our needs.",
      product: "Solar Water Pumping System",
      rating: 5
    },
    {
      id: 2,
      name: "Job Ogendi",
      role: "Agricultural Engineer",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "As a sales engineer at Davis & Shirtliff, this tool has made my job so much easier. The accurate system recommendations impress clients every time.",
      product: "Solar Irrigation Package",
      rating: 4
    },
    {
      id: 3,
      name: "Anthony Mayaka",
      role: "Water Project Manager",
      image: "https://randomuser.me/api/portraits/men/65.jpg",
      quote: "The AI recommendations match exactly what we would calculate manually, but in seconds instead of hours. It's revolutionized our project planning.",
      product: "Commercial Solar Water System",
      rating: 5
    },
    {
      id: 4,
      name: "George Shiundu",
      role: "Renewable Energy Consultant",
      image: "https://randomuser.me/api/portraits/men/70.jpg",
      quote: "I've recommended this tool to all my clients. The way it streamlines system requirements is unmatched in the industry.",
      product: "Hybrid Solar-Water Solution",
      rating: 5
    },
    {
      id: 5,
      name: "Kelvin Omondi",
      role: "Residential Solar Buyer",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      quote: "As a homeowner, I was confused about what system I needed. This AI assistant explained everything simply and recommended the perfect setup.",
      product: "Residential Solar Water Heater",
      rating: 4
    },
    {
      id: 6,
      name: "Sarah Wambui",
      role: "Energy Consultant",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      quote: "The precision of the system recommendations has helped me win more client proposals. It's become an indispensable tool in my consultancy work.",
      product: "Industrial Solar Solution",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 500);
    }, 6000); // Increased interval to 6 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-200"}`} 
      />
    ));
  };

  const TestimonialCard = ({ testimonial }) => (
    <div className="w-full flex-shrink-0 px-3">
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col border border-gray-100">
        <div className="mb-4 flex justify-between items-start">
          <FaQuoteLeft className="text-blue-400 text-2xl opacity-20" />
          <div className="flex space-x-1">
            {renderStars(testimonial.rating)}
          </div>
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
          "{testimonial.quote}"
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex items-center">
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full border-2 border-blue-100 object-cover mr-3" 
              />
              <div>
                <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              {testimonial.product}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Customer Experiences
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Hear how our AI-Solar Water Assistant is transforming businesses
          </p>
        </div>
        
        <div className="relative overflow-hidden px-2">
          <div 
            className={`flex transition-transform duration-500 ease-in-out ${isTransitioning ? 'opacity-90' : 'opacity-100'}`}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
          
          <div className="flex justify-center mt-8 space-x-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View testimonial from ${testimonials[index].name}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
          >
            Next Testimonial
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;