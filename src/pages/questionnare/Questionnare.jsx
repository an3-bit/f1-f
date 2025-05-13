import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Quest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({
    propertyType: '',
    occupants: '',
    currentHeating: '',
    budget: '',
    location: '',
    sunlightHours: '',
    existingSystem: '',
    timeline: '',
    waterSource: '',
    electricitySource: '',
    'waterSource-other': '',
    'electricitySource-other': '',
    'propertyType-other': '',
    'existingSystem-other': '',
  });

  const questions = [
    {
      id: 'propertyType',
      question: '1. What type of property is this for?',
      options: ['Residential Home', 'Apartment Building', 'Commercial Business', 'Hotel/Resort', 'Other']
    },
    {
      id: 'occupants',
      question: '2. How many people typically use hot water?',
      input: {
        type: 'text',
        placeholder: 'Enter number of people e.g.1 ,2,3...'
      }
    },
    {
      id: 'budget',
      question: '3. What is your estimated budget for this system?',
      input: {
        type: 'text',
        placeholder: 'Enter your budget in KSHS...'
      }
    },
    {
      id: 'location',
      question: '4. Where would you like the solar water heating system to be installed?',
      input: {
        type: 'text',
        placeholder: 'Enter your desired installation location e.g., Kisumu, Nyeri..'
      }
    },
    {
      id: 'existingSystem',
      question: '5. What type of roof does your property have?',
      options: ['Flat', 'Tiles', 'Pitched(Mabati)', 'Other']
    },
    {
      id: 'timeline',
      question: '6. When are you looking to install the system?',
      options: ['Immediately', 'Within 3 months', 'Within 6 months', 'Just researching']
    },
    {
      id: 'waterSource',
      question: '7. What is your main source of water?',
      options: [
        'Municipal water (Maji ya Kanjo)',
        'Borehole (I have no water pump)',
        'Borehole (I have a water pump)',
        'Rainwater harvesting (Raised Tank)',
        'Rainwater harvesting (Ground Tank)',
        'Other'
      ]
    },
    {
      id: 'electricitySource',
      question: '8. What is your primary source of electricity?',
      options: ['Grid power (KPLC)', 'Generator', 'Solar panels', 'Other']
    }
  ];

  const handleAnswer = async (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Fetch solar radiation data when location is entered
    if (questionId === 'location' && answer.trim().length > 2) {
      try {
        const res = await fetch(`https://f1-backend-t9zk.onrender.com/api/solar/radiation?location=${encodeURIComponent(answer)}`);
        if (res.ok) {
          const data = await res.json();
          // Assuming data.radiation or similar is the key for sunlight hours
          setAnswers(prev => ({
            ...prev,
            location: answer,
            sunlightHours: data.radiation || ''
          }));
        } else {
          console.error('Failed to fetch solar radiation');
        }
      } catch (err) {
        console.error('Error fetching radiation data:', err);
      }
    }
  };

  const isFormIncomplete = questions.some((q) => {
    const value = answers[q.id];
    if (!value) return true;
    if (value === 'Other' && !answers[`${q.id}-other`]) return true;
    return false;
  });

  const handleSubmit = async () => {
    setLoading(true);
    const finalAnswers = { ...answers };

    alert("Recommending systems....Please Wait...");

    questions.forEach((q) => {
      if (finalAnswers[q.id] === 'Other' && finalAnswers[`${q.id}-other`]) {
        finalAnswers[q.id] = finalAnswers[`${q.id}-other`];
      }
    });

    try {
      const response = await fetch('https://f1-backend-t9zk.onrender.com/api/recommend', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalAnswers)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data from backend:", data);
        navigate('/system-sizing', { state: { backendData: data } });
      } else {
        console.error("Failed to submit:", response.status);
        console.log("answers", finalAnswers);
        alert("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert("Error submitting... Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Solar System Questionnaire
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Please answer these 8 questions to help us recommend the perfect solar solution for your needs.
        </p>

        <div className="space-y-8">
          {questions.map((q) => (
            <div key={q.id} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{q.question}</h3>
              <div className="space-y-2">
                {q.input ? (
                  <input
                    type={q.input.type}
                    placeholder={q.input.placeholder}
                    value={answers[q.id]}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
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
          ))}
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
            disabled={isFormIncomplete}
            className={`px-6 py-2 rounded-md text-white ${
              isFormIncomplete
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary_yellow hover:bg-blue-600'
            }`}
          >
            {loading ? "Submitting..." : "Get personalized recommendation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quest;
