import { NFTGift, Case } from './types';

// Drop items for the Pepe Plush case
// Probabilities are encoded in dropChance for weighted random selection
export const PEPE_DROPS: (NFTGift & { dropChance: number })[] = [
  {
    id: 'drop1',
    name: 'Scared Cat',
    rarity: 'Common',
    price: 0.5,
    image: '/cases/plush/drop/Scared_Cat 60%.png',
    serialNumber: '#0001',
    dropChance: 60
  },
  {
    id: 'drop2',
    name: 'Precious Peach',
    rarity: 'Rare',
    price: 3.0,
    image: '/cases/plush/drop/Precious_Peach 20%.png',
    serialNumber: '#0002',
    dropChance: 20
  },
  {
    id: 'drop3',
    name: 'Durov Cap',
    rarity: 'Epic',
    price: 12.0,
    image: '/cases/plush/drop/Durov_Cap 8%.png',
    serialNumber: '#0003',
    dropChance: 8
  },
  {
    id: 'drop4',
    name: 'Plush Pepe',
    rarity: 'Legendary',
    price: 50.0,
    image: '/cases/plush/drop/Plush_Pepe 2%.png',
    serialNumber: '#0004',
    dropChance: 2
  }
];

// Helper: weighted random pick based on dropChance
export function pickWeightedDrop(): NFTGift {
  const totalWeight = PEPE_DROPS.reduce((sum, d) => sum + d.dropChance, 0);
  let rand = Math.random() * totalWeight;
  for (const drop of PEPE_DROPS) {
    rand -= drop.dropChance;
    if (rand <= 0) {
      const { dropChance, ...gift } = drop;
      return gift;
    }
  }
  // fallback
  const { dropChance, ...fallback } = PEPE_DROPS[0];
  return fallback;
}

export const CASES: Case[] = [
  {
    id: 'pepe-plush',
    name: 'Pepe Plush',
    price: 5.0,
    image: '/cases/plush/plush.png',
    items: PEPE_DROPS.map(({ dropChance, ...gift }) => gift)
  }
];

export const MOCK_GIFTS: NFTGift[] = PEPE_DROPS.map(({ dropChance, ...gift }) => gift);
