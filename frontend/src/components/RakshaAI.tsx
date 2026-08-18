import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Mic, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { RakshaMascot } from './RakshaMascot';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  'what is phishing?': 'Phishing is when hackers send fake emails or messages that look like they are from Netflix, Google, or your school. They want you to click a link and type your password so they can steal your account!',
  'can i share otp?': 'NO! Never share your One-Time Password (OTP) or UPI PIN with anyone, not even if they claim they are from your bank, the police, or a support center. OTP is the secret key to your money and accounts.',
  'what is cyber bullying?': 'Cyberbullying is when people use the internet, games, or social apps to send mean, hateful, or embarrassing messages to someone. If you or someone you know is bullied, tell your parents or report it on 1930 immediately.',
  'what is ransomware?': 'Ransomware is a bad virus that locks all the files on your computer. The hacker demands you pay them money (a ransom) to unlock it. Avoid downloading game mods or cheats from untrusted sites, as they often contain ransomware!',
  'is this message fake?': 'Scam messages usually have: 1) Spelling mistakes, 2) Strange links (like bank-login-support.net instead of bank.com), 3) Urgent warnings ("Renew now or your eSIM will be blocked in 30 minutes!"), or 4) Offers of free cash/diamonds.',
  'what should i do if i get scammed?': 'If your family loses money or you get hacked, do not panic! Immediately call the National Cyber Crime Helpline at 1930. The cyber cell can freeze the scammer\'s account if you call them quickly.'
};

export const RakshaAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello Student! I am Raksha, your AI Cyber Guide. Ask me anything about staying safe online!' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const quickReplies = [
    "What is phishing?",
    "Can I share OTP?",
    "Is this message fake?",
    "What is ransomware?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Text-To-Speech (TTS)
  const speakText = (text: string) => {
    if (!speechEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1; // Friendly slightly higher pitch
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // Speech-To-Text (STT)
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try Google Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      setInputValue(speechToText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    // Formulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const query = text.toLowerCase().trim().replace(/[?.!]/g, '');
      
      let answer = "I'm not fully sure about that specific query. Try asking me about 'phishing', 'sharing OTPs', or 'ransomware'!";
      
      // Match from knowledge base
      for (const key of Object.keys(KNOWLEDGE_BASE)) {
        if (query.includes(key) || key.includes(query)) {
          answer = KNOWLEDGE_BASE[key];
          break;
        }
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: answer }]);
      speakText(answer);
    }, 1200);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white rounded-full shadow-lg shadow-violet-500/20 active:scale-95 transition-all flex items-center justify-center border border-violet-400/20 relative group"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 bg-rose-500 w-3 h-3 rounded-full border-2 border-slate-950"></span>
          <span className="absolute right-14 bg-slate-950/80 border border-white/5 text-slate-200 text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Ask Raksha AI
          </span>
        </button>
      )}

      {/* Chatbox Panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] glass-panel-strong rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-cyan-400"></div>

          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-900/40">
            <div className="flex items-center gap-3">
              <RakshaMascot expression="talk" className="!w-10 !h-10 shrink-0" />
              <div>
                <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1">
                  Raksha AI
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin [animation-duration:6s]" />
                </h4>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Cyber Shield Guide</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Text-To-Speech Toggle */}
              <button
                onClick={() => {
                  setSpeechEnabled(!speechEnabled);
                  if (speechEnabled) window.speechSynthesis.cancel();
                }}
                className={`p-1.5 rounded-lg border transition-all ${
                  speechEnabled ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'border-white/5 text-slate-400 hover:text-white'
                }`}
                title={speechEnabled ? "Mute Assistant voice" : "Enable Assistant voice"}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }}
                className="p-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Grid */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 max-h-[300px]">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`
                  flex gap-2 max-w-[80%] text-xs leading-normal p-3 rounded-2xl
                  ${msg.sender === 'user' 
                    ? 'bg-violet-600 text-white self-end rounded-tr-none' 
                    : 'bg-slate-900 border border-white/5 text-slate-200 self-start rounded-tl-none'
                  }
                `}
              >
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="bg-slate-900 border border-white/5 text-slate-400 self-start p-3 rounded-2xl rounded-tl-none text-xs flex gap-1 items-center max-w-[80%]">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>

          {/* Quick replies & Inputs */}
          <div className="p-4 border-t border-white/5 bg-slate-950/60 flex flex-col gap-3">
            {/* Quick replies scroll */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSend(reply)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] text-cyan-400 font-bold border border-cyan-500/20 hover:border-cyan-500/40 rounded-full transition-all shrink-0 cursor-pointer"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Ask me about cyber safety..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                className="glass-input px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 w-full"
              />

              <button
                onClick={startListening}
                className={`p-2.5 rounded-xl border transition-all ${
                  isListening ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                }`}
                title="Dictate with voice"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSend(inputValue)}
                className="p-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white rounded-xl shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
