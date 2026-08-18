import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Coins, Zap, Lock, Check } from 'lucide-react';

interface AvatarItem {
  id: string;
  name: string;
  category: 'hairstyle' | 'glasses' | 'jacket' | 'pet' | 'wings';
  cost: number;
  icon: string;
  visualDetail: string;
}

export const AvatarCustomizer: React.FC = () => {
  const { user, addCoins, addXP } = useGame();
  
  // Local equipped states
  const [equippedHairstyle, setEquippedHairstyle] = useState<string>('default');
  const [equippedGlasses, setEquippedGlasses] = useState<string>('none');
  const [equippedJacket, setEquippedJacket] = useState<string>('cadet_hoodie');
  const [equippedPet, setEquippedPet] = useState<string>('none');
  const [equippedWings, setEquippedWings] = useState<string>('none');
  const [equippedTitle, setEquippedTitle] = useState<string>('ROOKIE STUDENT');

  const [unlockedItems, setUnlockedItems] = useState<string[]>([
    'default', 'none', 'cadet_hoodie'
  ]);

  if (!user) return null;

  const catalog: AvatarItem[] = [
    // Hairstyles
    { id: 'mohawk', name: 'Neon Mohawk', category: 'hairstyle', cost: 40, icon: '💇‍♂️', visualDetail: 'Hot Pink spikes' },
    { id: 'spikes', name: 'Cyber Spikes', category: 'hairstyle', cost: 60, icon: '💇', visualDetail: 'Teal spiky hair' },
    { id: 'dreads', name: 'Matrix Dreads', category: 'hairstyle', cost: 80, icon: '💇‍♀️', visualDetail: 'Holographic dreads' },
    
    // Glasses
    { id: 'visor', name: 'VR Visor', category: 'glasses', cost: 50, icon: '🕶️', visualDetail: 'Glowing cyan visor' },
    { id: 'goggles', name: 'Neon Goggles', category: 'glasses', cost: 70, icon: '🥽', visualDetail: 'Purple lens goggles' },
    { id: 'monocle', name: 'Holo Monocle', category: 'glasses', cost: 90, icon: '🧐', visualDetail: 'Glowing green scope' },
    
    // Jackets
    { id: 'blazer', name: 'Neon Blazer', category: 'jacket', cost: 60, icon: '🧥', visualDetail: 'LED lined jacket' },
    { id: 'nano', name: 'Nanotech Hoodie', category: 'jacket', cost: 100, icon: '🥋', visualDetail: 'Stealth grey nanoshield' },
    { id: 'matrix', name: 'Shield Matrix', category: 'jacket', cost: 120, icon: '👔', visualDetail: 'Plasma armored chest' },
    
    // Pets
    { id: 'pup', name: 'Robo Pup', category: 'pet', cost: 120, icon: '🐶', visualDetail: 'Floating puppy droid' },
    { id: 'kitty', name: 'Nano Kitty', category: 'pet', cost: 150, icon: '🐱', visualDetail: 'Holographic pixel cat' },
    { id: 'drone', name: 'Hover Drone', category: 'pet', cost: 200, icon: '🛸', visualDetail: 'Sentry defensive drone' },

    // Wings
    { id: 'cyberwings', name: 'Cyber Wings', category: 'wings', cost: 160, icon: '🦋', visualDetail: 'Glowing blue wings' },
    { id: 'phoenix', name: 'Fire Phoenix', category: 'wings', cost: 220, icon: '🦅', visualDetail: 'Flashing red solar plumes' }
  ];

  const titles = [
    'CYBER STUDENT',
    'OTP GUARDIAN',
    'FIREWALL MASTER',
    'QR DETECTIVE',
    'PHISHING SLAYER',
    'DIGITAL DEFENDER'
  ];

  const handlePurchase = (item: AvatarItem) => {
    if (unlockedItems.includes(item.id)) return;

    if (user.coins >= item.cost) {
      addCoins(-item.cost);
      setUnlockedItems((prev) => [...prev, item.id]);
      addXP(15);
      alert(`Unlocked ${item.name}!`);
    } else {
      alert(`Not enough safety coins! Solve more missions to earn coins.`);
    }
  };

  const handleEquip = (item: AvatarItem) => {
    if (!unlockedItems.includes(item.id)) return;

    switch (item.category) {
      case 'hairstyle': setEquippedHairstyle(item.id); break;
      case 'glasses': setEquippedGlasses(item.id); break;
      case 'jacket': setEquippedJacket(item.id); break;
      case 'pet': setEquippedPet(item.id); break;
      case 'wings': setEquippedWings(item.id); break;
    }
  };

  const isEquipped = (item: AvatarItem) => {
    switch (item.category) {
      case 'hairstyle': return equippedHairstyle === item.id;
      case 'glasses': return equippedGlasses === item.id;
      case 'jacket': return equippedJacket === item.id;
      case 'pet': return equippedPet === item.id;
      case 'wings': return equippedWings === item.id;
      default: return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto font-sans relative z-10 flex flex-col md:flex-row gap-6 select-none">
      
      {/* Visual Avatar Preview Side Column */}
      <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
        
        {/* Inventory preview card */}
        <div className="bg-white border-2 border-[#E0F2FE] rounded-3xl p-6 flex flex-col items-center gap-4 text-center relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 to-cyan-400"></div>

          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Avatar Inspector</h3>

          {/* Interactive Composite Vector Preview */}
          <div className="w-36 h-36 bg-slate-900 border-2 border-indigo-200 rounded-2xl relative flex items-center justify-center overflow-hidden shadow-inner">
            <div className="absolute inset-0 cyber-grid opacity-20"></div>

            {/* Wing details background layer */}
            {equippedWings === 'cyberwings' && (
              <span className="absolute text-5xl animate-pulse text-cyan-400 blur-xs">🦋</span>
            )}
            {equippedWings === 'phoenix' && (
              <span className="absolute text-5xl animate-pulse text-rose-500 blur-xs">🦅</span>
            )}

            {/* Body */}
            <svg viewBox="0 0 100 100" className="w-24 h-24 relative z-10">
              {/* Head face */}
              <circle cx="50" cy="50" r="22" fill="#fed7aa" stroke="#f97316" strokeWidth="1.5" />
              
              {/* Equipped Jacket details */}
              {equippedJacket === 'cadet_hoodie' && (
                <path d="M 32 70 Q 50 62 68 70 L 68 95 L 32 95 Z" fill="#312e81" stroke="#4f46e5" strokeWidth="1.5" />
              )}
              {equippedJacket === 'blazer' && (
                <path d="M 32 70 Q 50 62 68 70 L 68 95 L 32 95 Z" fill="#030712" stroke="#ec4899" strokeWidth="2" />
              )}
              {equippedJacket === 'nano' && (
                <path d="M 32 70 Q 50 62 68 70 L 68 95 L 32 95 Z" fill="#334155" stroke="#10b981" strokeWidth="2" />
              )}
              {equippedJacket === 'matrix' && (
                <path d="M 32 70 Q 50 62 68 70 L 68 95 L 32 95 Z" fill="#1e1b4b" stroke="#06b6d4" strokeWidth="2.5" />
              )}

              {/* Eyes */}
              <circle cx="42" cy="48" r="3" fill="#1e293b" />
              <circle cx="58" cy="48" r="3" fill="#1e293b" />

              {/* Smile */}
              <path d="M 45 58 Q 50 63 55 58" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />

              {/* Equipped Glasses details */}
              {equippedGlasses === 'visor' && (
                <rect x="30" y="42" width="40" height="9" rx="2" fill="#06b6d4" />
              )}
              {equippedGlasses === 'goggles' && (
                <g>
                  <circle cx="40" cy="47" r="7" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                  <circle cx="60" cy="47" r="7" fill="none" stroke="#8b5cf6" strokeWidth="2" />
                  <line x1="47" y1="47" x2="53" y2="47" stroke="#8b5cf6" strokeWidth="2" />
                </g>
              )}
              {equippedGlasses === 'monocle' && (
                <circle cx="42" cy="48" r="8" fill="none" stroke="#10b981" strokeWidth="2" />
              )}

              {/* Equipped Hairstyles */}
              {equippedHairstyle === 'mohawk' && (
                <path d="M 42 29 Q 50 12 58 29 Z" fill="#ec4899" />
              )}
              {equippedHairstyle === 'spikes' && (
                <path d="M 33 30 L 38 20 L 45 28 L 50 18 L 55 28 L 62 20 L 67 30" fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
              )}
              {equippedHairstyle === 'dreads' && (
                <g fill="#a78bfa">
                  <rect x="30" y="22" width="6" height="15" rx="3" />
                  <rect x="64" y="22" width="6" height="15" rx="3" />
                  <rect x="47" y="20" width="6" height="12" rx="3" />
                </g>
              )}
            </svg>

            {/* Equipped Pet preview layer */}
            {equippedPet !== 'none' && (
              <div className="absolute bottom-2 right-2 text-2xl">
                {equippedPet === 'pup' && '🐶'}
                {equippedPet === 'kitty' && '🐱'}
                {equippedPet === 'drone' && '🛸'}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-black text-slate-800 text-base uppercase">{user.name}</h4>
            <span className="text-[10px] text-cyan-700 bg-cyan-100 border border-cyan-200 font-black uppercase tracking-wider px-3 py-1 rounded-full mt-1.5 inline-block">
              {equippedTitle}
            </span>
          </div>

          <div className="flex gap-4 border-t border-slate-100 pt-4 w-full justify-around text-xs font-black text-slate-700">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-indigo-600" /> {user.xp} XP</span>
            <span className="flex items-center gap-1.5"><Coins className="w-4 h-4 text-amber-500" /> {user.coins} Coins</span>
          </div>
        </div>

        {/* Title selector card */}
        <div className="bg-white border-2 border-[#E0F2FE] rounded-3xl p-5 flex flex-col gap-3 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">Equip Badge Title</h3>
          <div className="flex flex-col gap-2">
            {titles.map((title) => (
              <button
                key={title}
                onClick={() => setEquippedTitle(title)}
                className={`w-full py-2.5 px-3.5 rounded-xl text-left text-xs font-black transition-all border cursor-pointer
                  ${equippedTitle === title
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 border-indigo-800 text-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700'
                  }
                `}
              >
                {title}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Item Store Catalog grid */}
      <div className="flex-1 bg-white border-2 border-[#E0F2FE] rounded-3xl p-6 flex flex-col gap-6 shadow-sm">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Avatar Marketplace
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-1">Use safety coins earned in training missions to unlock cyber clothing and robot pets.</p>
        </div>

        {/* Catalog Categories */}
        <div className="flex flex-col gap-6">
          
          {/* Helper render function for item grid */}
          {[
            { key: 'hairstyle', title: '💇 Hairstyles' },
            { key: 'glasses', title: '🕶️ Cyber Visors & Goggles' },
            { key: 'jacket', title: '🧥 Cyber Jackets' },
            { key: 'pet', title: '🛸 Robot Pets & Companions' },
            { key: 'wings', title: '🦋 Plasma Wings' }
          ].map((cat) => (
            <div key={cat.key} className="flex flex-col gap-3">
              <span className="text-xs text-slate-600 uppercase font-black tracking-wider border-b-2 border-slate-100 pb-1.5">
                {cat.title}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {catalog.filter(i => i.category === cat.key).map((item) => {
                  const unlocked = unlockedItems.includes(item.id);
                  const equipped = isEquipped(item);

                  return (
                    <div 
                      key={item.id} 
                      className="bg-slate-50 border-2 border-slate-200 hover:border-indigo-400 rounded-2xl p-4 flex flex-col justify-between items-center gap-3 relative transition-all shadow-xs hover:shadow-sm"
                    >
                      <span className="text-4xl">{item.icon}</span>
                      <div className="text-center">
                        <h4 className="text-xs font-black text-slate-800">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">{item.visualDetail}</p>
                      </div>

                      {unlocked ? (
                        <button
                          onClick={() => handleEquip(item)}
                          className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1
                            ${equipped 
                              ? 'bg-emerald-100 border-2 border-emerald-300 text-emerald-800' 
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                            }
                          `}
                        >
                          {equipped ? <><Check className="w-3 h-3" /> Equipped</> : 'Equip'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePurchase(item)}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer shadow-xs transition-all"
                        >
                          <Lock className="w-3 h-3" />
                          <span>{item.cost} Coins</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};
