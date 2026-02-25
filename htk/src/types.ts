export interface NFTGift {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  price: number; // in TON
  image: string;
  serialNumber?: string;
}

export interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  items: NFTGift[];
}

export interface UserState {
  balance: number;
  inventory: NFTGift[];
  username: string;
}
