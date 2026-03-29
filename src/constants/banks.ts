export const INDONESIAN_BANKS = [
  {
    name: "BCA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg",
    color: "#0060AF"
  },
  {
    name: "Mandiri",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg",
    color: "#00467E"
  },
  {
    name: "BNI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Bank_BNI_Logo.png",
    color: "#FF6600"
  },
  {
    name: "BRI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6d/BRI_2025.png",
    color: "#00529C"
  },
  {
    name: "BSI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/1200px-Bank_Syariah_Indonesia.svg.png",
    color: "#00A29A"
  },
  {
    name: "CIMB Niaga",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/38/CIMB_Niaga_logo.svg",
    color: "#EA1D25"
  },
  {
    name: "BTN",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Bank_BTN_logo.png",
    color: "#004C97"
  },
  {
    name: "Danamon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Danamon_%282024%29.svg",
    color: "#F37021"
  },
  {
    name: "Permata",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Permata_Bank_%282024%29.svg",
    color: "#8CB91F"
  },
  {
    name: "DANA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg",
    color: "#118EEA"
  },
  {
    name: "OVO",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg",
    color: "#4C2A86"
  },
  {
    name: "GoPay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1200px-Gopay_logo.svg.png",
    color: "#00AED6"
  },
  {
    name: "Bank Jago",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Logo-jago.svg",
    color: "#F5A623"
  },
  {
    name: "SeaBank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/SeaBank.svg",
    color: "#FF5722"
  },
  {
    name: "Jenius",
    logo: "https://www.jenius.com/assets/img/brand/logo_jenius-bisnis.svg",
    color: "#00AEEF"
  }
];

export function getBankInfo(bankName?: string) {
  if (!bankName) return undefined;
  const lowerName = bankName.toLowerCase();
  // Exact match first
  const exactMatch = INDONESIAN_BANKS.find(b => b.name.toLowerCase() === lowerName);
  if (exactMatch) return exactMatch;
  
  // Partial match as fallback (e.g. "BCA Transfer" -> "BCA")
  return INDONESIAN_BANKS.find(b => lowerName.includes(b.name.toLowerCase()));
}
