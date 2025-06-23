// src/app/withdrawal/withdrawalData.js

export const countryConfig = {
  Global: {
    Cash:        ['paypal',],
    'Gift Cards':['amazon'],
    Games:       ['roblox', 'free-fire'],
  },
  India: {
    Cash:        ['upi'],
    'Gift Cards':['google-play-redeem-code', 'amazon-india', 'flipkart', 'steam'],
    Games:       ['free-fire', 'bgmi', 'call-of-duty'],
  },
  USA: {
    Cash:        ['paypal'],
    'Gift Cards':['amazon', 'google-play', 'steam'],
    Games:       ['roblox', 'fortnite'], // if you add Fortnite later, use 'fortnite'
  },
  Philippines: {
    Cash:        ['paypal', 'gcash'],
    'Gift Cards':['amazon', 'steam'],
    Games:       ['mobile-legends', 'call-of-duty', 'free-fire', 'pubz'],
  },
  UK: {
    Cash:        ['paypal'],
    'Gift Cards':['amazon', 'steam', 'google-play'],
    Games:       ['roblox','call-of-duty', 'pubz'],
  },
  Brazil: {
    Cash:        ['paypal'],
    'Gift Cards':['amazon', 'steam', 'google-play'],
    Games:       ['roblox', 'free-fire','call-of-duty', 'minecraft'],
  },
  Australia: {
    Cash:        ['paypal'],
    'Gift Cards':['amazon', 'steam'],
    Games:       ['roblox', 'call-of-duty', 'pubz', 'free-fire'],
  },
  Germany: {
    Cash:        ['paypal'],
    'Gift Cards':['amazon', 'steam'],
    Games:       ['roblox'],
  },
  Italy: {
    Cash:        ['paypal'],
    'Gift Cards':['amazon', 'steam'],
    Games:       ['roblox', 'call of duty', 'free fire', 'pubz'],
  },
  France: {
    Cash:        ['paypal'],
    'Gift Cards':['amazon', 'google-play', 'steam'],
    Games:       ['roblox', 'call of duty'],
  },
  Portugal: {
    Cash:        ['paypal'],
    'Gift Cards':['amazon'],
    Games:       ['roblox', 'call of duty'],
  },
  Pakistan: {
    Cash:        ['paypal'],
    'Gift Cards':['amazon'],
    Games:       ['free-fire','pubz' ]
  },
  // ...other countries
};