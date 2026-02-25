import { NFTGift, Case } from './types';

export const MOCK_GIFTS: NFTGift[] = [
  {
    id: 'g1',
    name: 'Cyber Lotus',
    rarity: 'Legendary',
    price: 15.5,
    image: 'https://picsum.photos/seed/lotus/400/400',
    serialNumber: '#0042'
  },
  {
    id: 'g2',
    name: 'Neon Skull',
    rarity: 'Epic',
    price: 8.2,
    image: 'https://picsum.photos/seed/skull/400/400',
    serialNumber: '#1337'
  },
  {
    id: 'g3',
    name: 'Golden Ticket',
    rarity: 'Mythic',
    price: 120.0,
    image: 'https://picsum.photos/seed/gold/400/400',
    serialNumber: '#0001'
  },
  {
    id: 'g4',
    name: 'Ether Blade',
    rarity: 'Rare',
    price: 3.4,
    image: 'https://picsum.photos/seed/blade/400/400',
    serialNumber: '#8888'
  },
  {
    id: 'g5',
    name: 'Data Core',
    rarity: 'Common',
    price: 0.5,
    image: 'https://picsum.photos/seed/core/400/400',
    serialNumber: '#9999'
  }
];

export const CASES: Case[] = [
  {
    id: 'c1',
    name: 'Starter Case',
    price: 1.0,
    image: 'https://picsum.photos/seed/case1/400/400',
    items: MOCK_GIFTS.filter(g => ['Common', 'Rare'].includes(g.rarity))
  },
  {
    id: 'c2',
    name: 'Elite Cyber',
    price: 10.0,
    image: 'https://picsum.photos/seed/case2/400/400',
    items: MOCK_GIFTS.filter(g => ['Rare', 'Epic', 'Legendary'].includes(g.rarity))
  },
  {
    id: 'c3',
    name: 'TON Whale',
    price: 50.0,
    image: 'https://picsum.photos/seed/case3/400/400',
    items: MOCK_GIFTS.filter(g => ['Legendary', 'Mythic'].includes(g.rarity))
  }
];
