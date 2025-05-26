import React, { useState, useEffect } from 'react';
import { BiMicrophone, BiStop, BiSun, BiX } from 'react-icons/bi';
import { LuMessageSquarePlus } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const System_Advisor = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false); // New state to toggle microphone/cross
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (listening) setQuery(transcript);
  }, [transcript, listening]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    SpeechRecognition.stopListening();
    resetTranscript();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/triage", {
        user_query: query,
      });

      if (response.data?.generated_questions) {
        // Redirect to QuestionFlow and pass the data
        navigate("/question-flow", {
          state: {
            questions: response.data.generated_questions,
            userQuery: query
          }
        });
      } else {
        throw new Error("Unexpected question format");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to fetch questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    setIsMicActive((prev) => !prev);
    if (isMicActive) {
      setQuery(''); // Clear the input if the mic is deactivated
      SpeechRecognition.stopListening(); // Stop listening when cross is clicked
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true }); // Start listening when mic is clicked
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-3xl w-full text-center py-4">
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Solar System Advisor
        </h1>
        <p className="text-gray-600 text-lg md:text-xl opacity-85 mt-2">
          Tell us about your hot water needs, and we'll help you find the perfect solar solution.
        </p>

        <div className="mt-6">
          
          <button
            onClick={() => navigate('/questionnaire')}
            className="mt-2 px-4 py-2 border border-gray-500 text-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            Start from the Questionnaire
          </button>
        </div>
        <p className="text-gray-600 mt-6">OR</p>
      
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 mt-6 rounded-lg shadow-md"
        >
          <h2 className="font-semibold text-gray-800 text-xl md:text-2xl flex items-center justify-center gap-2">
            
            Get Personalized Recommendations by Asking a Question on this chat box below.
          </h2>

          <div className="text-sm text-gray-600 mt-2 text-left max-w-md mx-auto">
            <p className="text-lg md:text-xl">Example questions:</p>
            <ul className="list-disc list-inside text-gray-700 text-base">
              <li>"I need a solar water heating system for a family of 4."</li>
              <li>"What options do you have for a hotel with 20 rooms?"</li>
              <li>"I'm interested in solar water heating for my residential building."</li>
            </ul>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your question or describe your needs..."
            className="w-full mt-4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary_yellow text-gray-700"
            rows="4"
            required
          ></textarea>

          <div className="mt-3 text-left">
            <p>Want to talk?</p>
            <div className="flex gap-2 items-center mt-2">
              <button
                type="button"
                onClick={handleMicClick}
                className="relative w-14 h-14 rounded-full"
              >
                {listening && <span className="absolute w-full h-full bg-blue-400 opacity-50 rounded-full animate-ping"></span>}
                {isMicActive ? (
                  <BiX className="p-1 text-red-500 transition-all" size={30} />
                ) : (
                  <BiMicrophone className={`p-1 text-blue-500 transition-all ${listening ? "animate-pulse text-green-500 scale-110" : ""}`} size={30} />
                )}
              </button>
              <button onClick={() => SpeechRecognition.stopListening()} className="flex items-center text-red-500">
                <BiStop size={30} />
                <span className="ml-1">Stop</span>
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-600">{listening ? "Listening..." : "Mic is Off"}</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className={`bg-primary_yellow text-white w-fit px-4 py-2 mt-4 rounded-md flex items-center hover:opacity-80 transition ${isLoading || !query.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Processing..." : "Get Personalized Recommendations"}
              {!isLoading && <LuMessageSquarePlus className="ml-2" size={18} />}
            </button>
          </div>
        </form>

       
      </div>
    </div>
  );
};

export default System_Advisor;
