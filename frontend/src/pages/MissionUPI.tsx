import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ShieldCheck, ArrowLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SmartphoneSimulator } from '../components/SmartphoneSimulator';
import type { AppScenario } from '../components/SmartphoneSimulator';

const UPI_SCENARIOS: AppScenario[] = [
  {
    id: 1,
    appName: 'upi',
    sender: 'refund_manager_sbi',
    avatarText: '💸',
    initialText: 'SBI Double Debit Refund Request: "SBI Refund Manager requested ₹4,999. Click Pay and enter your UPI PIN to claim your refund for yesterday\'s failed transaction."',
    options: [
      {
        text: '❌ Decline collect request and report UPI ID',
        isCorrect: true,
        explanation: '✓ PERFECT! This is a "Collect Request" scam. Scammers send debit requests with fake names ("SBI Refund") hoping you type your PIN, which immediately transfers your money to them.',
        points: 25,
        coins: 10
      },
      {
        text: '💸 Click Pay & enter UPI PIN',
        isCorrect: false,
        explanation: '🚨 DEFAULTER! You typed your UPI PIN, which immediately transferred ₹4,999 from your bank to the scammer.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 2,
    appName: 'upi',
    sender: 'Lucky GPay Draw',
    avatarText: '📱',
    initialText: 'You received a QR code card on Telegram. The post claims: "Scan this QR code using GPay and input your PIN to receive ₹2,500 cash prize!"',
    qrCodes: [
      {
        id: 1,
        imageLabel: '🎁 CASHBACK QR',
        description: 'Sent on Telegram. Prompts you to scan and enter PIN to receive cashback.',
        isSafe: false,
        explanation: '🚨 SCAMMED! You scanned a malicious cashback QR code. Entering your PIN transfers your money out.'
      },
      {
        id: 2,
        imageLabel: '🛒 COUNTER QR',
        description: 'Official printed sticker standee at a trusted stationery store checkout.',
        isSafe: true,
        explanation: '✓ SECURE! Scanning printed checkout QR codes in person at physical shops is safe. Make sure the payee name matches the shop.'
      },
      {
        id: 3,
        imageLabel: '🏷️ STREET STICKER',
        description: 'Sticker stuck on a lamp post claiming "Scan for free mobile data".',
        isSafe: false,
        explanation: '🚨 MALWARE ALERT! Scanning untrusted sticker QR codes in public places often installs adware or tracks your device.'
      },
      {
        id: 4,
        imageLabel: '✉️ SMS BILL LINK',
        description: 'QR image sent via SMS asking to pay electricity dues to avoid disconnection.',
        isSafe: false,
        explanation: '🚨 FRAUD TRIGGERED! Scammers send fake bills with custom QR codes to bypass official utility portals.'
      }
    ],
    options: []
  },
  {
    id: 3,
    appName: 'upi',
    sender: 'starstationers@okaxis',
    avatarText: '🛒',
    initialText: 'Pay ₹85.00 for school notebooks. You are at the cashier counter. Scanning the official merchant QR standee on the counter displays payee ID "starstationers@okaxis".',
    options: [
      {
        text: '✅ Tap Pay & enter PIN to authorize',
        isCorrect: true,
        explanation: '✓ CORRECT! Paying a verified store merchant in-person for goods you are actively buying is completely safe.',
        points: 25,
        coins: 10
      },
      {
        text: '❌ Decline transaction and run away',
        isCorrect: false,
        explanation: '🚨 WRONG. This was a normal, safe billing payment. Declining verification blocks you from buying your stationery.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 4,
    appName: 'upi',
    sender: 'Free Pizza Voucher',
    avatarText: '🍕',
    initialText: 'Scan this QR to get a 100% Free Pizza Voucher at Domino\'s. You must enter your 6-digit UPI PIN to verify your voucher eligibility.',
    options: [
      {
        text: '❌ Decline and delete message',
        isCorrect: true,
        explanation: '✓ CORRECT! Free vouchers never require you to input your UPI security PIN. Entering your PIN only transfers money out of your account.',
        points: 25,
        coins: 10
      },
      {
        text: '🍕 Scan & Enter UPI PIN',
        isCorrect: false,
        explanation: '🚨 LOST CASH! Entering your PIN authorized a transaction that sent ₹2,000 to the fraudster instead of getting free pizza.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 5,
    appName: 'upi',
    sender: 'Classmate Preeti',
    avatarText: '👧',
    initialText: 'Hey, thanks for paying for my lunch yesterday. I am transferring the ₹120.00 I owed you via GPay. The payment has been sent successfully to your linked account.',
    options: [
      {
        text: '✅ Accept and verify deposit on bank statement',
        isCorrect: true,
        explanation: '✓ PERFECT DECISION! Receiving money via UPI does NOT require you to enter any PIN or authorize any payment. Simply check your account balance to confirm the credit.',
        points: 25,
        coins: 10
      },
      {
        text: '❌ Click to decline transaction and block Preeti',
        isCorrect: false,
        explanation: '🚨 INCORRECT: This is a legitimate credit transaction from your friend. You don\'t need to decline it or block her, just let the money sit in your account safely!',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 6,
    appName: 'upi',
    sender: 'OLX Buyer (Hitesh)',
    avatarText: '👜',
    initialText: 'Hi, I want to buy the old bicycle you listed on OLX. I am sending you a GPay payment request link. Open the link and type your UPI PIN to claim the ₹4,000 advance payment.',
    options: [
      {
        text: '❌ Decline collect request and cancel sale',
        isCorrect: true,
        explanation: '✓ CORRECT! To receive money, you NEVER need to input your PIN. Any buyer who sends a link asking you to enter your PIN to "receive" cash is a scammer.',
        points: 25,
        coins: 10
      },
      {
        text: '💸 Click link and enter PIN to receive cash',
        isCorrect: false,
        explanation: '🚨 CLEANED OUT! Instead of receiving ₹4,000, you authorized a payment of ₹4,000 to be debited from your account.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 7,
    appName: 'upi',
    sender: 'AD-POWERSUPPLY',
    avatarText: '⚡',
    initialText: 'Legitimate electricity bill notice: Your power bill of ₹1,430 has been generated. The official auto-debit will execute on 25th July. To review or change details, log into your official State Power App.',
    options: [
      {
        text: '✅ Keep auto-debit active on the official app',
        isCorrect: true,
        explanation: '✓ PERFECT! Setting up official utility auto-debits is safe and convenient. Always review charges in your official state app rather than clicking random SMS links.',
        points: 25,
        coins: 10
      },
      {
        text: '❌ Report payee ID as fraud and block billing',
        isCorrect: false,
        explanation: '🚨 INCORRECT: Legitimate billing notices help you track expenses. Blocking them might cause you to miss payments and face service disconnection.',
        points: 0,
        coins: 0
      }
    ]
  },
  {
    id: 8,
    appName: 'upi',
    sender: 'Scratch Card Rewards',
    avatarText: '🃏',
    initialText: 'Congratulations! You received a scratch card in the mail. Scratching it reveals a ₹5,000 winner! Scan this QR code to claim your prize instantly.',
    options: [
      {
        text: '❌ Discard the card and report the sender',
        isCorrect: true,
        explanation: '✓ CORRECT! Fake lottery scratch cards mailed to houses are common scams. Scanning the QR code prompts you to enter your PIN, which is a trap to steal your funds.',
        points: 25,
        coins: 10
      },
      {
        text: '💸 Scan QR code to transfer prize money',
        isCorrect: false,
        explanation: '🚨 TRAPPED! The QR code redirected you to a malicious transaction page, draining ₹5,000 from your account.',
        points: 0,
        coins: 0
      }
    ]
  }
];

export const MissionUPI: React.FC = () => {
  const { completeMission } = useGame();
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const handleMissionComplete = (score: number, maxScore: number) => {
    setFinalScore(score);
    
    let stars = 1;
    if (score === maxScore) stars = 3;
    else if (score >= maxScore - 1) stars = 2;

    completeMission('upi', stars, 200, 100);
    setShowSummary(true);

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.65 }
      });
    } catch(e){}
  };

  if (showSummary) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="glass-panel-strong rounded-3xl p-6 sm:p-8 max-w-md w-full text-center flex flex-col items-center gap-6 shadow-xl">
          <div className="p-4 bg-emerald-100 border-2 border-emerald-500/40 rounded-full text-emerald-700 shadow-md">
            <ShieldCheck className="w-14 h-14" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wider">Mission 4 Complete!</h2>
            <p className="text-sm text-indigo-700 font-extrabold uppercase mt-1 tracking-widest font-sans">
              QR Detective Badge Earned
            </p>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 w-full text-center shadow-inner">
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest font-sans">Payment Security Accuracy</div>
            <div className="text-3xl font-black text-slate-900 mt-1">
              {finalScore} / {UPI_SCENARIOS.length} Scenarios Checked
            </div>
            
            <div className="flex justify-around items-center mt-4 pt-3 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-600 block font-bold">Reward</span>
                <span className="text-indigo-700 font-black text-sm">+200 XP</span>
              </div>
              <div className="w-px h-6 bg-slate-300"></div>
              <div>
                <span className="text-slate-600 block font-bold">Bonus</span>
                <span className="text-cyan-700 font-black text-sm">+100 Coins</span>
              </div>
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
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-wide">MISSION 4: UPI + QR SAFETY</h2>
          <p className="text-xs text-indigo-700 font-black uppercase tracking-wider mt-0.5">
            Verify payment collection cards and inspect QR scanner requests
          </p>
        </div>
      </div>

      <SmartphoneSimulator
        scenarios={UPI_SCENARIOS}
        missionName="UPI + QR Safety"
        badgeName="QR Detective"
        onMissionComplete={handleMissionComplete}
      />
    </div>
  );
};

