import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react'; // Add import for MapPin icon


const Quest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [solarLoading, setSolarLoading] = useState(false); // New loading state for solar data
  const [solarRadiation, setSolarRadiation] = useState(null);
  const [waterLocation, setWaterLocation] = useState(''); // Added for the new UI
  const [answers, setAnswers] = useState({
    propertyType: '',
    occupants: '',
    rooms: '',
    currentHeating: '',
    budget: '',
    location: '',
    sunlightHours: '',
    existingSystem: '',
    timeline: 'Just researching', // Default value for timeline since we removed the question
    waterSource: '',
    'waterSource-other': '',
    'propertyType-other': '',
    'existingSystem-other': '',
  });

  // List of Kenya's 47 counties
  const kenyaCounties = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo Marakwet', 'Embu', 'Garissa', 
    'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 
    'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 
    'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 
    'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 
    'Siaya', 'Taita Taveta', 'Tana River', 'Tharaka Nithi', 'Trans Nzoia', 'Turkana', 
    'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
  ];

  // Handle location change for the new UI
  const handleLocationChange = (e) => {
    const location = e.target.value;
    setWaterLocation(location);
    handleAnswer('location', location);
  };

  // Dynamic question based on property type
  const getOccupancyQuestion = () => {
    switch(answers.propertyType) {
      case 'Residential Home':
        return {
          id: 'occupants',
          question: '2. How many people typically use hot water?',
          input: {
            type: 'number',
            placeholder: 'Enter number of people e.g. 1, 2, 3...'
          }
        };
      case 'Apartment Building':
        return {
          id: 'rooms',
          question: '2. How many apartment units are in the building?',
          input: {
            type: 'number',
            placeholder: 'Enter number of apartment units'
          }
        };
      case 'Hotel/Resort':
        return {
          id: 'rooms',
          question: '2. How many rooms does your hotel/resort have?',
          input: {
            type: 'number',
            placeholder: 'Enter number of rooms'
          }
        };
      case 'Commercial Business':
        return {
          id: 'occupants',
          question: '2. How many people use hot water in your business on average?',
          input: {
            type: 'number',
            placeholder: 'Enter approximate number of users'
          }
        };
      default:
        return {
          id: 'occupants',
          question: '2. How many people typically use hot water?',
          input: {
            type: 'number',
            placeholder: 'Enter number of people'
          }
        };
    }
  };

  const questions = [
    {
      id: 'propertyType',
      question: '1. What type of property is this for?',
      options: ['Residential Home', 'Apartment Building', 'Commercial Business', 'Hotel/Resort', 'Other']
    },
    // Question 2 is dynamically generated based on property type
    {
      id: 'budget',
      question: '3. What is your estimated budget for this system?',
      input: {
        type: 'text',
        placeholder: 'Enter your budget in KSH...'
      }
    },
    {
      id: 'location',
      question: '4. Where is your property located?',
      customUI: true // Mark this question for custom UI rendering
    },
    {
      id: 'existingSystem',
      question: '5. What type of roof does your property have?',
      options: ['Flat', 'Tiles', 'Pitched(Mabati)', 'Other']
    },
    {
      id: 'waterSource',
      question: '6. What is your main source of water?',
      options: [
        'Municipal water (Maji ya Kanjo)',
        'Borehole water',
        'Rainwater',
        'Other'
      ]
    },
    {
      id:'systemType',
      question: '7. What type of system are you interested in?',
      options: [
        'Solar Panels',
        'Heat Pumps'
        
      ]
    }
  ];

  const fetchSolarRadiation = async (location) => {
    try {
      setSolarLoading(true); // Set solar loading to true
      setSolarRadiation(null); // Reset previous data
      const res = await fetch(`/solar/radiation?location=${encodeURIComponent(location)}`);
      if (res.ok) {
        const data = await res.json();
        // Get the annual average from the response
        const annualAverage = data.annual_average || null;
        setSolarRadiation(annualAverage);
        setAnswers(prev => ({
          ...prev,
          sunlightHours: annualAverage || ''
        }));
      } else {
        console.error('Failed to fetch solar radiation');
        setSolarRadiation(null);
      }
    } catch (err) {
      console.error('Error fetching radiation data:', err);
      setSolarRadiation(null);
    } finally {
      setSolarLoading(false); // Set solar loading to false
    }
  };

  const handleAnswer = async (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // When location is selected, fetch solar radiation data
    if (questionId === 'location' && answer) {
      fetchSolarRadiation(answer);
    }
  };

  // Determine if form is incomplete
  const isFormIncomplete = () => {
    // Check property type
    if (!answers.propertyType) return true;
    
    // Check dynamically generated question based on property type
    if (answers.propertyType === 'Residential Home' || answers.propertyType === 'Commercial Business') {
      if (!answers.occupants) return true;
    } else if (answers.propertyType === 'Apartment Building' || answers.propertyType === 'Hotel/Resort') {
      if (!answers.rooms) return true;
    } else if (answers.propertyType === 'Other' && !answers['propertyType-other']) {
      return true;
    }
    
    // Check other required fields
    if (!answers.budget || !answers.location || !answers.existingSystem || 
        !answers.waterSource || !answers.systemType) {
      return true;
    }
    
    // Check "Other" fields
    if (answers.existingSystem === 'Other' && !answers['existingSystem-other']) return true;
    if (answers.waterSource === 'Other' && !answers['waterSource-other']) return true;
    
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const finalAnswers = { ...answers };

    // Handle "Other" options
    if (finalAnswers.propertyType === 'Other' && finalAnswers['propertyType-other']) {
      finalAnswers.propertyType = finalAnswers['propertyType-other'];
    }
    if (finalAnswers.existingSystem === 'Other' && finalAnswers['existingSystem-other']) {
      finalAnswers.existingSystem = finalAnswers['existingSystem-other'];
    }
    if (finalAnswers.waterSource === 'Other' && finalAnswers['waterSource-other']) {
      finalAnswers.waterSource = finalAnswers['waterSource-other'];
    }

    // Set electricitySource to "solar" as requested
    finalAnswers.electricitySource = 'solar';
    
    // Ensure timeline is included even though we removed the question
    if (!finalAnswers.timeline) {
      finalAnswers.timeline = 'Just researching';
    }
    
    // Convert values to strings as expected by the API
    const apiPayload = {
      propertyType: String(finalAnswers.propertyType || ''),
      occupants: String(finalAnswers.occupants || finalAnswers.rooms || ''),
      budget: String(finalAnswers.budget || ''),
      location: String(finalAnswers.location || ''),
      existingSystem: String(finalAnswers.existingSystem || ''),
      timeline: String(finalAnswers.timeline || 'Just researching'),
      waterSource: String(finalAnswers.waterSource || ''),
      electricitySource: 'solar',
      systemType: String(finalAnswers.systemType || ''),
    };

    try {
      console.log("Submitting answers:", apiPayload);
      
      const response = await fetch('/recommend', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data from backend:", data);
        navigate('/system-sizing', { state: { backendData: data } });
      } else {
        console.error("Failed to submit:", response.status);
        console.log("answers", apiPayload);
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert("Error submitting... Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize waterLocation from answers when component loads or answers.location changes
  useEffect(() => {
    setWaterLocation(answers.location || '');
  }, [answers.location]);

  // Dynamically generate question 2 based on property type
  const dynamicQuestion = getOccupancyQuestion();
  
  // Insert dynamically generated question at position 1 (after property type)
  const allQuestions = [
    questions[0],  // Property type question
    dynamicQuestion, // Dynamic question based on property type
    ...questions.slice(1) // All remaining questions
  ];

  // Render location question with custom UI
  const renderLocationQuestion = (q) => {
    return (
      <div key={q.id} className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{q.question}</h3>
        
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-4">
            <div className="flex items-center">
              <MapPin className="mr-1 h-5 w-5 text-gray-500" />
              County Location
            </div>
          </h3>
          <div className="relative rounded-md shadow-sm">
            <select
              name="location"
              id="location"
              value={waterLocation}
              onChange={handleLocationChange}
              className="block w-full rounded-md border-gray-300 border p-3 focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a county</option>
              {kenyaCounties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            This helps us recommend systems suitable for your location's climate and conditions.
          </p>
        </div>
        
        {/* Loading state for solar radiation */}
        {solarLoading && (
          <div className="mt-3 p-4 bg-blue-50 rounded-md">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-700 font-medium">Loading solar radiation data for {answers.location}...</p>
            </div>
          </div>
        )}
        
        {/* Display solar radiation data when available */}
        {!solarLoading && solarRadiation !== null && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              </span>
              <h4 className="text-blue-800 font-semibold">Solar Radiation Data for {answers.location}</h4>
            </div>
            <div className="bg-yellow-100 p-2 rounded-md inline-block my-2">
              <p className="font-semibold text-yellow-800">Annual Average: {solarRadiation} kWh/m²/day</p>
            </div>
            <p className="text-blue-700 text-sm">This solar radiation value will be used to calculate the optimal solar hot water system for your location.</p>
          </div>
        )}

        {/* Error state when solar data fails to load */}
        {!solarLoading && answers.location && solarRadiation === null && (
          <div className="mt-3 p-3 bg-red-50 rounded-md">
            <p className="text-red-700 text-sm">
              Unable to fetch solar radiation data for {answers.location}. You can still proceed with the questionnaire.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Solar System Questionnaire
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Please answer these 7 questions to help us recommend the perfect solar solution for your needs.
        </p>

        <div className="space-y-8">
          {allQuestions.map((q) => {
            // Use custom UI for location question
            if (q.id === 'location' && q.customUI) {
              return renderLocationQuestion(q);
            }
            
            return (
              <div key={q.id} className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{q.question}</h3>
                <div className="space-y-2">
                  {q.input ? (
                    <input
                      type={q.input.type}
                      placeholder={q.input.placeholder}
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ) : q.dropdown ? (
                    <div>
                      <select
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select a county</option>
                        {q.dropdown.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <>
                      {q.options.map((option, idx) => (
                        <div key={`${q.id}-${idx}`} className="flex items-center">
                          <input
                            type="radio"
                            id={`${q.id}-${option}`}
                            name={q.id}
                            checked={answers[q.id] === option}
                            onChange={() => handleAnswer(q.id, option)}
                            className="h-4 w-4 text-primary_yellow focus:ring-primary_yellow"
                          />
                          <label htmlFor={`${q.id}-${option}`} className="ml-3 text-gray-700">
                            {option}
                          </label>
                        </div>
                      ))}
                      {answers[q.id] === 'Other' && (
                        <input
                          type="text"
                          placeholder="Please specify"
                          value={answers[`${q.id}-other`] || ''}
                          onChange={(e) =>
                            setAnswers(prev => ({
                              ...prev,
                              [`${q.id}-other`]: e.target.value
                            }))
                          }
                          className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-8">
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isFormIncomplete() || loading}
            className={`px-6 py-2 rounded-md text-white flex items-center ${
              isFormIncomplete() || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary_yellow hover:bg-blue-600'
            }`}
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {loading ? "Submitting..." : "Get personalized recommendation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quest;