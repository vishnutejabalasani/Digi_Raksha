import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Mic, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  HelpCircle,
  PhoneCall,
  User
} from 'lucide-react';
import { RakshaMascot } from './RakshaMascot';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  time?: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  'what is phishing?': 'Phishing is when cyber criminals send deceptive emails, SMS, or WhatsApp messages pretending to be legitimate brands (like Google, Netflix, or your School Board). They trick you into clicking a link and typing credentials so they can hijack your accounts!',
  'can i share otp?': '🚨 NEVER! One-Time Passwords (OTPs) and UPI PINs are confidential 2FA authentication keys. Legitimate banks, police officers, and telecom providers will NEVER call or message you asking for an OTP.',
  'what is cyber bullying?': 'Cyberbullying includes sending abusive, threatening, or humiliating messages across games or social networks. If you encounter bullying, do not engage: take screenshots, block the harasser, and report it to parents or teachers immediately.',
  'what is ransomware?': 'Ransomware is dangerous malware that encrypts files on your computer and demands ransom payment. Never download pirated game cheats, cracked software, or unknown torrents, as they are primary ransomware infection vectors.',
  'is this message fake?': 'Red flags of a scam message include: 1) Artificial panic ("Account blocked in 15 mins!"), 2) Shortened suspicious URLs, 3) Requests for confidential OTPs/PINs, and 4) Unbelievable rewards or lottery cash prize claims.',
  'what should i do if i get scammed?': 'Do not panic! Immediately dial the National Cyber Crime Helpline at 1930 (available 24/7 across India) or file an incident report at cybercrime.gov.in. Calling within the golden hour enables banks to freeze stolen funds!',
  'helpline 1930': '📞 1930 is the official citizen cyber fraud emergency helpline in India. Dialing 1930 connects you immediately to the financial fraud mitigation desk to freeze unauthorized transactions.'
};

