// src/app/withdrawal/withdrawalItems.js

/**
 * Master list of withdrawal items: keys match the values in countryConfig.
 * Each item has a display name, an icon URL, and a path segment.
 */
export const withdrawalItems = {
  // Cash options
  upi: {
    name: 'UPI',
    icon: '/upi.svg',
    path: 'upi',
  },
  paypal: {
    name: 'PayPal',
    icon: '/paypal.svg',
    path: 'paypal',
  },
  gcash: {
    name: 'GCash',
    icon: '/gcash.webp',
    path: 'gcash',
  },

  // Gift Cards
  'google-play': {
    name: 'Google Play',
    icon: '/google-play.svg',
    path: 'google-play',
  },

  'google-play-redeem-code': {
    name: 'Google Play',
    icon: '/google-play.svg',
    path: 'google-play-redeem-code',
  },

  amazon: {
    name: 'Amazon',
    icon: '/amazon-gift-card.svg',
    path: 'amazon',
  },

  'amazon-india': {
    name: 'Amazon',
    icon: '/amazon-gift-card.svg',
    path: 'amazon-india',
  },

  flipkart: {
    name: 'Flipkart',
    icon: '/flipkart.svg',
    path: 'flipkart',
  },

  steam: {
    name: 'Steam',
    icon: '/steam.svg',
    path: 'steam',
  },

  // Games
  roblox: {
    name: 'Roblox (Robux)',
    icon: '/roblox-robux.svg',
    path: 'roblox',
  },

  'free-fire': {
    name: 'Free Fire (Diamonds)',
    icon: '/free-fire-diamond.png',
    path: 'free-fire',
  },

  bgmi: {
    name: 'BGMI (UC)',
    icon: '/uc.png',
    path: 'bgmi',
  },

  pubz: {
    name: 'PUBZ MOBILE (UC)',
    icon: '/uc.png',
    path: 'pubz',
  },

  'call-of-duty': {
    name: 'Call of Duty (CP)',
    icon: '/call-of-duty-mobile-cp.png',
    path: 'call-of-duty',
  },

  'mobile-legends': {
    name: 'Mobile Legends (Diamonds)',
    icon: '/mobile-legends-diamond.webp',
    path: 'mobile-legends',
  },
  
  'fortnite': {
    name: 'Fortnite (Vbucks)',
    icon: '/fortnite-v-bucks.webp',
    path: 'fortnite',
  },
};