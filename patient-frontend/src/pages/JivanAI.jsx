import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JivanAI.css";

export default function JivanAI() {
  const navigate = useNavigate();

  // Chat states
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Voice states
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  // We allow multi-language for STT, but TTS is forced to a single voice
  const [language, setLanguage] = useState("en-GB");

  // Quick suggestions
  const quickSuggestions = [
    "I have a fever",
    "I have a headache",
    "my patient ID is 62da40c1",
    "How to manage diabetes?",
  ];

  // Web Speech API for STT
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  const synth = window.speechSynthesis;
  let utterance = null;

  recognition.continuous = false;
  recognition.interimResults = false;

  // Load TTS voices once available
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };
    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, [synth]);

  // Stop TTS if user types or toggles
  const stopSpeaking = () => {
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
    }
  };

  // Send user message & get AI response
  const handleSend = async (message, fromVoice = false) => {
    if (!message.trim()) return;
    if (!fromVoice) stopSpeaking();

    // Add user message to chat
    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);
      // Ensure your improved main.py is running on this URL
      // e.g. uvicorn main:app --reload --port 8000
      const response = await axios.post("http://127.0.0.1:8000/api/chat/", { message });
      const botMessage = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
      speak(botMessage.text); // TTS
    } catch (error) {
      console.error("Error connecting to JivanAI:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Failed to connect to JivanAI. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
    setInput("");
  };

  // TTS: Force one voice (e.g., Google UK English Male)
  const speak = (text) => {
    utterance = new SpeechSynthesisUtterance(text);

    // We ignore user language for TTS and pick a single voice
    const chosenVoice =
      voices.find((v) => v.name.includes("Google UK English Male")) ||
      voices[0]; // fallback

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
    utterance.lang = chosenVoice ? chosenVoice.lang : "en-GB";

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    synth.speak(utterance);
  };

  // STT in user-selected language
  const startListening = () => {
    stopSpeaking();
    setListening(true);
    recognition.lang = language;
    recognition.start();
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    setInput(speechResult);
    handleSend(speechResult, true);
  };

  recognition.onend = () => setListening(false);

  // Navigate to main menu
  const goToMainMenu = () => {
    navigate("/menu");
  };

  // Handle quick suggestions
  const handleQuickSuggestion = (suggestion) => {
    setInput(suggestion);
    handleSend(suggestion);
  };

  return (
    <div className="jivanai-container">
      {/* Header */}
      <div className="jivanai-header">
        <h2>JivanAI - Your AI Doctor</h2>

        {/* Language Select (STT only) */}
        <div className="lang-select">
          <label htmlFor="language">STT Language:</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en-GB">English (UK)</option>
            <option value="hi-IN">Hindi</option>
            <option value="mr-IN">Marathi</option>
            <option value="bn-IN">Bengali</option>
            <option value="kn-IN">Kannada</option>
            <option value="ta-IN">Tamil</option>
          </select>
        </div>

        <button onClick={goToMainMenu} className="menu-button">
          Main Menu
        </button>
      </div>

      <div className="chat-window">
        {/* Quick Suggestions */}
        <div className="quick-suggestions">
          {quickSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickSuggestion(suggestion)}
              className="suggestion-button"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="messages-container">
          {messages.map((msg, idx) => {
            if (msg.sender === "bot") {
              return (
                <div key={idx} className="bot-message-card">
                  <div className="bot-card-header">AI Doctor Response</div>
                  <div className="bot-card-content">{msg.text}</div>
                </div>
              );
            } else {
              return (
                <div key={idx} className="user-message">
                  {msg.text}
                </div>
              );
            }
          })}
          {loading && <div className="loading-indicator">🤖 Thinking...</div>}
        </div>

        {/* Input & Buttons */}
        <div className="input-container">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your symptoms or ask a question..."
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            className="chat-input"
          />
          <button onClick={() => handleSend(input)} className="send-button">
            Send
          </button>
          <button
            onClick={startListening}
            className={`voice-button ${listening ? "listening" : ""}`}
          >
            {listening ? "🎙️ Listening..." : "🎙️ Voice"}
          </button>
        </div>
      </div>
    </div>
  );
}
