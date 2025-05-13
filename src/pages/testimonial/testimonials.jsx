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
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar 
        key={i} 
        className={`w-4 h-4 mr-1 ${i < rating ? "text-yellow-400" : "text-gray-300"}`} 
      />
    ));
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">What Our Clients Say</h2>
        <p className="text-lg text-gray-600 mb-12">Trusted by professionals across East Africa</p>
        
        <div className="relative overflow-hidden">
          <div 
            className={`flex transition-transform duration-500 ease-in-out ${isTransitioning ? 'opacity-90' : 'opacity-100'}`}
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                <div className="bg-white p-8 rounded-xl shadow-lg relative">
                  <FaQuoteLeft className="text-blue-500 text-3xl opacity-30 mb-4" />
                  <p className="text-lg text-gray-700 italic mb-8 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-16 h-16 rounded-full border-4 border-blue-500 object-cover mr-4" 
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                        <div className="flex mt-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      <span className="font-bold">Product:</span> {testimonial.product}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;