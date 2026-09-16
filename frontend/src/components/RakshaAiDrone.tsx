import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, ChevronDown, ChevronUp, Bot, Sparkles } from 'lucide-react';

export interface RakshaAiDroneHandle {
  speak: (text: string, force?: boolean) => void;
  stop: () => void;
}

export const RakshaAiDrone: React.FC<{
  droneRef?: React.MutableRefObject<RakshaAiDroneHandle | null>;
  initialGreeting?: string;
}> = ({ droneRef, initialGreeting }) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>(initialGreeting || 'RAKSHA-AI Tactical Drone Online. Awaiting security breach analysis...');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const lastTextRef = useRef<string>(initialGreeting || '');
  const isMutedRef = useRef<boolean>(false);

  // Keep ref updated
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Load available speech synthesis voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Pick best available English voice
  const selectVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;
    
    // Prioritize natural or modern English voices
    const preferredNames = [
      'Google US English', 'Samantha', 'Microsoft Zira', 'Microsoft David', 
      'Victoria', 'Karen', 'Daniel', 'Alex', 'en-US', 'en-GB'
    ];

    for (const name of preferredNames) {
      const found = voices.find(v => v.name.includes(name) || v.lang.includes(name));
      if (found) return found;
    }

    return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }, [voices]);

  // Main Speech function
  const speakText = useCallback((text: string, force: boolean = false) => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    lastTextRef.current = text;
    setTranscript(text);

    if (isMutedRef.current && !force) {
      // Still show transcript even if muted
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop prior speech

      const utterance = new SpeechSynthesisUtterance(text);
      const chosenVoice = selectVoice();
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.rate = 1.05; // Slightly brisk, modern AI pace
      utterance.pitch = 1.06; // Crisp tactical pitch
      utterance.volume = isMutedRef.current ? 0 : 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        // Some browsers cancel previous utterances throwing 'interrupted' or 'canceled', which is normal
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis error:', e);
        }
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis invocation error:', err);
      setIsSpeaking(false);
    }
  }, [selectVoice]);

  // Expose methods to parent ref
  useEffect(() => {
    if (droneRef) {
      droneRef.current = {
        speak: (text: string, force?: boolean) => speakText(text, force),
        stop: () => {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
          setIsSpeaking(false);
        }
      };
    }
  }, [droneRef, speakText]);

  // Replay last spoken speech
  const handleReplay = () => {
    if (lastTextRef.current) {
      speakText(lastTextRef.current, true);
    }
  };

  // Toggle mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } else if (lastTextRef.current) {
      speakText(lastTextRef.current, true);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-2 border-cyan-500/40 rounded-3xl p-4 text-white shadow-2xl backdrop-blur-md relative overflow-hidden transition-all select-none">
      {/* Background Holographic Ambient Glow */}
      <div className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
        isSpeaking ? 'bg-cyan-500/30 scale-125' : 'bg-indigo-600/20'
      }`}></div>
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Holographic Drone Orb with Rotating Rings */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Outer Spinning Ring */}
            <div className={`absolute inset-0 rounded-full border border-dashed border-cyan-400 transition-all ${
              isSpeaking ? 'animate-spin opacity-100 scale-110' : 'opacity-40 animate-pulse'
            }`} style={{ animationDuration: '6s' }}></div>
            
            {/* Middle Counter-spinning Ring */}
            <div className={`absolute inset-1 rounded-full border border-violet-400/60 transition-all ${
              isSpeaking ? 'animate-spin opacity-90' : 'opacity-30'
            }`} style={{ animationDuration: '4s', animationDirection: 'reverse' }}></div>

            {/* Inner Glowing Core */}
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isSpeaking 
                ? 'bg-gradient-to-tr from-cyan-400 to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/50 scale-105' 
                : 'bg-slate-800 text-cyan-400'
            }`}>
              <Bot className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
            </div>

            {/* Speaking Status Beacon */}
            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-slate-900 transition-all ${
              isSpeaking ? 'bg-emerald-400 animate-ping' : isMuted ? 'bg-slate-500' : 'bg-cyan-400'
            }`}></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black tracking-wider text-cyan-300 uppercase flex items-center gap-1">
                RAKSHA-AI
                <Sparkles className="w-3 h-3 text-amber-400" />
              </h4>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border transition-colors ${
                isSpeaking 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse' 
                  : isMuted 
                    ? 'bg-slate-800 text-slate-400 border-slate-700' 
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}>
                {isSpeaking ? 'VOICE ACTIVE' : isMuted ? 'MUTED' : 'STANDBY'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Tactical Cyber Advisor</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Replay Voice Intel Button */}
          <button
            onClick={handleReplay}
            type="button"
            title="Replay Voice Intel"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-cyan-400 hover:text-cyan-200 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Mute / Unmute Button */}
          <button
            onClick={handleToggleMute}
            type="button"
            title={isMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
              isMuted 
                ? 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900/60' 
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-emerald-400 hover:text-emerald-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Minimize / Expand Toggle */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            type="button"
            title={isMinimized ? 'Expand Drone HUD' : 'Minimize Drone HUD'}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Holographic Subtitle & Soundwave Visualizer */}
      {!isMinimized && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-2.5 relative z-10 animate-fade-in">
          {/* Dynamic Audio Soundwave Bars */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {isSpeaking ? 'Transmitting Voice Telemetry:' : 'Telemetry Monitor:'}
            </span>
            <div className="flex items-center gap-0.5 h-3.5">
              {[40, 70, 100, 60, 90, 45, 80, 50, 95, 65, 35].map((height, idx) => (
                <span
                  key={idx}
                  className={`w-0.5 rounded-full transition-all duration-150 ${
                    isSpeaking 
                      ? 'bg-cyan-400 shadow-sm shadow-cyan-400' 
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: isSpeaking ? `${Math.max(20, (height * (Math.sin(Date.now() / 100 + idx) + 1.2)) / 2.2)}%` : '20%',
                    animation: isSpeaking ? `pulse 0.4s infinite alternate ${idx * 0.05}s` : 'none'
                  }}
                ></span>
              ))}
            </div>
          </div>

          {/* Transcript HUD Bubble */}
          <div className="bg-slate-950/80 rounded-2xl p-3 border border-cyan-500/20 shadow-inner">
            <p className="text-xs font-sans text-slate-200 leading-relaxed italic">
              "{transcript}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
