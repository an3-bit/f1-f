import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  BiSend,
  BiLoaderAlt,
  BiMicrophone,
  BiMicrophoneOff,
  BiVolumeFull,
  BiVolumeMute,
  BiX,
  BiTrash
} from 'react-icons/bi';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { marked } from 'marked';


const LANGUAGES = [
  { label: 'English (US)', code: 'en-US' },
  { label: 'French', code: 'fr-FR' },
  { label: 'Swahili', code: 'sw-KE' },
  { label: 'Spanish', code: 'es-ES' },
  { label: 'German', code: 'de-DE' }
];

const ProductManual = () => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [language, setLanguage] = useState('en-US');
  const [errorMsg, setErrorMsg] = useState('');
  const [isMicActive, setIsMicActive] = useState(false); // New state to toggle microphone/cross

  const recognitionRef = useRef(null);

  // Setup Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuestion((prev) => prev + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text) => {
    if (!isSpeaking || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleMuteToggle = () => {
    // Cancel any ongoing speech when muting
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // New user message
    const newUserMessage = { role: 'user', content: question };
    const updatedChatHistory = [...chatHistory, newUserMessage];

    // Update UI
    setChatHistory(updatedChatHistory);
    setIsLoading(true);
    setQuestion('');
    setErrorMsg('');

    // Simplified Payload for Debugging
    const payload = {
      question: question.trim(),
      chat_history: []
    };

    console.log("Payload being sent to backend:", payload);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/question',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("Response from backend:", response.data);

      const botReply = response.data.answer || 'No answer returned.';
      const newBotMessage = {
        role: 'assistant',
        content: marked.parse(botReply),
      };

      setChatHistory(prev => [...prev, newBotMessage]);
      speak(botReply);
    } catch (error) {
      console.error('Full error:', error);
      if (error.response) {
        // Handle specific API response errors
        console.error('Error response:', error.response.data);
        setErrorMsg(error.response.data.message || 'Something went wrong on the server side.');
      } else if (error.request) {
        // No response received
        console.error('Error request:', error.request);
        setErrorMsg('No response from the server. Please check your connection.');
      } else {
        // Other errors
        console.error('Error message:', error.message);
        setErrorMsg('An unknown error occurred. Please try again.');
      }

      // Revert on error
      setChatHistory(chatHistory);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicClick = () => {
    setIsMicActive((prev) => !prev);
    if (isMicActive) {
      setQuestion(''); // Clear the input if the mic is deactivated
      stopListening();  // Stop listening when cross is clicked
    } else {
      startListening();  // Start listening when mic is clicked
    }
  };

  const clearChat = () => {
    // Stop any ongoing speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setChatHistory([]);
    setQuestion('');
    setErrorMsg('');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-blue-100 flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-700 flex justify-center items-center gap-2">
            <AiOutlineQuestionCircle size={32} />
            Product Manual Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Ask anything about your Davis & Shirtliff solar water heating system.
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 border rounded-md text-sm bg-white shadow-sm"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
            <button
              onClick={clearChat}
              className="p-2 rounded-md border text-red-600 hover:bg-red-50 transition flex items-center gap-1 text-sm"
              title="Clear Chat History"
            >
              <BiTrash size={16} />
              Clear Chat
            </button>
          </div>

          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-full border text-blue-600 hover:bg-blue-50 transition"
            title={isSpeaking ? 'Mute Voice' : 'Unmute Voice'}
          >
            {isSpeaking ? <BiVolumeFull size={20} /> : <BiVolumeMute size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px] pr-2">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`whitespace-pre-wrap max-w-[80%] px-4 py-3 rounded-lg shadow text-sm ${msg.role === 'user'
                ? 'bg-green-100 self-end text-green-900'
                : 'bg-blue-100 self-start text-blue-900'
                }`}
              dangerouslySetInnerHTML={{ __html: msg.content }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-2 items-center">
          <textarea
            rows={2}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ask about installation, maintenance, models..."
            required
          />
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-3 rounded-full border transition ${isMicActive ? 'bg-red-100 border-red-300 text-red-600' : 'bg-gray-100 border-gray-300 text-gray-700'
              }`}
            title={isMicActive ? 'Stop Listening' : 'Start Listening'}
          >
            {isMicActive ? <BiX size={20} /> : <BiMicrophone size={20} />}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md transition disabled:opacity-60"
          >
            {isLoading ? <BiLoaderAlt className="animate-spin" size={20} /> : <BiSend size={20} />}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 text-red-600 border border-red-300 bg-red-50 rounded-md">
            {errorMsg}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default ProductManual;
