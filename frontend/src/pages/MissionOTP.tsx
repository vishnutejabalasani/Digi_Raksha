import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmartphoneSimulator } from '../components/SmartphoneSimulator';
import type { AppScenario } from '../components/SmartphoneSimulator';

const OTP_SCENARIOS: AppScenario[] = [
  {
    id: 1,
    appName: 'call',
    sender: 'SBI Card Manager (Verma)',
    avatarText: '🏦',
    initialText: 'Hello student, I am calling from SBI Security. We detected an unauthorized transaction of ₹45,000 on your card. I sent a blockade code to your mobile. Please read it to me immediately to cancel the payment!',
    options: [
      {
        text: '❌ Hang Up and Block Caller',
        isCorrect: true,
        explanation: '✓ PERFECT REFLEXES! Real banks will NEVER call to ask for your One-Time Password (OTP) or UPI PIN. If anyone asks, hang up immediately!',
        points: 25,
        coins: 10
      },
      {
        text: '🗣️ Tell them the OTP code',
        isCorrect: false,
        explanation: '🚨 SCAMMED! Sharing the OTP authorizes the transaction, allowing the hackers to instantly drain the bank account.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 2,
    appName: 'call',
    sender: 'GPay Cashback Host',
    avatarText: '🎁',
    initialText: 'Congratulations! Your mobile number won ₹10,000 cashback reward! I sent a collect request to your screen. Please tap Pay or read me the OTP to claim your cash.',
    options: [
      {
        text: '❌ Hang Up and reject request',
        isCorrect: true,
        explanation: '✓ EXCELLENT DECISION! You never need to enter your PIN or share an OTP to RECEIVE money. Tapping Pay or sharing code will deduct money.',
        points: 25,
        coins: 10
      },
      {
        text: '🗣️ Read OTP code to host',
        isCorrect: false,
        explanation: '🚨 ACCOUNT CLEANED! The caller stole ₹10,000 from your linked payment wallet using your OTP.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 3,
    appName: 'call',
    sender: 'Delivery Agent (Amazon)',
    avatarText: '📦',
    initialText: 'Sir, I have your package but the delivery address in our computer is missing. I sent an SMS link with an OTP. Read me the OTP so I can update the address and deliver it.',
    options: [
      {
        text: '❌ Refuse and Hang Up',
        isCorrect: true,
        explanation: '✓ GREAT JOB! Delivery agents only need OTPs at your doorstep when physically handing over the package. They never call to ask for OTPs beforehand.',
        points: 25,
        coins: 10
      },
      {
        text: '🗣️ Share the OTP code',
        isCorrect: false,
        explanation: '🚨 SECURITY ALERT! The OTP sent was actually to verify a login request to your shopping account, which has now been hacked.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 4,
    appName: 'call',
    sender: 'Father',
    avatarText: '👨',
    initialText: 'Hi beta, I am at the store buying your school books. The shopkeeper sent a payment verification code to your SMS. Please read it to me so I can complete the checkout.',
    options: [
      {
        text: '🗣️ Read OTP to Father',
        isCorrect: true,
        explanation: '✓ CORRECT DECISION! Sharing OTPs with trusted family members for checkout requests you are aware of is safe. Since you verified it is your Father purchasing school books, this is a legitimate transaction authorization.',
        points: 25,
        coins: 10
      },
      {
        text: '❌ Hang Up and report contact',
        isCorrect: false,
        explanation: '🚨 INCORRECT: This is your Father buying school books. Rejecting the call will prevent him from completing the purchase.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 5,
    appName: 'sms',
    sender: 'AD-DISNEY',
    avatarText: '🎬',
    initialText: 'Your Disney+ Hotstar login verification code is 491029. This code will expire in 10 minutes. If you did not request this code, please ignore this SMS.',
    options: [
      {
        text: '✅ Enter verification code on the Disney+ login screen you requested',
        isCorrect: true,
        explanation: '✓ CORRECT! If you initiated the login to your Disney+ account, this OTP is safe to enter on the official screen. Never share it with anyone who calls you to ask for it.',
        points: 25,
        coins: 10
      },
      {
        text: '❌ Share OTP on public social media support chat',
        isCorrect: false,
        explanation: '🚨 DANGER! Sharing authentication OTPs publicly allows hackers to hijack your streaming accounts and personal profiles.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 6,
    appName: 'call',
    sender: 'Telecom Sim Upgrade (Jio)',
    avatarText: '📱',
    initialText: 'Hello customer, your SIM card is expiring in 2 hours and will be blocked. I sent a 6-digit porting/upgrade code to your mobile. Please read it to me immediately to upgrade your SIM to 5G.',
    options: [
      {
        text: '❌ Refuse and Hang Up',
        isCorrect: true,
        explanation: '✓ CORRECT! Scammers call claiming SIM blocks to steal your SIM profile. The code they sent is actually a 2-Factor Authentication code to hijack your WhatsApp or Google Account.',
        points: 25,
        coins: 10
      },
      {
        text: '🗣️ Tell them the 6-digit code',
        isCorrect: false,
        explanation: '🚨 SCAMMED! The scammer used the code to log into your WhatsApp account and is now texting your friends asking for money.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 7,
    appName: 'sms',
    sender: 'AD-AADHAR',
    avatarText: '🆔',
    initialText: 'OTP for downloading your e-Aadhaar is 729103. If you did not initiate this request, please lock your Aadhaar profile online.',
    options: [
      {
        text: '✅ Use OTP to download Aadhaar from official UIDAI portal',
        isCorrect: true,
        explanation: '✓ CORRECT! If you requested the download yourself on the official UIDAI government website, it is completely safe to input.',
        points: 25,
        coins: 10
      },
      {
        text: '🗣️ Tell the OTP to a caller claiming to be a police officer',
        isCorrect: false,
        explanation: '🚨 IDENTITY THEFT! Government officers or police never call to ask for Aadhaar OTPs. Sharing this code lets scammers download your identity details.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 8,
    appName: 'call',
    sender: 'Airtel Tower Rent Team',
    avatarText: '🗼',
    initialText: 'Sir, your empty land/roof is selected for installing our Airtel Mobile Tower. You will receive ₹50,000 monthly rent. I sent a verification code to register. Read me the code to activate your file.',
    options: [
      {
        text: '❌ Hang Up and Block',
        isCorrect: true,
        explanation: '✓ PERFECT DECISION! This is a mobile tower installation scam. The code is actually a transaction OTP to debit money from your linked bank account.',
        points: 25,
        coins: 10
      },
      {
        text: '🗣️ Read them the code',
        isCorrect: false,
        explanation: '🚨 ACCOUNT COMPROMISED! You shared the OTP that authorized a digital wallet transfer, losing money instead of earning rent.',
        points: 0,
        coins: 0
      }
    ]
  }
];

export const MissionOTP: React.FC = () => {
  const { completeMission } = useGame();
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleMissionComplete = (score: number, maxScore: number) => {
    setFinalScore(score);
    
    let stars = 1;
    if (score === maxScore) stars = 3;
    else if (score >= maxScore - 1) stars = 2;

    completeMission('otp', stars, 150, 70);
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
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Mission 2 Complete!</h2>
            <p className="text-sm text-indigo-700 font-extrabold uppercase mt-1 tracking-widest font-sans">
              OTP Defender Badge Earned
            </p>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 w-full text-center shadow-inner">
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Training Accuracy</div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {finalScore} / {OTP_SCENARIOS.length} Scenarios Protected
            </div>
            
            {/* Real World Emergency Tip */}
            <div className="mt-4 p-3 bg-rose-50 border-2 border-rose-200 rounded-xl text-rose-800 flex flex-col gap-1 items-center justify-center shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-700">National Cyber Help Line</span>
              <span className="text-lg font-black text-rose-900">📞 Call 1930</span>
              <span className="text-[10px] text-slate-700 font-bold leading-normal text-center">
                If you ever lose money in a cyber scam, dial 1930 immediately to freeze bank accounts.
              </span>
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
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">MISSION 2: OTP DANGER ZONE</h2>
          <p className="text-xs text-indigo-700 font-black uppercase tracking-wider mt-0.5">
            Defend authorization codes and OTP numbers from calling fraudsters
          </p>
        </div>
      </div>

      <SmartphoneSimulator
        scenarios={OTP_SCENARIOS}
        missionName="OTP Danger Zone"
        badgeName="OTP Defender"
        onMissionComplete={handleMissionComplete}
      />
    </div>
  );
};

