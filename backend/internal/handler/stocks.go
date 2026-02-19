package handler

import (
	founderindexv1 "github.com/tunajam/founder-index/backend/gen/founderindex/v1"
)

type stockData struct {
	Ticker         string
	Name           string
	Sector         string
	NetworkEffects int
	FounderLed     int
}

func (s *stockData) toProto() *founderindexv1.Stock {
	return &founderindexv1.Stock{
		Ticker:               s.Ticker,
		Name:                 s.Name,
		Sector:               s.Sector,
		NetworkEffectsScore:  int32(s.NetworkEffects),
		FounderLedScore:      int32(s.FounderLed),
	}
}

var allStocks = []*stockData{
	// TECH — HIGH NETWORK EFFECTS + FOUNDER-LED
	{"META", "Meta Platforms", "Communication Services", 10, 10},
	{"AMZN", "Amazon", "Consumer Discretionary", 10, 8},
	{"GOOGL", "Alphabet", "Communication Services", 10, 7},
	{"NFLX", "Netflix", "Communication Services", 8, 7},
	{"NVDA", "NVIDIA", "Technology", 9, 10},
	{"CRM", "Salesforce", "Technology", 8, 9},
	{"ADBE", "Adobe", "Technology", 8, 3},
	{"ORCL", "Oracle", "Technology", 8, 8},
	{"NOW", "ServiceNow", "Technology", 7, 5},
	{"PLTR", "Palantir", "Technology", 7, 9},
	{"SHOP", "Shopify", "Technology", 8, 10},

	// PAYMENTS / FINTECH
	{"V", "Visa", "Financials", 10, 2},
	{"MA", "Mastercard", "Financials", 10, 2},
	{"PYPL", "PayPal", "Financials", 8, 4},
	{"SQ", "Block (Square)", "Financials", 8, 9},
	{"FIS", "Fidelity National", "Financials", 7, 2},
	{"GPN", "Global Payments", "Financials", 6, 2},
	{"AXP", "American Express", "Financials", 8, 2},
	{"FI", "Fiserv", "Financials", 7, 2},

	// SOCIAL / MARKETPLACE
	{"ABNB", "Airbnb", "Consumer Discretionary", 9, 10},
	{"BKNG", "Booking Holdings", "Consumer Discretionary", 9, 4},
	{"UBER", "Uber", "Industrials", 9, 5},
	{"DASH", "DoorDash", "Consumer Discretionary", 8, 10},
	{"SNAP", "Snap", "Communication Services", 7, 10},
	{"PINS", "Pinterest", "Communication Services", 7, 8},
	{"ETSY", "Etsy", "Consumer Discretionary", 8, 3},

	// BIG TECH
	{"MSFT", "Microsoft", "Technology", 10, 4},
	{"AAPL", "Apple", "Technology", 9, 3},
	{"CSCO", "Cisco Systems", "Technology", 7, 3},
	{"INTC", "Intel", "Technology", 6, 3},
	{"IBM", "IBM", "Technology", 6, 2},
	{"TXN", "Texas Instruments", "Technology", 5, 2},

	// SAAS / CLOUD
	{"SNOW", "Snowflake", "Technology", 7, 5},
	{"DDOG", "Datadog", "Technology", 6, 10},
	{"MDB", "MongoDB", "Technology", 7, 9},
	{"CRWD", "CrowdStrike", "Technology", 6, 9},
	{"ZS", "Zscaler", "Technology", 5, 9},
	{"PANW", "Palo Alto Networks", "Technology", 6, 7},
	{"WDAY", "Workday", "Technology", 6, 7},
	{"TEAM", "Atlassian", "Technology", 7, 9},
	{"HUBS", "HubSpot", "Technology", 6, 7},
	{"TTD", "The Trade Desk", "Technology", 7, 10},
	{"VEEV", "Veeva Systems", "Technology", 7, 9},
	{"MNDY", "Monday.com", "Technology", 6, 10},

	// SEMIS / HARDWARE
	{"AMD", "AMD", "Technology", 6, 4},
	{"AVGO", "Broadcom", "Technology", 6, 5},
	{"QCOM", "Qualcomm", "Technology", 7, 3},
	{"AMAT", "Applied Materials", "Technology", 5, 2},
	{"LRCX", "Lam Research", "Technology", 5, 2},
	{"KLAC", "KLA Corp", "Technology", 5, 2},
	{"ASML", "ASML", "Technology", 8, 3},
	{"TSM", "TSMC", "Technology", 9, 6},
	{"ARM", "Arm Holdings", "Technology", 8, 4},
	{"MRVL", "Marvell Technology", "Technology", 5, 3},

	// HEALTHCARE
	{"UNH", "UnitedHealth Group", "Healthcare", 7, 3},
	{"JNJ", "Johnson & Johnson", "Healthcare", 5, 2},
	{"LLY", "Eli Lilly", "Healthcare", 5, 2},
	{"PFE", "Pfizer", "Healthcare", 4, 2},
	{"ABBV", "AbbVie", "Healthcare", 4, 2},
	{"TMO", "Thermo Fisher", "Healthcare", 5, 2},
	{"DHR", "Danaher", "Healthcare", 5, 6},
	{"ABT", "Abbott Labs", "Healthcare", 4, 2},
	{"ISRG", "Intuitive Surgical", "Healthcare", 7, 6},
	{"DXCM", "DexCom", "Healthcare", 6, 5},

	// FINANCIALS
	{"JPM", "JPMorgan Chase", "Financials", 7, 3},
	{"BAC", "Bank of America", "Financials", 6, 2},
	{"GS", "Goldman Sachs", "Financials", 6, 3},
	{"MS", "Morgan Stanley", "Financials", 6, 2},
	{"BLK", "BlackRock", "Financials", 8, 9},
	{"SCHW", "Charles Schwab", "Financials", 6, 5},
	{"CME", "CME Group", "Financials", 9, 3},
	{"ICE", "Intercontinental Exchange", "Financials", 8, 8},
	{"SPGI", "S&P Global", "Financials", 8, 2},
	{"MCO", "Moody's", "Financials", 8, 2},
	{"COIN", "Coinbase", "Financials", 8, 10},

	// CONSUMER
	{"COST", "Costco", "Consumer Staples", 6, 3},
	{"WMT", "Walmart", "Consumer Staples", 6, 5},
	{"PG", "Procter & Gamble", "Consumer Staples", 4, 2},
	{"KO", "Coca-Cola", "Consumer Staples", 5, 2},
	{"PEP", "PepsiCo", "Consumer Staples", 4, 2},
	{"MCD", "McDonald's", "Consumer Discretionary", 6, 2},
	{"SBUX", "Starbucks", "Consumer Discretionary", 6, 5},
	{"NKE", "Nike", "Consumer Discretionary", 5, 3},
	{"HD", "Home Depot", "Consumer Discretionary", 5, 3},
	{"LOW", "Lowe's", "Consumer Discretionary", 4, 2},
	{"TSLA", "Tesla", "Consumer Discretionary", 7, 10},

	// INDUSTRIALS
	{"CAT", "Caterpillar", "Industrials", 4, 2},
	{"DE", "Deere & Company", "Industrials", 5, 2},
	{"GE", "GE Aerospace", "Industrials", 5, 3},
	{"HON", "Honeywell", "Industrials", 4, 2},
	{"RTX", "RTX Corp", "Industrials", 5, 2},
	{"LMT", "Lockheed Martin", "Industrials", 5, 2},
	{"UPS", "UPS", "Industrials", 6, 2},
	{"FDX", "FedEx", "Industrials", 6, 5},
	{"WM", "Waste Management", "Industrials", 5, 2},
	{"ADP", "ADP", "Industrials", 6, 2},
	{"AXON", "Axon Enterprise", "Industrials", 7, 10},

	// ENERGY
	{"XOM", "Exxon Mobil", "Energy", 3, 2},
	{"CVX", "Chevron", "Energy", 3, 2},
	{"COP", "ConocoPhillips", "Energy", 3, 2},
	{"SLB", "Schlumberger", "Energy", 4, 2},

	// REAL ESTATE
	{"AMT", "American Tower", "Real Estate", 6, 3},
	{"CCI", "Crown Castle", "Real Estate", 6, 2},
	{"PLD", "Prologis", "Real Estate", 5, 3},
	{"EQIX", "Equinix", "Real Estate", 7, 3},

	// TELECOM / MEDIA
	{"DIS", "Walt Disney", "Communication Services", 7, 3},
	{"CMCSA", "Comcast", "Communication Services", 6, 5},
	{"T", "AT&T", "Communication Services", 5, 2},
	{"VZ", "Verizon", "Communication Services", 5, 2},
	{"TMUS", "T-Mobile", "Communication Services", 5, 3},
	{"SPOT", "Spotify", "Communication Services", 8, 10},

	// MORE FOUNDER-LED TECH
	{"ZM", "Zoom Video", "Technology", 7, 10},
	{"RBLX", "Roblox", "Communication Services", 8, 10},
	{"NET", "Cloudflare", "Technology", 7, 10},
	{"TWLO", "Twilio", "Technology", 6, 8},
	{"TTD", "The Trade Desk", "Technology", 7, 10},
	{"BILL", "BILL Holdings", "Technology", 6, 9},
	{"AFRM", "Affirm", "Financials", 6, 10},
	{"DUOL", "Duolingo", "Technology", 7, 10},
	{"APP", "AppLovin", "Technology", 7, 10},
	{"FTNT", "Fortinet", "Technology", 5, 9},

	// FINANCIALS EXTRAS
	{"BRK.B", "Berkshire Hathaway", "Financials", 6, 8},
	{"COF", "Capital One", "Financials", 5, 7},
	{"MSCI", "MSCI", "Financials", 8, 3},
	{"INTU", "Intuit", "Technology", 7, 4},
	{"SNPS", "Synopsys", "Technology", 7, 6},
	{"CDNS", "Cadence Design", "Technology", 7, 3},

	// MISC
	{"CPRT", "Copart", "Industrials", 7, 5},
	{"VRSK", "Verisk Analytics", "Industrials", 7, 3},
	{"TDG", "TransDigm", "Industrials", 5, 7},
	{"MAR", "Marriott", "Consumer Discretionary", 7, 4},
	{"HLT", "Hilton", "Consumer Discretionary", 7, 3},
	{"REGN", "Regeneron", "Healthcare", 4, 8},
	{"DLR", "Digital Realty", "Real Estate", 6, 3},
}
