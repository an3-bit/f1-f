import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { BiMicrophone, BiStop } from 'react-icons/bi';

const questionKeyMap = {
  "Q1: What type of property is this for?": "propertyType",
  "Q2: How many occupants will use hot water regularly?": "occupants",
  "Q3: What is your estimated daily hot water consumption in liters?": "waterUsage",
  "Q4: How many floors does the building have?": "floors",
  "Q5: What is your budget range for the solar water heating system?": "budget",
  "Q6: What is your location (city/town)?": "location",
  "Q7: Do you have an existing water heating system? If yes, specify type.": "existingSystem",
  "Q8: What is your preferred installation timeframe for the system?": "timeline",
  "Q9: What is your main water source (e.g., borehole, municipal, rainwater)?": "waterSource",
    "Q10: What is your main electricity source (e.g., grid, solar, generator)?": "electricitySource"
  };

const QuestionFlow = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = React.useMemo(() => location?.state?.questions || [], [location]);

  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [processing, setProcessing] = useState(false);

  const questionRef = useRef(null);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (listening && !isTyping) {
      setQuery(transcript);
    }
  }, [transcript, listening, isTyping]);

  useEffect(() => {
    if (!questions.length) {
      navigate('/', { replace: true });
    }
  }, [questions, navigate]);

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex] || '';
  const progress = Math.round(((currentQuestionIndex) / questions.length) * 100);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update answers state with the current question and answer
    const updatedAnswers = {
      ...answers,
      [questionKeyMap[currentQuestion]]: query.trim(),
    };
    
    setAnswers(updatedAnswers);
    setQuery('');
    resetTranscript();

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, fetch recommendation
      setProcessing(true);
      // Prepare final answers object
      const finalAnswers = { ...updatedAnswers };

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
        // setLoading is not defined, use setProcessing instead
        setProcessing(true);
        alert("Recommending systems....Please Wait...");
        console.log("Submitting answers:", apiPayload);
        
        const response = await fetch('/api/recommend', { 
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
        setProcessing(false);
      }
    }
  };

  const handleStartListening = () => {
    setIsTyping(false);
    SpeechRecognition.startListening({ continuous: false });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleBack = () => {
    if (recommendation) {
      // If showing recommendations, go back to questions
      setRecommendation(null);
      setCurrentQuestionIndex(questions.length - 1);
    } else if (currentQuestionIndex > 0) {
      // Otherwise go back to previous question
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md">
        {processing ? (
          <div className="text-center py-10">
            <p className="text-blue-600 text-lg font-medium animate-pulse">
              Processing your responses...
            </p>
          </div>
        ) : !recommendation ? (
          <>
            <div className="mb-2 text-sm text-gray-500">
              Progress: {progress}% completed
            </div>
            <h2
              ref={questionRef}
              className="text-xl md:text-2xl font-semibold text-gray-800 mb-4"
            >
              {currentQuestion || "Loading question..."}
            </h2>
            <form onSubmit={handleAnswerSubmit}>
              <textarea
                value={query}
                onChange={(e) => {
                  setIsTyping(true);
                  setQuery(e.target.value);
                }}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                placeholder="Type or speak your answer..."
                required
              />
              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleStartListening}
                  disabled={listening}
                  className="relative w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 hover:bg-blue-200 disabled:opacity-40"
                >
                  {listening && (
                    <span className="absolute w-full h-full bg-blue-400 opacity-50 rounded-full animate-ping"></span>
                  )}
                  <BiMicrophone
                    size={24}
                    className={`text-blue-600 ${
                      listening ? 'animate-pulse text-green-500 scale-110' : ''
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleStopListening}
                  disabled={!listening}
                  className="text-red-500 hover:text-red-600 disabled:opacity-40"
                >
                  <BiStop size={26} />
                </button>
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className={`ml-auto px-6 py-2 rounded-md text-white transition ${
                    query.trim()
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {currentQuestionIndex === questions.length - 1
                    ? 'Submit'
                    : 'Next'}
                </button>
              </div>
              <p className="text-sm mt-2 text-gray-500" aria-live="polite">
                {listening ? 'Listening...' : 'Mic is off'}
              </p>
            </form>
            
            {currentQuestionIndex > 0 && (
              <div className="mt-4">
                <button
                  onClick={handleBack}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Back to previous question
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="container mx-auto p-4 mb-4 rounded-xl">
            <h1 className="text-2xl font-bold mb-6">Recommended Systems</h1>
            
            {recommendation && recommendation.recommended_systems && recommendation.recommended_systems.length > 0 ? (
              <div className="space-y-6">
                {recommendation.recommended_systems.map((system, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                  >
                    <h2 className="text-xl font-semibold text-blue-700">
                      {system.name}
                    </h2>
                    <div className="mt-2">
                      <strong>System Model: </strong>
                      {system.model}
                    </div>
                    <p className="mt-2 text-gray-700">
                      {system.description}
                    </p>

                    <ul className="mt-3 space-y-1 text-sm text-gray-800">
                      <li>
                        <strong>Capacity:</strong> {system.specifications?.tank_capacity || 'Not specified'}
                      </li>
                      <li>
                        <strong>Collector Type:</strong> {system.specifications?.collector_type || 'Not specified'}
                      </li>
                      
                      {system.specifications?.number_of_tubes && (
                        <li>
                          <strong>Number of Tubes:</strong> {system.specifications.number_of_tubes}
                        </li>
                      )}
                    </ul>

                  
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-red-600">No recommended systems available.</p>
              </div>
            )}

            {recommendation && recommendation.reasoning && (
              <div className="mt-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Reasoning
                </h3>
                <p className="text-gray-800">{recommendation.reasoning}</p>
              </div>
            )}

            {recommendation && recommendation.additional_considerations && recommendation.additional_considerations.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Additional Considerations
                </h3>
                <ul className="list-decimal ml-6 text-gray-800 space-y-1">
                  {recommendation.additional_considerations.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-pink-100 rounded-xl p-4 mt-8 flex justify-between items-center">
              <p className="font-bold">NOT SATISFIED?</p>
              <button
                onClick={handleBack}
                className="hover:scale-105 hover:opacity-90 duration-300 transition-all flex bg-red-500 px-4 py-2 text-white font-semibold rounded-xl justify-center items-center gap-2"
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionFlow;