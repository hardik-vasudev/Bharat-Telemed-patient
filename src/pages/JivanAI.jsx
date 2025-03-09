import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JivanAI.css';

const JivanAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  const synth = window.speechSynthesis;
  let utterance = null;

  recognition.continuous = false;
  recognition.interimResults = false;

  // Load voices once they are available
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

  // Only cancel speech if a message is manually sent.
  const stopSpeaking = () => {
    if (synth.speaking) {
      synth.cancel();
      setSpeaking(false);
    }
  };

  // fromVoice flag indicates if the message comes from voice recognition.
  const handleSend = async (message, fromVoice = false) => {
    if (!message.trim()) return;
    if (!fromVoice) {
      // Cancel ongoing speech only for manual (text) inputs.
      stopSpeaking();
    }

    const userMessage = { sender: 'user', text: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/`,
        { message }
      );
      const botMessage = { sender: 'bot', text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
      speak(response.data.response);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Failed to connect to JivanAI. Please try again.' },
      ]);
    }
    setInput('');
  };

  const speak = (text) => {
    // We don't call stopSpeaking here so that the current utterance can finish naturally.
    utterance = new SpeechSynthesisUtterance(text);
    // Try to select a natural-sounding voice
    const chosenVoice =
      voices.find((voice) => voice.name.includes('Google UK English Male')) || voices[0];
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    synth.speak(utterance);
  };

  const startListening = () => {
    // When starting voice input manually, it's fine to cancel the current speech.
    stopSpeaking();
    setListening(true);
    recognition.start();
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    setInput(speechResult);
    // Mark the message as coming from voice recognition so we don't cancel speech mid-sentence.
    handleSend(speechResult, true);
  };

  recognition.onend = () => setListening(false);

  return (
    <div className="chat-container">
      <h2>JivanAI - Medical Assistant 🩺</h2>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={msg.sender === 'user' ? 'user-message' : 'bot-message'}
          >
            {msg.text}
          </div>
        ))}
        {speaking && <div className="ai-speaking-animation"></div>}
      </div>
      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          className="chat-input"
        />
        <button onClick={() => handleSend(input)} className="send-button">
          Send
        </button>
        <button onClick={startListening} className="voice-button">
          {listening ? '🎙️ Listening...' : '🎙️ Voice Chat'}
        </button>
      </div>
    </div>
  );
};

export default JivanAI;
