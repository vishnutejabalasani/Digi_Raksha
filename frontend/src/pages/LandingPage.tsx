import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ChevronDown, 
  Smartphone, 
  HelpCircle, 
  Compass, 
  Award,
  Mail,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Heart,
  Sparkles
} from 'lucide-react';
import { RakshaMascot } from '../components/RakshaMascot';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  


  const stats = [
    { label: 'Phishing Scams', value: '47%', desc: 'of all cyber attacks targeting youth are phishing-based.', color: 'text-primary', border: 'border-[#E0F2FE] bg-[#EEF7FF]' },
    { label: 'Financial Scams', value: '₹500Cr+', desc: 'lost annually by Indian families through unauthorized OTP sharing.', color: 'text-danger', border: 'border-rose-100 bg-rose-50' },
    { label: 'QR Fraud Growth', value: '180%', desc: 'increase in UPI collect request scams hidden behind malicious QR codes.', color: 'text-accent', border: 'border-emerald-100 bg-emerald-50' },
  ];

  const objectives = [
    { title: 'Spot the Red Flags', desc: 'Identify fake SMS, WhatsApp links, and phishing emails.', icon: Mail, color: 'text-primary bg-indigo-50 border border-indigo-100' },
    { title: 'Secure Your OTPs', desc: 'Understand that banks, lottery hosts, or tech support never ask for codes.', icon: Lock, color: 'text-warning bg-orange-50 border border-orange-100' },
    { title: 'Vishing Defense', desc: 'Identify police threats or KYC renewal caller scams immediately.', icon: Smartphone, color: 'text-danger bg-red-50 border border-red-100' },
    { title: 'UPI Safety Protocol', desc: 'Never scan a QR code to RECEIVE money. Verify UPI IDs.', icon: Compass, color: 'text-secondary bg-cyan-50 border border-cyan-100' },
  ];

  const testimonials = [
    { name: 'Aditya Sen', role: 'Class 9 Student', school: 'DPS Pune', text: 'The Phishing Trap mission was like playing a mystery game. I now show my parents how to identify fake messages!' },
    { name: 'Dr. Rita Nair', role: 'Cybersecurity Educator', school: 'IEEE SSIT Member', text: 'Digi Raksha is a game changer. The gamified missions teach kids cyber safety protocols better than any classroom presentation.' }
  ];

  const faqs = [
    { q: 'What is Digi Raksha?', a: 'Digi Raksha is an interactive cybersecurity simulation game made for school students. By completing safety missions, students earn ranks, passport stamps, and a certified cyber safety hero badge.' },
    { q: 'Is it free to participate?', a: 'Yes! Digi Raksha is supported by IEEE SSIT to promote digital security awareness in schools at zero cost.' },
    { q: 'What is the Safety Passport?', a: 'It is a digital record where students collect stamps for every mission they complete successfully, acting as their Cyber Safety Credentials.' }
  ];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="relative select-none text-slate-800">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-10 pb-20">
        
        {/* Cute Mascot Introduction */}
        <div className="mb-6">
          <RakshaMascot 
            expression="celebrate"
            message="Hey there! Ready to join my Cyber Guard Squad and defend Cyber City? Let's go!"
          />
        </div>

        {/* Animated Cyber Shield Container */}
        <div className="relative mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur-xl opacity-30 group-hover:opacity-55 transition-opacity duration-300"></div>
          <div className="relative bg-white border-4 border-[#E0F2FE] p-6 rounded-full inline-flex items-center justify-center shadow-lg animate-bounce-gentle">
            <Shield className="w-14 h-14 text-primary" />
            <Sparkles className="w-6 h-6 text-highlight absolute -top-1 -right-1 animate-sparkle" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
          <span className="text-primary block">
            DIGI RAKSHA
          </span>
          <span className="block text-2xl sm:text-3xl text-slate-700 font-black mt-2 uppercase">
            Cyber Safety Simulation Challenge
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-secondary font-black uppercase tracking-[0.2em] mb-4">
          "Think Before You Click."
        </p>

        <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
          Become a <span className="text-primary font-black">Cyber Student</span>. Face real-world digital threats, outsmart phishing hackers, secure bank accounts, and unlock your <span className="text-highlight bg-slate-900 px-3 py-1.5 rounded-xl font-black">Cyber Hero Certificate</span>!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-primary hover:bg-[#4338CA] btn-playful btn-glow-primary rounded-2xl font-black text-white text-base flex items-center gap-2 cursor-pointer shadow-md"
          >
            Start Mission
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <a
            href="#about"
            className="px-8 py-4 bg-white hover:bg-slate-50 rounded-2xl font-black text-slate-600 border-2 border-[#E2E8F0] transition-all shadow-sm"
          >
            Learn More
          </a>
        </div>



        <div className="absolute bottom-4 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-400" />
        </div>
      </section>

      {/* Cyber Crime Statistics */}
      <section className="py-16 px-4 max-w-6xl mx-auto border-t-2 border-[#E0F2FE]">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-danger text-xs font-black uppercase tracking-widest bg-red-50 px-3.5 py-1.5 rounded-full border border-red-100 mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            Alert: Cyber Threat Landscape
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 uppercase">
            The Digital World Has Risks
          </h2>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm sm:text-base font-medium">
            Every day, thousands of school children fall victim to social engineering, online game scams, and identity fraud.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className={`glass-panel border-2 ${stat.border} rounded-3xl p-6 relative overflow-hidden group`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{stat.label}</span>
                <TrendingUp className="w-5 h-5 text-danger" />
              </div>
              <div className={`text-4xl sm:text-5xl font-black ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bold">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Digi Raksha & SSIT Section */}
      <section id="about" className="py-16 px-4 max-w-6xl mx-auto border-t-2 border-[#E0F2FE]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-secondary text-xs font-black uppercase tracking-widest mb-3">
              About the Initiative
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-6 uppercase leading-tight">
              Educating the Next Gen Cyber Guards
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6 font-medium">
              Digi Raksha (Digital Protection) is built specifically for school students in Classes 6–10. Instead of reading boring rule books, students enter interactive simulation missions to experience safety decisions in a controlled environment.
            </p>
            <p className="text-slate-500 leading-relaxed text-sm sm:text-base mb-6 font-medium">
              This application was conceived by cybersecurity professionals and educators to build digital reflexes. We believe that games are the most effective way to teach safety and security.
            </p>
            <div className="border border-indigo-100 bg-[#F5F3FF] p-4 rounded-2xl flex items-center gap-3">
              <Award className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <div className="font-black text-slate-800 text-sm">IEEE SSIT Partnership</div>
                <div className="text-xs text-slate-500 font-bold">Supported by IEEE Society on Social Implications of Technology.</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {objectives.map((obj, idx) => {
              const Icon = obj.icon;
              return (
                <div key={idx} className="bg-white border-2 border-[#E0F2FE] rounded-3xl p-5 flex flex-col gap-3 shadow-sm hover:scale-102 transition-transform">
                  <div className={`p-2 rounded-xl w-9 h-9 flex items-center justify-center ${obj.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-sm uppercase">{obj.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-bold">{obj.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 max-w-6xl mx-auto border-t-2 border-[#E0F2FE]">
        <div className="text-center mb-12">
          <div className="text-secondary text-xs font-black uppercase tracking-widest mb-3">
            Impact & Feedback
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 uppercase">
            What Students Say
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((test, idx) => (
            <div key={idx} className="bg-white border-2 border-[#E0F2FE] rounded-3xl p-6 flex flex-col justify-between shadow-sm">
              <p className="text-slate-600 italic text-sm leading-relaxed mb-6 font-bold">
                "{test.text}"
              </p>
              <div>
                <h4 className="font-black text-slate-800 text-sm">{test.name}</h4>
                <div className="text-xs text-secondary font-black uppercase tracking-wider mt-0.5">{test.role} — {test.school}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 max-w-4xl mx-auto border-t-2 border-[#E0F2FE]">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 flex items-center justify-center gap-2 uppercase">
            <HelpCircle className="w-7 h-7 text-primary" />
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border-2 border-[#E0F2FE] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                type="button"
                className="w-full text-left px-5 py-4 font-black text-slate-700 flex justify-between items-center hover:bg-slate-50 transition-colors text-sm sm:text-base cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-primary font-black text-lg">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-5 py-4 text-slate-600 text-xs sm:text-sm leading-relaxed border-t-2 border-[#E0F2FE] bg-slate-50 font-bold">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-[#E0F2FE] py-10 px-6 text-center shadow-inner">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-primary animate-bounce-gentle" />
              <span className="font-black text-slate-800 tracking-wider">DIGI RAKSHA</span>
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              National Cyber Safety Initiative for Schools.
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1 justify-center font-bold">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-danger fill-danger" />
            <span>in partnership with IEEE SSIT &copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
