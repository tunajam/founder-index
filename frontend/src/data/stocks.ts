// S&P 500 stocks scored on Network Effects (1-10) and Founder-Led (1-10)
// Methodology:
// - Network Effects: Platform/marketplace dynamics, switching costs, data moats, ecosystem lock-in
// - Founder-Led: Active founder as CEO/chair, founder influence, skin in the game, long-term vision

export interface Stock {
  ticker: string
  name: string
  sector: string
  networkEffects: number // 1-10
  founderLed: number // 1-10
  marketCap?: string
}

export const stocks: Stock[] = [
  // === TECH — HIGH NETWORK EFFECTS + FOUNDER-LED ===
  { ticker: "META", name: "Meta Platforms", sector: "Communication Services", networkEffects: 10, founderLed: 10 },
  { ticker: "AMZN", name: "Amazon", sector: "Consumer Discretionary", networkEffects: 10, founderLed: 8 },
  { ticker: "GOOGL", name: "Alphabet", sector: "Communication Services", networkEffects: 10, founderLed: 7 },
  { ticker: "NFLX", name: "Netflix", sector: "Communication Services", networkEffects: 8, founderLed: 7 },
  { ticker: "NVDA", name: "NVIDIA", sector: "Technology", networkEffects: 9, founderLed: 10 },
  { ticker: "CRM", name: "Salesforce", sector: "Technology", networkEffects: 8, founderLed: 9 },
  { ticker: "ADBE", name: "Adobe", sector: "Technology", networkEffects: 8, founderLed: 3 },
  { ticker: "ORCL", name: "Oracle", sector: "Technology", networkEffects: 8, founderLed: 8 },
  { ticker: "NOW", name: "ServiceNow", sector: "Technology", networkEffects: 7, founderLed: 5 },
  { ticker: "PLTR", name: "Palantir", sector: "Technology", networkEffects: 7, founderLed: 9 },
  { ticker: "SHOP", name: "Shopify", sector: "Technology", networkEffects: 8, founderLed: 10 },
  
  // === PAYMENTS / FINTECH — STRONG NETWORK EFFECTS ===
  { ticker: "V", name: "Visa", sector: "Financials", networkEffects: 10, founderLed: 2 },
  { ticker: "MA", name: "Mastercard", sector: "Financials", networkEffects: 10, founderLed: 2 },
  { ticker: "PYPL", name: "PayPal", sector: "Financials", networkEffects: 8, founderLed: 4 },
  { ticker: "SQ", name: "Block (Square)", sector: "Financials", networkEffects: 8, founderLed: 9 },
  { ticker: "FIS", name: "Fidelity National", sector: "Financials", networkEffects: 7, founderLed: 2 },
  { ticker: "GPN", name: "Global Payments", sector: "Financials", networkEffects: 6, founderLed: 2 },
  { ticker: "AXP", name: "American Express", sector: "Financials", networkEffects: 8, founderLed: 2 },
  { ticker: "FI", name: "Fiserv", sector: "Financials", networkEffects: 7, founderLed: 2 },
  
  // === SOCIAL / MARKETPLACE ===
  { ticker: "ABNB", name: "Airbnb", sector: "Consumer Discretionary", networkEffects: 9, founderLed: 10 },
  { ticker: "BKNG", name: "Booking Holdings", sector: "Consumer Discretionary", networkEffects: 9, founderLed: 4 },
  { ticker: "UBER", name: "Uber", sector: "Industrials", networkEffects: 9, founderLed: 5 },
  { ticker: "DASH", name: "DoorDash", sector: "Consumer Discretionary", networkEffects: 8, founderLed: 10 },
  { ticker: "SNAP", name: "Snap", sector: "Communication Services", networkEffects: 7, founderLed: 10 },
  { ticker: "PINS", name: "Pinterest", sector: "Communication Services", networkEffects: 7, founderLed: 8 },
  { ticker: "ETSY", name: "Etsy", sector: "Consumer Discretionary", networkEffects: 8, founderLed: 3 },
  
  // === BIG TECH — HIGH NE, LOWER FOUNDER ===
  { ticker: "MSFT", name: "Microsoft", sector: "Technology", networkEffects: 10, founderLed: 4 },
  { ticker: "AAPL", name: "Apple", sector: "Technology", networkEffects: 9, founderLed: 3 },
  { ticker: "CSCO", name: "Cisco Systems", sector: "Technology", networkEffects: 7, founderLed: 3 },
  { ticker: "INTC", name: "Intel", sector: "Technology", networkEffects: 6, founderLed: 3 },
  { ticker: "IBM", name: "IBM", sector: "Technology", networkEffects: 6, founderLed: 2 },
  { ticker: "TXN", name: "Texas Instruments", sector: "Technology", networkEffects: 5, founderLed: 2 },
  
  // === SAAS / CLOUD ===
  { ticker: "SNOW", name: "Snowflake", sector: "Technology", networkEffects: 7, founderLed: 5 },
  { ticker: "DDOG", name: "Datadog", sector: "Technology", networkEffects: 6, founderLed: 10 },
  { ticker: "MDB", name: "MongoDB", sector: "Technology", networkEffects: 7, founderLed: 9 },
  { ticker: "CRWD", name: "CrowdStrike", sector: "Technology", networkEffects: 6, founderLed: 9 },
  { ticker: "ZS", name: "Zscaler", sector: "Technology", networkEffects: 5, founderLed: 9 },
  { ticker: "PANW", name: "Palo Alto Networks", sector: "Technology", networkEffects: 6, founderLed: 7 },
  { ticker: "WDAY", name: "Workday", sector: "Technology", networkEffects: 6, founderLed: 7 },
  { ticker: "TEAM", name: "Atlassian", sector: "Technology", networkEffects: 7, founderLed: 9 },
  { ticker: "HUBS", name: "HubSpot", sector: "Technology", networkEffects: 6, founderLed: 7 },
  { ticker: "TTD", name: "The Trade Desk", sector: "Technology", networkEffects: 7, founderLed: 10 },
  { ticker: "VEEV", name: "Veeva Systems", sector: "Technology", networkEffects: 7, founderLed: 9 },
  { ticker: "MNDY", name: "Monday.com", sector: "Technology", networkEffects: 6, founderLed: 10 },
  
  // === SEMIS / HARDWARE ===
  { ticker: "AMD", name: "AMD", sector: "Technology", networkEffects: 6, founderLed: 4 },
  { ticker: "AVGO", name: "Broadcom", sector: "Technology", networkEffects: 6, founderLed: 5 },
  { ticker: "QCOM", name: "Qualcomm", sector: "Technology", networkEffects: 7, founderLed: 3 },
  { ticker: "AMAT", name: "Applied Materials", sector: "Technology", networkEffects: 5, founderLed: 2 },
  { ticker: "LRCX", name: "Lam Research", sector: "Technology", networkEffects: 5, founderLed: 2 },
  { ticker: "KLAC", name: "KLA Corp", sector: "Technology", networkEffects: 5, founderLed: 2 },
  { ticker: "ASML", name: "ASML", sector: "Technology", networkEffects: 8, founderLed: 3 },
  { ticker: "TSM", name: "TSMC", sector: "Technology", networkEffects: 9, founderLed: 6 },
  { ticker: "ARM", name: "Arm Holdings", sector: "Technology", networkEffects: 8, founderLed: 4 },
  { ticker: "MRVL", name: "Marvell Technology", sector: "Technology", networkEffects: 5, founderLed: 3 },
  
  // === HEALTHCARE ===
  { ticker: "UNH", name: "UnitedHealth Group", sector: "Healthcare", networkEffects: 7, founderLed: 3 },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", networkEffects: 5, founderLed: 2 },
  { ticker: "LLY", name: "Eli Lilly", sector: "Healthcare", networkEffects: 5, founderLed: 2 },
  { ticker: "PFE", name: "Pfizer", sector: "Healthcare", networkEffects: 4, founderLed: 2 },
  { ticker: "ABBV", name: "AbbVie", sector: "Healthcare", networkEffects: 4, founderLed: 2 },
  { ticker: "TMO", name: "Thermo Fisher", sector: "Healthcare", networkEffects: 5, founderLed: 2 },
  { ticker: "DHR", name: "Danaher", sector: "Healthcare", networkEffects: 5, founderLed: 6 },
  { ticker: "ABT", name: "Abbott Labs", sector: "Healthcare", networkEffects: 4, founderLed: 2 },
  { ticker: "ISRG", name: "Intuitive Surgical", sector: "Healthcare", networkEffects: 7, founderLed: 6 },
  { ticker: "VEEV", name: "Veeva Systems", sector: "Healthcare", networkEffects: 7, founderLed: 9 },
  { ticker: "DXCM", name: "DexCom", sector: "Healthcare", networkEffects: 6, founderLed: 5 },
  
  // === FINANCIALS ===
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Financials", networkEffects: 7, founderLed: 3 },
  { ticker: "BAC", name: "Bank of America", sector: "Financials", networkEffects: 6, founderLed: 2 },
  { ticker: "GS", name: "Goldman Sachs", sector: "Financials", networkEffects: 6, founderLed: 3 },
  { ticker: "MS", name: "Morgan Stanley", sector: "Financials", networkEffects: 6, founderLed: 2 },
  { ticker: "BLK", name: "BlackRock", sector: "Financials", networkEffects: 8, founderLed: 9 },
  { ticker: "SCHW", name: "Charles Schwab", sector: "Financials", networkEffects: 6, founderLed: 5 },
  { ticker: "CME", name: "CME Group", sector: "Financials", networkEffects: 9, founderLed: 3 },
  { ticker: "ICE", name: "Intercontinental Exchange", sector: "Financials", networkEffects: 8, founderLed: 8 },
  { ticker: "SPGI", name: "S&P Global", sector: "Financials", networkEffects: 8, founderLed: 2 },
  { ticker: "MCO", name: "Moody's", sector: "Financials", networkEffects: 8, founderLed: 2 },
  { ticker: "COIN", name: "Coinbase", sector: "Financials", networkEffects: 8, founderLed: 10 },
  
  // === CONSUMER ===
  { ticker: "COST", name: "Costco", sector: "Consumer Staples", networkEffects: 6, founderLed: 3 },
  { ticker: "WMT", name: "Walmart", sector: "Consumer Staples", networkEffects: 6, founderLed: 5 },
  { ticker: "PG", name: "Procter & Gamble", sector: "Consumer Staples", networkEffects: 4, founderLed: 2 },
  { ticker: "KO", name: "Coca-Cola", sector: "Consumer Staples", networkEffects: 5, founderLed: 2 },
  { ticker: "PEP", name: "PepsiCo", sector: "Consumer Staples", networkEffects: 4, founderLed: 2 },
  { ticker: "MCD", name: "McDonald's", sector: "Consumer Discretionary", networkEffects: 6, founderLed: 2 },
  { ticker: "SBUX", name: "Starbucks", sector: "Consumer Discretionary", networkEffects: 6, founderLed: 5 },
  { ticker: "NKE", name: "Nike", sector: "Consumer Discretionary", networkEffects: 5, founderLed: 3 },
  { ticker: "TJX", name: "TJX Companies", sector: "Consumer Discretionary", networkEffects: 3, founderLed: 2 },
  { ticker: "HD", name: "Home Depot", sector: "Consumer Discretionary", networkEffects: 5, founderLed: 3 },
  { ticker: "LOW", name: "Lowe's", sector: "Consumer Discretionary", networkEffects: 4, founderLed: 2 },
  { ticker: "TSLA", name: "Tesla", sector: "Consumer Discretionary", networkEffects: 7, founderLed: 10 },
  { ticker: "RIVN", name: "Rivian", sector: "Consumer Discretionary", networkEffects: 3, founderLed: 10 },
  
  // === INDUSTRIALS ===
  { ticker: "CAT", name: "Caterpillar", sector: "Industrials", networkEffects: 4, founderLed: 2 },
  { ticker: "DE", name: "Deere & Company", sector: "Industrials", networkEffects: 5, founderLed: 2 },
  { ticker: "GE", name: "GE Aerospace", sector: "Industrials", networkEffects: 5, founderLed: 3 },
  { ticker: "HON", name: "Honeywell", sector: "Industrials", networkEffects: 4, founderLed: 2 },
  { ticker: "RTX", name: "RTX Corp", sector: "Industrials", networkEffects: 5, founderLed: 2 },
  { ticker: "LMT", name: "Lockheed Martin", sector: "Industrials", networkEffects: 5, founderLed: 2 },
  { ticker: "UPS", name: "UPS", sector: "Industrials", networkEffects: 6, founderLed: 2 },
  { ticker: "FDX", name: "FedEx", sector: "Industrials", networkEffects: 6, founderLed: 5 },
  { ticker: "WM", name: "Waste Management", sector: "Industrials", networkEffects: 5, founderLed: 2 },
  
  // === ENERGY ===
  { ticker: "XOM", name: "Exxon Mobil", sector: "Energy", networkEffects: 3, founderLed: 2 },
  { ticker: "CVX", name: "Chevron", sector: "Energy", networkEffects: 3, founderLed: 2 },
  { ticker: "COP", name: "ConocoPhillips", sector: "Energy", networkEffects: 3, founderLed: 2 },
  { ticker: "SLB", name: "Schlumberger", sector: "Energy", networkEffects: 4, founderLed: 2 },
  { ticker: "EOG", name: "EOG Resources", sector: "Energy", networkEffects: 3, founderLed: 2 },
  
  // === REAL ESTATE / REITS ===
  { ticker: "AMT", name: "American Tower", sector: "Real Estate", networkEffects: 6, founderLed: 3 },
  { ticker: "CCI", name: "Crown Castle", sector: "Real Estate", networkEffects: 6, founderLed: 2 },
  { ticker: "PLD", name: "Prologis", sector: "Real Estate", networkEffects: 5, founderLed: 3 },
  { ticker: "EQIX", name: "Equinix", sector: "Real Estate", networkEffects: 7, founderLed: 3 },
  
  // === TELECOM / MEDIA ===
  { ticker: "DIS", name: "Walt Disney", sector: "Communication Services", networkEffects: 7, founderLed: 3 },
  { ticker: "CMCSA", name: "Comcast", sector: "Communication Services", networkEffects: 6, founderLed: 5 },
  { ticker: "T", name: "AT&T", sector: "Communication Services", networkEffects: 5, founderLed: 2 },
  { ticker: "VZ", name: "Verizon", sector: "Communication Services", networkEffects: 5, founderLed: 2 },
  { ticker: "TMUS", name: "T-Mobile", sector: "Communication Services", networkEffects: 5, founderLed: 3 },
  { ticker: "SPOT", name: "Spotify", sector: "Communication Services", networkEffects: 8, founderLed: 10 },
  
  // === UTILITIES ===
  { ticker: "NEE", name: "NextEra Energy", sector: "Utilities", networkEffects: 3, founderLed: 2 },
  { ticker: "DUK", name: "Duke Energy", sector: "Utilities", networkEffects: 2, founderLed: 2 },
  { ticker: "SO", name: "Southern Company", sector: "Utilities", networkEffects: 2, founderLed: 2 },
  
  // === MORE TECH / FOUNDER-LED ===
  { ticker: "ZM", name: "Zoom Video", sector: "Technology", networkEffects: 7, founderLed: 10 },
  { ticker: "RBLX", name: "Roblox", sector: "Communication Services", networkEffects: 8, founderLed: 10 },
  { ticker: "U", name: "Unity Software", sector: "Technology", networkEffects: 7, founderLed: 5 },
  { ticker: "TWLO", name: "Twilio", sector: "Technology", networkEffects: 6, founderLed: 8 },
  { ticker: "NET", name: "Cloudflare", sector: "Technology", networkEffects: 7, founderLed: 10 },
  { ticker: "BILL", name: "BILL Holdings", sector: "Technology", networkEffects: 6, founderLed: 9 },
  { ticker: "AFRM", name: "Affirm", sector: "Financials", networkEffects: 6, founderLed: 10 },
  { ticker: "PATH", name: "UiPath", sector: "Technology", networkEffects: 5, founderLed: 9 },
  { ticker: "DUOL", name: "Duolingo", sector: "Technology", networkEffects: 7, founderLed: 10 },
  { ticker: "APP", name: "AppLovin", sector: "Technology", networkEffects: 7, founderLed: 10 },
  
  // === ADDITIONAL S&P 500 ===
  { ticker: "BRK.B", name: "Berkshire Hathaway", sector: "Financials", networkEffects: 6, founderLed: 8 },
  { ticker: "LIN", name: "Linde", sector: "Materials", networkEffects: 4, founderLed: 2 },
  { ticker: "ACN", name: "Accenture", sector: "Technology", networkEffects: 5, founderLed: 2 },
  { ticker: "MRK", name: "Merck", sector: "Healthcare", networkEffects: 4, founderLed: 2 },
  { ticker: "AMGN", name: "Amgen", sector: "Healthcare", networkEffects: 4, founderLed: 3 },
  { ticker: "BMY", name: "Bristol-Myers Squibb", sector: "Healthcare", networkEffects: 3, founderLed: 2 },
  { ticker: "MDT", name: "Medtronic", sector: "Healthcare", networkEffects: 5, founderLed: 2 },
  { ticker: "CI", name: "Cigna Group", sector: "Healthcare", networkEffects: 5, founderLed: 2 },
  { ticker: "ELV", name: "Elevance Health", sector: "Healthcare", networkEffects: 5, founderLed: 2 },
  { ticker: "SYK", name: "Stryker", sector: "Healthcare", networkEffects: 4, founderLed: 3 },
  { ticker: "GILD", name: "Gilead Sciences", sector: "Healthcare", networkEffects: 3, founderLed: 3 },
  { ticker: "REGN", name: "Regeneron", sector: "Healthcare", networkEffects: 4, founderLed: 8 },
  { ticker: "VRTX", name: "Vertex Pharma", sector: "Healthcare", networkEffects: 4, founderLed: 3 },
  { ticker: "ZTS", name: "Zoetis", sector: "Healthcare", networkEffects: 4, founderLed: 2 },
  { ticker: "BSX", name: "Boston Scientific", sector: "Healthcare", networkEffects: 4, founderLed: 3 },
  { ticker: "EW", name: "Edwards Lifesciences", sector: "Healthcare", networkEffects: 5, founderLed: 3 },
  { ticker: "IDXX", name: "IDEXX Labs", sector: "Healthcare", networkEffects: 5, founderLed: 3 },
  { ticker: "CB", name: "Chubb", sector: "Financials", networkEffects: 4, founderLed: 2 },
  { ticker: "MMC", name: "Marsh McLennan", sector: "Financials", networkEffects: 5, founderLed: 2 },
  { ticker: "PGR", name: "Progressive", sector: "Financials", networkEffects: 4, founderLed: 3 },
  { ticker: "AON", name: "Aon", sector: "Financials", networkEffects: 5, founderLed: 2 },
  { ticker: "TRV", name: "Travelers", sector: "Financials", networkEffects: 4, founderLed: 2 },
  { ticker: "AIG", name: "AIG", sector: "Financials", networkEffects: 4, founderLed: 2 },
  { ticker: "WFC", name: "Wells Fargo", sector: "Financials", networkEffects: 5, founderLed: 2 },
  { ticker: "C", name: "Citigroup", sector: "Financials", networkEffects: 5, founderLed: 2 },
  { ticker: "USB", name: "US Bancorp", sector: "Financials", networkEffects: 4, founderLed: 2 },
  { ticker: "COF", name: "Capital One", sector: "Financials", networkEffects: 5, founderLed: 7 },
  { ticker: "INTU", name: "Intuit", sector: "Technology", networkEffects: 7, founderLed: 4 },
  { ticker: "SNPS", name: "Synopsys", sector: "Technology", networkEffects: 7, founderLed: 6 },
  { ticker: "CDNS", name: "Cadence Design", sector: "Technology", networkEffects: 7, founderLed: 3 },
  { ticker: "FTNT", name: "Fortinet", sector: "Technology", networkEffects: 5, founderLed: 9 },
  { ticker: "ANSS", name: "ANSYS", sector: "Technology", networkEffects: 6, founderLed: 3 },
  { ticker: "ADI", name: "Analog Devices", sector: "Technology", networkEffects: 5, founderLed: 3 },
  { ticker: "NXPI", name: "NXP Semiconductors", sector: "Technology", networkEffects: 5, founderLed: 2 },
  { ticker: "ON", name: "ON Semiconductor", sector: "Technology", networkEffects: 4, founderLed: 2 },
  { ticker: "GEN", name: "Gen Digital", sector: "Technology", networkEffects: 5, founderLed: 2 },
  { ticker: "CTSH", name: "Cognizant", sector: "Technology", networkEffects: 4, founderLed: 3 },
  { ticker: "IT", name: "Gartner", sector: "Technology", networkEffects: 6, founderLed: 2 },
  { ticker: "MSCI", name: "MSCI", sector: "Financials", networkEffects: 8, founderLed: 3 },
  { ticker: "CTAS", name: "Cintas", sector: "Industrials", networkEffects: 3, founderLed: 4 },
  { ticker: "EMR", name: "Emerson Electric", sector: "Industrials", networkEffects: 3, founderLed: 2 },
  { ticker: "ITW", name: "Illinois Tool Works", sector: "Industrials", networkEffects: 3, founderLed: 2 },
  { ticker: "PH", name: "Parker Hannifin", sector: "Industrials", networkEffects: 3, founderLed: 2 },
  { ticker: "ROK", name: "Rockwell Automation", sector: "Industrials", networkEffects: 4, founderLed: 2 },
  { ticker: "CARR", name: "Carrier Global", sector: "Industrials", networkEffects: 3, founderLed: 2 },
  { ticker: "ETN", name: "Eaton Corp", sector: "Industrials", networkEffects: 4, founderLed: 2 },
  { ticker: "AME", name: "AMETEK", sector: "Industrials", networkEffects: 3, founderLed: 2 },
  { ticker: "TT", name: "Trane Technologies", sector: "Industrials", networkEffects: 3, founderLed: 2 },
  { ticker: "CPRT", name: "Copart", sector: "Industrials", networkEffects: 7, founderLed: 5 },
  { ticker: "VRSK", name: "Verisk Analytics", sector: "Industrials", networkEffects: 7, founderLed: 3 },
  { ticker: "ODFL", name: "Old Dominion Freight", sector: "Industrials", networkEffects: 4, founderLed: 4 },
  { ticker: "GWW", name: "W.W. Grainger", sector: "Industrials", networkEffects: 5, founderLed: 3 },
  { ticker: "FAST", name: "Fastenal", sector: "Industrials", networkEffects: 4, founderLed: 4 },
  { ticker: "CMI", name: "Cummins", sector: "Industrials", networkEffects: 4, founderLed: 2 },
  { ticker: "PAYX", name: "Paychex", sector: "Industrials", networkEffects: 5, founderLed: 3 },
  { ticker: "ADP", name: "ADP", sector: "Industrials", networkEffects: 6, founderLed: 2 },
  { ticker: "BA", name: "Boeing", sector: "Industrials", networkEffects: 5, founderLed: 2 },
  { ticker: "NOC", name: "Northrop Grumman", sector: "Industrials", networkEffects: 4, founderLed: 2 },
  { ticker: "GD", name: "General Dynamics", sector: "Industrials", networkEffects: 4, founderLed: 2 },
  { ticker: "TDG", name: "TransDigm", sector: "Industrials", networkEffects: 5, founderLed: 7 },
  { ticker: "AXON", name: "Axon Enterprise", sector: "Industrials", networkEffects: 7, founderLed: 10 },
  
  // === MORE CONSUMER ===
  { ticker: "LULU", name: "Lululemon", sector: "Consumer Discretionary", networkEffects: 4, founderLed: 4 },
  { ticker: "ROST", name: "Ross Stores", sector: "Consumer Discretionary", networkEffects: 3, founderLed: 2 },
  { ticker: "DHI", name: "D.R. Horton", sector: "Consumer Discretionary", networkEffects: 3, founderLed: 5 },
  { ticker: "LEN", name: "Lennar", sector: "Consumer Discretionary", networkEffects: 3, founderLed: 4 },
  { ticker: "GM", name: "General Motors", sector: "Consumer Discretionary", networkEffects: 4, founderLed: 2 },
  { ticker: "F", name: "Ford Motor", sector: "Consumer Discretionary", networkEffects: 4, founderLed: 3 },
  { ticker: "YUM", name: "Yum! Brands", sector: "Consumer Discretionary", networkEffects: 5, founderLed: 2 },
  { ticker: "CMG", name: "Chipotle", sector: "Consumer Discretionary", networkEffects: 4, founderLed: 4 },
  { ticker: "ORLY", name: "O'Reilly Auto", sector: "Consumer Discretionary", networkEffects: 4, founderLed: 4 },
  { ticker: "AZO", name: "AutoZone", sector: "Consumer Discretionary", networkEffects: 4, founderLed: 2 },
  { ticker: "MAR", name: "Marriott", sector: "Consumer Discretionary", networkEffects: 7, founderLed: 4 },
  { ticker: "HLT", name: "Hilton", sector: "Consumer Discretionary", networkEffects: 7, founderLed: 3 },
  { ticker: "RCL", name: "Royal Caribbean", sector: "Consumer Discretionary", networkEffects: 3, founderLed: 3 },
  { ticker: "NCLH", name: "Norwegian Cruise", sector: "Consumer Discretionary", networkEffects: 2, founderLed: 2 },
  
  // === CONSUMER STAPLES ===
  { ticker: "PM", name: "Philip Morris", sector: "Consumer Staples", networkEffects: 4, founderLed: 2 },
  { ticker: "MO", name: "Altria", sector: "Consumer Staples", networkEffects: 3, founderLed: 2 },
  { ticker: "CL", name: "Colgate-Palmolive", sector: "Consumer Staples", networkEffects: 3, founderLed: 2 },
  { ticker: "KMB", name: "Kimberly-Clark", sector: "Consumer Staples", networkEffects: 3, founderLed: 2 },
  { ticker: "MDLZ", name: "Mondelez", sector: "Consumer Staples", networkEffects: 3, founderLed: 2 },
  { ticker: "GIS", name: "General Mills", sector: "Consumer Staples", networkEffects: 3, founderLed: 2 },
  { ticker: "SJM", name: "J.M. Smucker", sector: "Consumer Staples", networkEffects: 2, founderLed: 4 },
  { ticker: "STZ", name: "Constellation Brands", sector: "Consumer Staples", networkEffects: 3, founderLed: 5 },
  { ticker: "DEO", name: "Diageo", sector: "Consumer Staples", networkEffects: 3, founderLed: 2 },
  { ticker: "KHC", name: "Kraft Heinz", sector: "Consumer Staples", networkEffects: 3, founderLed: 3 },
  { ticker: "SYY", name: "Sysco", sector: "Consumer Staples", networkEffects: 4, founderLed: 2 },
  { ticker: "ADM", name: "Archer-Daniels", sector: "Consumer Staples", networkEffects: 3, founderLed: 2 },
  { ticker: "EL", name: "Estée Lauder", sector: "Consumer Staples", networkEffects: 3, founderLed: 5 },
  
  // === MATERIALS ===
  { ticker: "APD", name: "Air Products", sector: "Materials", networkEffects: 3, founderLed: 2 },
  { ticker: "SHW", name: "Sherwin-Williams", sector: "Materials", networkEffects: 4, founderLed: 2 },
  { ticker: "ECL", name: "Ecolab", sector: "Materials", networkEffects: 4, founderLed: 2 },
  { ticker: "DD", name: "DuPont", sector: "Materials", networkEffects: 3, founderLed: 2 },
  { ticker: "NEM", name: "Newmont", sector: "Materials", networkEffects: 2, founderLed: 2 },
  { ticker: "FCX", name: "Freeport-McMoRan", sector: "Materials", networkEffects: 2, founderLed: 2 },
  
  // === MORE ENERGY ===
  { ticker: "PSX", name: "Phillips 66", sector: "Energy", networkEffects: 3, founderLed: 2 },
  { ticker: "VLO", name: "Valero Energy", sector: "Energy", networkEffects: 3, founderLed: 2 },
  { ticker: "MPC", name: "Marathon Petroleum", sector: "Energy", networkEffects: 3, founderLed: 2 },
  { ticker: "OXY", name: "Occidental Petroleum", sector: "Energy", networkEffects: 3, founderLed: 3 },
  { ticker: "HAL", name: "Halliburton", sector: "Energy", networkEffects: 3, founderLed: 2 },
  { ticker: "BKR", name: "Baker Hughes", sector: "Energy", networkEffects: 3, founderLed: 2 },
  
  // === UTILITIES ===
  { ticker: "AEP", name: "American Electric Power", sector: "Utilities", networkEffects: 3, founderLed: 2 },
  { ticker: "D", name: "Dominion Energy", sector: "Utilities", networkEffects: 3, founderLed: 2 },
  { ticker: "EXC", name: "Exelon", sector: "Utilities", networkEffects: 3, founderLed: 2 },
  { ticker: "SRE", name: "Sempra Energy", sector: "Utilities", networkEffects: 3, founderLed: 2 },
  { ticker: "WEC", name: "WEC Energy", sector: "Utilities", networkEffects: 2, founderLed: 2 },
  { ticker: "ES", name: "Eversource Energy", sector: "Utilities", networkEffects: 2, founderLed: 2 },
  { ticker: "XEL", name: "Xcel Energy", sector: "Utilities", networkEffects: 2, founderLed: 2 },
  
  // === MORE REAL ESTATE ===
  { ticker: "O", name: "Realty Income", sector: "Real Estate", networkEffects: 3, founderLed: 2 },
  { ticker: "DLR", name: "Digital Realty", sector: "Real Estate", networkEffects: 6, founderLed: 3 },
  { ticker: "PSA", name: "Public Storage", sector: "Real Estate", networkEffects: 4, founderLed: 3 },
  { ticker: "WELL", name: "Welltower", sector: "Real Estate", networkEffects: 3, founderLed: 2 },
  { ticker: "SPG", name: "Simon Property", sector: "Real Estate", networkEffects: 4, founderLed: 3 },
  { ticker: "AVB", name: "AvalonBay", sector: "Real Estate", networkEffects: 3, founderLed: 2 },
  { ticker: "EQR", name: "Equity Residential", sector: "Real Estate", networkEffects: 3, founderLed: 3 },
  { ticker: "SBAC", name: "SBA Communications", sector: "Real Estate", networkEffects: 5, founderLed: 3 },
]

// Deduplicate by ticker (VEEV appears twice)
const seen = new Set<string>()
export const uniqueStocks = stocks.filter(s => {
  if (seen.has(s.ticker)) return false
  seen.add(s.ticker)
  return true
})
