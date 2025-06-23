// src/app/withdrawal/withdrawalTiers.js

/**
 * Defines redeem tiers for each withdrawal option.
 * Each key corresponds to the `path` in withdrawalItems and countryConfig.
 */
export const withdrawalTiers = {
  paypal: [
    { label: '$1', points: 1000, value: 1 },
    { label: '$2', points: 2000, value: 2 },
    { label: '$3', points: 3000, value: 3 },
    { label: '$5', points: 5000, value: 5 },
  ],
  upi: [
    { label: 'Rs 5', points: 500, value: 1 },
    { label: 'Rs-10', points: 1000, value: 2 },
    { label: 'Rs 20', points: 2000, value: 3 },
    { label: 'Rs 30', points: 3000, value: 5 },
  ],

    gcash: [
    { label: '₱50', points: 5000, value: 50 },
    { label: '₱100', points: 10000, value: 100 },
    { label: '₱200', points: 20000, value: 200 },
  ],


    // gift cards
  'google-play-redeem-code': [
    { label: 'Rs10',  points: 2,  value: 5 },
    { label: 'Rs20', points: 10000, value: 10 },
    { label: 'Rs30', points: 25000, value: 25 },
    { label: 'Rs50', points: 50000, value: 50 },
  ],

  'google-play': [
    { label: '$5',  points: 5000,  value: 5 },
    { label: '$10', points: 10000, value: 10 },
    { label: '$25', points: 25000, value: 25 },
    { label: '$50', points: 50000, value: 50 },
  ],

  amazon: [
    { label: '$5',  points: 5,  value: 5 },
    { label: '$10', points: 10000, value: 10 },
    { label: '$25', points: 25000, value: 25 },
    { label: '$50', points: 50000, value: 50 },
  ],
  'amazon-india': [
    { label: 'Rs 100',  points: 5000,  value: 5 },
    { label: 'Rs 200', points: 10000, value: 10 },
    { label: 'Rs 500', points: 25000, value: 25 },
    { label: 'Rs 600', points: 50000, value: 50 },
  ],

  flipkart: [
    { label: '₹500',  points: 5000,  value: 500 },
    { label: '₹1000', points: 10000, value: 1000 },
    { label: '₹2000', points: 20000, value: 2000 },
  ],

  steam: [
    { label: '$5',  points: 5000,  value: 5 },
    { label: '$10', points: 10000, value: 10 },
    { label: '$20', points: 20000, value: 20 },
    { label: '$50', points: 50000, value: 50 },
  ],

  // Games cuerency

  roblox: [
    { label: '800 robux',  points: 5000,  value: 500 },
    { label: '1000 robux', points: 10000, value: 1000 },
    { label: '2000 robux', points: 20000, value: 2000 },
  ],
   
  pubz: [
    { label: '800 uc',  points: 5000,  value: 500 },
    { label: '1000 uc', points: 10000, value: 1000 },
    { label: '2000 uc', points: 20000, value: 2000 },
  ],

  bgmi: [
    { label: '800 UC',  points: 5000,  value: 500 },
    { label: '1000 UC', points: 10000, value: 1000 },
    { label: '2000 UC', points: 20000, value: 2000 },
  ],

    'free-fire': [
    { label: '50 Diamonds',   points: 1200,  value: 50 },
    { label: '100 Diamonds',  points: 2200,  value: 100 },
    { label: '300 Diamonds',  points: 6000,  value: 300 },
    { label: '600 Diamonds',  points: 11000, value: 600 },
  ],

  'call-of-duty': [
    { label: '800 CP',  points: 5000,  value: 500 },
    { label: '1000 CP', points: 10000, value: 1000 },
    { label: '2000 CP', points: 20000, value: 2000 },
  ],

    'mobile-legends': [
    { label: '50 Diamonds',   points: 1200,  value: 50 },
    { label: '100 Diamonds',  points: 2200,  value: 100 },
    { label: '300 Diamonds',  points: 6000,  value: 300 },
    { label: '600 Diamonds',  points: 11000, value: 600 },
  ],

    'fortnite': [
    { label: '50 V bucks',   points: 1200,  value: 50 },
    { label: '100 V Bucks',  points: 2200,  value: 100 },
    { label: '300 V Bucks',  points: 6000,  value: 300 },
    { label: '600 V Bucks',  points: 11000, value: 600 },
  ],

  // ...add additional items here
};