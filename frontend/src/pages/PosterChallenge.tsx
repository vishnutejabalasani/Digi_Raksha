import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, ChevronRight, PenTool, Eraser, Trash2, Upload, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PosterChallenge: React.FC = () => {
  const { user, submitPoster } = useGame();
  const navigate = useNavigate();

  const [slogan, setSlogan] = useState('');
  const [theme, setTheme] = useState('OTP Safety');
  const [mode, setMode] = useState<'draw' | 'upload'>('draw');
  const [submitted, setSubmitted] = useState(false);

  // Drawing States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#8b5cf6'); // Purple
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Canvas context setup
  useEffect(() => {
    if (mode === 'draw' && canvasRef.current && !submitted) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Dark background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [mode, submitted]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = tool === 'eraser' ? '#0f172a' : color;
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedFile(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let contentStr = '';
    
    if (mode === 'draw' && canvasRef.current) {
      contentStr = canvasRef.current.toDataURL();
    } else if (mode === 'upload' && uploadedFile) {
      contentStr = uploadedFile;
    }

    submitPoster(slogan || 'Think Before You Click', mode, contentStr || 'blank-poster');
    setSubmitted(true);

    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const colors = [
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'White', value: '#ffffff' }
  ];

  if (submitted || user?.posterSubmitted) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 max-w-md w-full text-center flex flex-col items-center gap-6">
          <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full text-emerald-400">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">POSTER SUBMITTED!</h2>
            <p className="text-sm text-slate-400 mt-1 uppercase tracking-widest font-semibold text-cyan-400">
              Creative Artist Badge Unlocked
            </p>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 w-full text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Slogan Sown</div>
            <div className="text-sm font-extrabold text-white mt-1 italic">
              "{slogan || user?.posterData?.slogan || 'Think Before You Click'}"
            </div>
            <div className="text-[10px] text-slate-400 mt-3 border-t border-white/5 pt-3 leading-normal">
              Your poster has been sent to the <span className="text-cyan-400 font-bold">Volunteer Hub</span> for evaluation and grading.
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2"
          >
            Back to Dashboard <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">POSTER CREATIVE ARENA</h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold text-violet-400">
            Submit campaign ideas to earn points
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-6 items-start">
        
        {/* Creator Control & Metadata */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-5 border border-white/5 flex flex-col gap-4">
          <h3 className="font-extrabold text-white text-base border-b border-white/5 pb-2 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-violet-400" />
            Campaign Information
          </h3>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Poster Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="glass-input px-4 py-2.5 rounded-xl text-xs text-white bg-slate-900 w-full appearance-none cursor-pointer"
            >
              <option value="OTP Safety">OTP Security & Protection</option>
              <option value="Phishing Alerts">Phishing & Fake Email Hunter</option>
              <option value="UPI QR Protection">Safe UPI & QR Transfers</option>
              <option value="Social Safety">Cyber Bullying & Device Safety</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campaign Slogan</label>
            <input
              type="text"
              required
              placeholder="e.g. Think Before You Click!"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="glass-input px-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 w-full"
            />
          </div>

          {/* Submission Mode Selection */}
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creation Mode</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-1 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setMode('draw')}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  mode === 'draw' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Draw Canvas
              </button>
              <button
                type="button"
                onClick={() => setMode('upload')}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  mode === 'upload' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload File
              </button>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-slate-900/40 border border-white/5 rounded-xl p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4">
            Reward: <span className="text-violet-400">+100 XP</span> & <span className="text-cyan-400">+50 Coins</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-700 hover:to-cyan-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all"
          >
            Submit Campaign
          </button>
        </div>

        {/* Canvas or Upload area */}
        <div className="lg:col-span-3 glass-panel-strong rounded-3xl p-5 border border-white/10 flex flex-col gap-4">
          {mode === 'draw' ? (
            <>
              {/* Canvas Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
                <div className="flex gap-1">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => { setColor(c.value); setTool('pen'); }}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        color === c.value && tool === 'pen' ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  {/* Tool Selectors */}
                  <button
                    type="button"
                    onClick={() => setTool('pen')}
                    className={`p-1.5 rounded-lg border transition-all ${
                      tool === 'pen' ? 'bg-violet-500/20 border-violet-500 text-violet-400' : 'border-transparent text-slate-400'
                    }`}
                    title="Pen tool"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTool('eraser')}
                    className={`p-1.5 rounded-lg border transition-all ${
                      tool === 'eraser' ? 'bg-violet-500/20 border-violet-500 text-violet-400' : 'border-transparent text-slate-400'
                    }`}
                    title="Eraser tool"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                  
                  {/* Divider */}
                  <span className="w-px h-5 bg-white/10"></span>

                  {/* Brush Size */}
                  <input
                    type="range"
                    min="2"
                    max="15"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-16 accent-violet-500 cursor-pointer"
                    title="Brush size"
                  />

                  {/* Divider */}
                  <span className="w-px h-5 bg-white/10"></span>

                  {/* Clear Button */}
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="p-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                    title="Clear canvas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Painting Canvas */}
              <div className="bg-slate-950 border border-white/5 rounded-2xl overflow-hidden flex justify-center items-center">
                <canvas
                  ref={canvasRef}
                  width={460}
                  height={320}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="cursor-crosshair max-w-full"
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl min-h-[360px] p-6 text-center bg-slate-900/10">
              {uploadedFile ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={uploadedFile}
                    alt="Uploaded poster preview"
                    className="max-h-[220px] rounded-xl border border-white/10 shadow-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="text-xs font-bold text-red-400 hover:underline"
                  >
                    Remove and re-upload
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center gap-3 cursor-pointer group">
                  <div className="p-4 bg-slate-900 border border-white/5 rounded-full text-violet-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white uppercase tracking-wider block">
                      Select digital poster
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      PNG, JPG, or PDF up to 5MB
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}
        </div>

      </form>
    </div>
  );
};
