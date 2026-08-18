import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ShieldCheck, ArrowLeft, ChevronRight, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmartphoneSimulator } from '../components/SmartphoneSimulator';
import type { AppScenario } from '../components/SmartphoneSimulator';

const PHISHING_SCENARIOS: AppScenario[] = [
  {
    id: 1,
    appName: 'gmail',
    sender: 'security@accounts-netflix-login.com',
    avatarText: '✉️',
    initialText: 'Urgent! Your Netflix payment has failed. We will suspend your account in 24 hours if you do not update your credit card details immediately by clicking the secure link below:',
    linkUrl: 'http://accounts-netflix-login.com/login-reset',
    options: [
      {
        text: '🛡️ Report and Delete Email',
        isCorrect: true,
        explanation: '✓ PERFECT DECISION! The sender domain "accounts-netflix-login.com" is fake (real is netflix.com). You successfully avoided a credential theft trap.',
        points: 25,
        coins: 10
      },
      {
        text: '⚠️ Click Link to Reset Credit Card',
        isCorrect: false,
        explanation: '🚨 SCAMMED! This was a fake login screen. The scammers have captured your password and card details.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 2,
    appName: 'whatsapp',
    sender: 'KBC Lottery Agent',
    avatarText: '🎁',
    initialText: 'CONGRATULATIONS! 🎉 You won ₹25,00,000 cash reward in the lucky draw! Click this link to register with our bank manager and claim your reward cash: http://kbc-jio-lottery-draw.in/register',
    linkUrl: 'http://kbc-jio-lottery-draw.in/register',
    options: [
      {
        text: '❌ Block and Report number',
        isCorrect: true,
        explanation: '✓ GREAT JOB! You cannot win a lottery you never bought a ticket for. This is a common advance-fee scam.',
        points: 25,
        coins: 10
      },
      {
        text: '📱 Open Link to register',
        isCorrect: false,
        explanation: '🚨 WARNING! Scanning or opening fake lottery portals will ask you for "registration fees" and drain your bank account.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 3,
    appName: 'sms',
    sender: 'AD-SBIBNK',
    avatarText: '🏦',
    initialText: 'Dear customer, your online bank account is blocked due to missing KYC documents. Update immediately at https://onlinesbi.co.in/kyc-update to upload PAN/Aadhaar details.',
    options: [
      {
        text: '❌ Ignore SMS and call official bank helpline',
        isCorrect: true,
        explanation: '✓ WISE CHOICE! Real banks never send direct active links in SMS text messages asking for sensitive documents like PAN/Aadhaar.',
        points: 25,
        coins: 10
      },
      {
        text: '🏦 Click Link to upload Aadhaar card',
        isCorrect: false,
        explanation: '🚨 DANGER ZONE! Scammers steal identity documents to open fake bank accounts in your name or steal money.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 4,
    appName: 'whatsapp',
    sender: 'Classmate Rohit (Hacked)',
    avatarText: '👦',
    initialText: 'Bro look at this! Someone uploaded a video of you in the school hallway! Everyone is forwarding it! Watch it here: http://instagram-profile-viewer.net/video/3827',
    linkUrl: 'http://instagram-profile-viewer.net/video/3827',
    options: [
      {
        text: '🛡️ Pause & call Rohit to check',
        isCorrect: true,
        explanation: '✓ EXCELLENT REFLEXES! Scammers hijack student profiles to send panic-inducing video links to all friends. Rohit\'s profile is compromised.',
        points: 25,
        coins: 10
      },
      {
        text: '😮 Open link to check video',
        isCorrect: false,
        explanation: '🚨 CORRUPTED! The link prompts you to log into Instagram, which steals your username and password.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 5,
    appName: 'gmail',
    sender: 'notifications@greenwood-academy.edu.in',
    avatarText: '🏫',
    initialText: 'Dear Parents and Students, the official mid-term examination schedule for Classes 6-10 has been published on the school portal. Please download the PDF at https://greenwood-academy.edu.in/midterm-schedule.pdf. No login credentials are required to view.',
    linkUrl: 'https://greenwood-academy.edu.in/midterm-schedule.pdf',
    options: [
      {
        text: '✅ Open link to download schedule',
        isCorrect: true,
        explanation: '✓ PERFECT DECISION! The sender domain "greenwood-academy.edu.in" belongs to the official school website and the link ends in a secure .pdf with no credential requests. This is a safe and valid communication.',
        points: 25,
        coins: 10
      },
      {
        text: '❌ Report as phishing scam',
        isCorrect: false,
        explanation: '🚨 INCORRECT: This is a legitimate school communication. Reporting or ignoring it might make you miss important exam schedules. Always verify the domain name matches your school!',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 6,
    appName: 'whatsapp',
    sender: 'Mother',
    avatarText: '👩',
    initialText: 'Beta, did you reach school safely? Please share your live location for 1 hour so I know you reached. Love, Mum.',
    options: [
      {
        text: '✅ Share live location safely',
        isCorrect: true,
        explanation: '✓ WISE DECISION! Sharing your location with verified family members (like your Mother) is completely safe and helps them know you are secure. Always make sure the chat is verified as your actual family member.',
        points: 25,
        coins: 10
      },
      {
        text: '❌ Block and report contact',
        isCorrect: false,
        explanation: '🚨 INCORRECT: This is your Mother asking for your safety. Blocking your parents\' contact is not necessary and will cause unnecessary panic.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 7,
    appName: 'sms',
    sender: 'AD-POSTIND',
    avatarText: '📦',
    initialText: '[India Post] Your package has arrived at our sorting hub but has an incorrect address. Please update your address within 24 hours at http://indiapost-delivery-tracking.org/address or it will be returned.',
    linkUrl: 'http://indiapost-delivery-tracking.org/address',
    options: [
      {
        text: '🛡️ Ignore and delete SMS',
        isCorrect: true,
        explanation: '✓ CORRECT! India Post never sends SMS links asking you to pay or update address details on third-party domains like "indiapost-delivery-tracking.org". Always use the official speed post tracking website.',
        points: 25,
        coins: 10
      },
      {
        text: '📦 Click link to update address',
        isCorrect: false,
        explanation: '🚨 SCAMMED! This fake portal asks for your credit/debit card to pay a "re-delivery fee" of ₹20, and steals your card details.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 8,
    appName: 'sms',
    sender: 'AD-AMAZON',
    avatarText: '🔑',
    initialText: 'Your OTP for logging into Amazon account is 840291. It is valid for 5 minutes. DO NOT share this OTP with anyone, Amazon support never calls to ask for it.',
    options: [
      {
        text: '✅ Enter OTP in the Amazon app/website you opened',
        isCorrect: true,
        explanation: '✓ CORRECT! If you initiated the login request, this OTP is legitimate and safe to input on the official Amazon login page. Just remember never to read it to anyone over a phone call!',
        points: 25,
        coins: 10
      },
      {
        text: '❌ Report SMS as scam and delete',
        isCorrect: false,
        explanation: '🚨 INCORRECT: If you requested the login, the OTP is valid. Deleting it will block you from signing into your own account. Just remember the rule: enter OTPs only on trusted official screens, never share them verbally!',
        points: 0,
        coins: 0
      }
    ]
  }
];

export const MissionPhishing: React.FC = () => {
  const { completeMission } = useGame();
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleMissionComplete = (score: number, maxScore: number) => {
    setFinalScore(score);
    
    let stars = 1;
    if (score === maxScore) stars = 3;
    else if (score >= maxScore - 1) stars = 2;

    completeMission('phishing', stars, 100, 50);
    setShowSummary(true);

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.65 }
    });
  };

  if (showSummary) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="glass-panel-strong rounded-3xl p-6 sm:p-8 max-w-md w-full text-center flex flex-col items-center gap-6 shadow-xl">
          <div className="p-4 bg-emerald-100 border-2 border-emerald-500/40 rounded-full text-emerald-700 shadow-md">
            <ShieldCheck className="w-14 h-14" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Mission 1 Complete!</h2>
            <p className="text-sm text-indigo-700 font-extrabold uppercase mt-1 tracking-widest">
              Phishing Hunter Badge Earned
            </p>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 w-full text-center shadow-inner">
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Training Accuracy</div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {finalScore} / {PHISHING_SCENARIOS.length} Protected
            </div>
            
            <div className="flex justify-around items-center mt-4 pt-3 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-600 block font-bold">Reward</span>
                <span className="text-indigo-700 font-black text-sm">+100 XP</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div>
                <span className="text-slate-600 block font-bold">Bonus</span>
                <span className="text-cyan-700 font-black text-sm">+50 Coins</span>
              </div>
            </div>
          </div>

          {/* Educational Passport Stamp */}
          <div className="w-full p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full border border-indigo-300 flex items-center justify-center text-lg shadow-sm">
              🛡️
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-indigo-700 block">Unlocked Passport Stamp</span>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">Phishing Defender Stamp</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-4 bg-primary hover:bg-indigo-700 rounded-2xl font-black text-white text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
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
      <div className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border-2 border-indigo-100 shadow-sm backdrop-blur-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-700 hover:text-slate-900 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">MISSION 1: PHISHING TRAP</h2>
          <p className="text-xs text-indigo-700 font-black uppercase tracking-wider mt-0.5">
            Learn to identify fake messages, emails, and links
          </p>
        </div>
      </div>

      <SmartphoneSimulator
        scenarios={PHISHING_SCENARIOS}
        missionName="Phishing Trap"
        badgeName="Phishing Hunter"
        onMissionComplete={handleMissionComplete}
      />
    </div>
  );
};