export const RakshaAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      sender: 'ai', 
      text: 'Hello Cadet! I am Raksha, your AI Cyber Safety Companion. How can I protect your digital journey today?',
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const quickReplies = [
    { label: "🎣 What is phishing?", query: "What is phishing?" },
    { label: "🔒 Can I share OTP?", query: "Can I share OTP?" },
    { label: "🚨 Is this message fake?", query: "Is this message fake?" },
    { label: "👾 What is ransomware?", query: "What is ransomware?" },
    { label: "📞 Helpline 1930", query: "Helpline 1930" }
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
      utterance.rate = 1.05;
      utterance.pitch = 1.08;
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

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text, time: timeStr }]);
    setInputValue('');
    setIsTyping(true);

    // Formulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const query = text.toLowerCase().trim().replace(/[?.!]/g, '');
      
      let answer = "I'm not fully sure about that specific scenario yet. Try asking me about 'phishing', 'sharing OTPs', 'fake messages', or the '1930 helpline'!";
      
      // Match from knowledge base
      for (const key of Object.keys(KNOWLEDGE_BASE)) {
        if (query.includes(key) || key.includes(query)) {
          answer = KNOWLEDGE_BASE[key];
          break;
        }
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: answer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      speakText(answer);
    }, 1100);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 font-sans select-none">
      
      {/* Floating Action Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          type="button"
          className="group relative p-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white rounded-full shadow-2xl hover:shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center border-2 border-white/20 cursor-pointer"
        >
          {/* Subtle Outer Glow Wave */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-ping pointer-events-none"></div>
          
          <MessageSquare className="w-6 h-6 text-white relative z-10" />
          
          {/* Green Live Beacon */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>

          {/* Hover Tooltip */}
          <span className="absolute right-16 bg-slate-900/95 border border-slate-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Need Help? Ask Raksha AI</span>
          </span>
        </button>
      )}

      {/* Redesigned Premium Chatbot Panel */}
      {isOpen && (
        <div className="w-[330px] sm:w-[380px] h-[520px] bg-white rounded-[32px] border-2 border-indigo-100 shadow-2xl flex flex-col justify-between overflow-hidden animate-scale-in relative ring-1 ring-slate-900/5">
          
          {/* Header with Cyber Mesh Gradient */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/60 relative overflow-hidden shrink-0">
            {/* Ambient Background Glint */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>

            {/* Left: Mascot Avatar & Title */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-0.5 shadow-md flex items-center justify-center shrink-0 border border-cyan-300/40">
                <RakshaMascot size={32} expression="talk" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-white text-sm tracking-wide uppercase leading-none">
                    Raksha AI
                  </h4>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-cyan-300 font-mono font-bold tracking-wider uppercase">
                    Online · Cyber Guide
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Header Controls */}
            <div className="flex items-center gap-2 relative z-10">
              {/* Text-To-Speech Toggle */}
              <button
                onClick={() => {
                  setSpeechEnabled(!speechEnabled);
                  if (speechEnabled) window.speechSynthesis.cancel();
                }}
                type="button"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  speechEnabled 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-xs' 
                    : 'bg-white/10 border-white/10 text-slate-300 hover:text-white hover:bg-white/20'
                }`}
                title={speechEnabled ? "Mute Voice Assistant" : "Enable Voice Assistant"}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              {/* Close Button */}
              <button
                onClick={() => { setIsOpen(false); window.speechSynthesis.cancel(); }}
                type="button"
                className="p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed Area */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 bg-gradient-to-b from-slate-50 to-indigo-50/30">
            
            {/* Welcome Tag */}
            <div className="text-[10px] text-center text-slate-400 font-mono font-bold uppercase tracking-widest my-1 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Verified Cyber Safety Assistant</span>
            </div>

            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex gap-2.5 max-w-[86%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* AI / User Avatar Badge */}
                {msg.sender === 'ai' ? (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow-xs border border-indigo-200 mt-1">
                    <RakshaMascot size={20} expression="talk" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-xs border border-slate-700 mt-1">
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                )}

                {/* Message Bubble Card */}
                <div 
                  className={`
                    p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs flex flex-col gap-1 transition-all
                    ${msg.sender === 'user' 
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-tr-xs' 
                      : 'bg-white border-2 border-indigo-100 text-slate-800 rounded-tl-xs shadow-sm font-medium'
                    }
                  `}
                >
                  <p>{msg.text}</p>
                  {msg.time && (
                    <span className={`text-[9px] text-right font-mono ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Live Typing Indicator */}
            {isTyping && (
              <div className="self-start flex items-center gap-2.5 max-w-[85%] animate-fade-in">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <RakshaMascot size={20} expression="talk" />
                </div>
                <div className="bg-white border-2 border-indigo-100 p-3 rounded-2xl rounded-tl-xs shadow-sm flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span className="text-[10px] text-indigo-700 font-bold">Raksha is analyzing...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef}></div>
          </div>

          {/* Bottom Area: Quick Prompts + Elevated Input Bar */}
          <div className="p-3.5 bg-white border-t-2 border-indigo-100 flex flex-col gap-2.5 shrink-0">
            
            {/* Quick Suggestions Chips Tray */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(reply.query)}
                  type="button"
                  className="px-3 py-1 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300 text-[10px] text-indigo-900 font-bold rounded-full transition-all shrink-0 cursor-pointer shadow-2xs hover:scale-105"
                >
                  {reply.label}
                </button>
              ))}
            </div>

            {/* Input & Action Bar */}
            <div className="flex items-center gap-2 bg-slate-50 border-2 border-indigo-100 focus-within:border-indigo-400 focus-within:bg-white rounded-2xl p-1.5 transition-all shadow-inner">
              <input
                type="text"
                placeholder="Ask about phishing, passwords, OTPs..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                className="w-full bg-transparent px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden font-medium"
              />

              {/* Voice Input Button */}
              <button
                onClick={startListening}
                type="button"
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-rose-500 border-rose-600 text-white animate-pulse shadow-md' 
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-indigo-600 shadow-2xs'
                }`}
                title="Speak question via microphone"
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim()}
                type="button"
                className="p-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                title="Send message"
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
