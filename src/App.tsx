/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, 
  Package, 
  TrendingUp, 
  User, 
  Gift, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  RefreshCw,
  Coins,
  History
} from 'lucide-react';
import { cn } from './lib/utils';
import { NFTGift, Case, UserState } from './types';
import { CASES, MOCK_GIFTS } from './constants';

// --- Components ---

const Header = ({ state }: { state: UserState }) => (
  <header className="sticky top-0 z-50 w-full glass px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
        <Zap className="w-5 h-5 text-white fill-white" />
      </div>
      <span className="font-bold tracking-tight text-lg">TON CYBER</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
        <Coins className="w-4 h-4 text-accent" />
        <span className="font-mono font-medium">{state.balance.toFixed(2)}</span>
        <span className="text-[10px] opacity-50 font-bold uppercase tracking-wider">TON</span>
      </div>
      <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
        <User className="w-4 h-4" />
      </div>
    </div>
  </header>
);

const CaseCard = ({ caseData, onOpen }: { caseData: Case, onOpen: (c: Case) => void }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onOpen(caseData)}
    className="relative group cursor-pointer"
  >
    <div className="absolute inset-0 bg-accent/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative glass rounded-2xl overflow-hidden p-4 flex flex-col gap-4">
      <div className="aspect-square rounded-xl overflow-hidden bg-white/5 relative">
        <img 
          src={caseData.image} 
          alt={caseData.name} 
          className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-lg leading-tight">{caseData.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono text-sm font-bold">{caseData.price}</span>
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">
            Open Case
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const InventoryItem = ({ item, onUpgrade }: { item: NFTGift, onUpgrade?: (item: NFTGift) => void }) => (
  <div className={cn(
    "glass rounded-xl p-3 flex flex-col gap-3 relative overflow-hidden group",
    `rarity-glow-${item.rarity.toLowerCase()}`
  )}>
    <div className="aspect-square rounded-lg overflow-hidden bg-white/5">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
    </div>
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
          item.rarity === 'Common' && "bg-rarity-common/20 text-rarity-common",
          item.rarity === 'Rare' && "bg-rarity-rare/20 text-rarity-rare",
          item.rarity === 'Epic' && "bg-rarity-epic/20 text-rarity-epic",
          item.rarity === 'Legendary' && "bg-rarity-legendary/20 text-rarity-legendary",
          item.rarity === 'Mythic' && "bg-rarity-mythic/20 text-rarity-mythic",
        )}>
          {item.rarity}
        </span>
        <span className="text-[9px] font-mono opacity-50">{item.serialNumber}</span>
      </div>
      <h4 className="font-bold text-sm truncate">{item.name}</h4>
      <div className="flex items-center gap-1 mt-1">
        <Coins className="w-3 h-3 text-accent" />
        <span className="font-mono text-xs">{item.price}</span>
      </div>
    </div>
    {onUpgrade && (
      <button 
        onClick={() => onUpgrade(item)}
        className="mt-2 w-full py-2 rounded-lg bg-accent/10 hover:bg-accent/20 border border-accent/20 text-[10px] font-bold uppercase tracking-widest transition-colors"
      >
        Upgrade
      </button>
    )}
  </div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserState>({
    balance: 100.0,
    inventory: [],
    username: "CyberWhale"
  });

  const [view, setView] = useState<'cases' | 'inventory' | 'upgrade' | 'parsing'>('cases');
  const [openingCase, setOpeningCase] = useState<Case | null>(null);
  const [wonItem, setWonItem] = useState<NFTGift | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<NFTGift | null>(null);
  const [parsingGifts, setParsingGifts] = useState(false);

  const handleOpenCase = (c: Case) => {
    if (user.balance < c.price) return;
    
    setUser(prev => ({ ...prev, balance: prev.balance - c.price }));
    setOpeningCase(c);
    
    // Simulate opening
    setTimeout(() => {
      const randomItem = c.items[Math.floor(Math.random() * c.items.length)];
      setWonItem(randomItem);
      setUser(prev => ({ ...prev, inventory: [...prev.inventory, { ...randomItem, id: Math.random().toString() }] }));
    }, 2000);
  };

  const handleUpgrade = (item: NFTGift) => {
    setIsUpgrading(true);
    // 50% chance to upgrade
    setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        const upgradedItem = {
          ...item,
          price: item.price * 2,
          name: `Elite ${item.name}`,
          rarity: item.rarity === 'Common' ? 'Rare' : 
                  item.rarity === 'Rare' ? 'Epic' : 
                  item.rarity === 'Epic' ? 'Legendary' : 'Mythic'
        } as NFTGift;
        setUser(prev => ({
          ...prev,
          inventory: prev.inventory.map(i => i.id === item.id ? upgradedItem : i)
        }));
        setWonItem(upgradedItem);
      } else {
        setUser(prev => ({
          ...prev,
          inventory: prev.inventory.filter(i => i.id !== item.id)
        }));
        setWonItem(null);
        alert("Upgrade failed! Item lost.");
      }
      setIsUpgrading(false);
      setUpgradeTarget(null);
    }, 1500);
  };

  const simulateParsing = () => {
    setParsingGifts(true);
    setTimeout(() => {
      setParsingGifts(false);
      // In a real app, this would fetch from Fragment or Telegram API
    }, 3000);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col pb-24">
      <Header state={user} />

      <main className="flex-1 p-4">
        <AnimatePresence mode="wait">
          {view === 'cases' && (
            <motion.div 
              key="cases"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">Cyber Cases</h2>
                <button 
                  onClick={simulateParsing}
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
                >
                  <RefreshCw className={cn("w-3 h-3", parsingGifts && "animate-spin")} />
                  {parsingGifts ? 'Parsing...' : 'Parse Gifts'}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {CASES.map(c => (
                  <CaseCard key={c.id} caseData={c} onOpen={handleOpenCase} />
                ))}
              </div>
            </motion.div>
          )}

          {view === 'inventory' && (
            <motion.div 
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">My Vault</h2>
              {user.inventory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                  <Package className="w-16 h-16" />
                  <p className="font-bold uppercase tracking-widest text-xs">Inventory Empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {user.inventory.map(item => (
                    <InventoryItem 
                      key={item.id} 
                      item={item} 
                      onUpgrade={(i) => {
                        setUpgradeTarget(i);
                        setView('upgrade');
                      }} 
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'upgrade' && (
            <motion.div 
              key="upgrade"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8 items-center py-10"
            >
              <h2 className="text-2xl font-black tracking-tighter uppercase italic self-start">Nano Upgrade</h2>
              
              {upgradeTarget ? (
                <div className="w-full flex flex-col items-center gap-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/30 blur-3xl animate-pulse" />
                    <InventoryItem item={upgradeTarget} />
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div className="flex items-center gap-4 w-full justify-center">
                      <div className="h-[1px] flex-1 bg-white/10" />
                      <Zap className="w-6 h-6 text-accent animate-bounce" />
                      <div className="h-[1px] flex-1 bg-white/10" />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Success Rate</p>
                      <p className="text-4xl font-black tracking-tighter">50%</p>
                    </div>

                    <button 
                      onClick={() => handleUpgrade(upgradeTarget)}
                      disabled={isUpgrading}
                      className="w-full py-4 rounded-2xl bg-accent text-white font-black uppercase tracking-widest shadow-lg shadow-accent/20 disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isUpgrading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5" />
                          Initiate Upgrade
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={() => {
                        setUpgradeTarget(null);
                        setView('inventory');
                      }}
                      className="text-[10px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 opacity-30 gap-4">
                  <TrendingUp className="w-16 h-16" />
                  <p className="font-bold uppercase tracking-widest text-xs">Select an item to upgrade</p>
                  <button 
                    onClick={() => setView('inventory')}
                    className="mt-4 px-6 py-2 rounded-full border border-white/20 text-[10px] font-bold uppercase tracking-widest"
                  >
                    Go to Vault
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* --- Modals --- */}
      
      <AnimatePresence>
        {openingCase && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <div className="w-full max-w-xs flex flex-col items-center gap-8">
              {!wonItem ? (
                <div className="flex flex-col items-center gap-6">
                  <motion.div 
                    animate={{ 
                      rotate: [0, -5, 5, -5, 5, 0],
                      scale: [1, 1.05, 1, 1.05, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="w-48 h-48 rounded-3xl bg-accent/20 border-2 border-accent/40 flex items-center justify-center"
                  >
                    <Package className="w-20 h-20 text-accent" />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="text-xl font-black uppercase tracking-widest">Opening...</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-2">Decrypting NFT Data</p>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-8 w-full"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-accent">Item Unlocked</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Added to your vault</p>
                  </div>
                  
                  <div className="w-full">
                    <InventoryItem item={wonItem} />
                  </div>

                  <button 
                    onClick={() => {
                      setOpeningCase(null);
                      setWonItem(null);
                    }}
                    className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest"
                  >
                    Collect Item
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Navigation --- */}
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
        <div className="max-w-md mx-auto glass rounded-2xl p-2 flex items-center justify-between shadow-2xl shadow-black">
          <NavButton 
            active={view === 'cases'} 
            onClick={() => setView('cases')} 
            icon={<Package className="w-5 h-5" />} 
            label="Cases" 
          />
          <NavButton 
            active={view === 'upgrade'} 
            onClick={() => setView('upgrade')} 
            icon={<TrendingUp className="w-5 h-5" />} 
            label="Upgrade" 
          />
          <NavButton 
            active={view === 'inventory'} 
            onClick={() => setView('inventory')} 
            icon={<Wallet className="w-5 h-5" />} 
            label="Vault" 
          />
          <NavButton 
            active={false} 
            onClick={() => alert("History coming soon")} 
            icon={<History className="w-5 h-5" />} 
            label="Stats" 
          />
        </div>
      </nav>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300",
      active ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-white/40 hover:text-white/60"
    )}
  >
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);
