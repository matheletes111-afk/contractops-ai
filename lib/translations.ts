// Simple translation object for Hindi (default) and English

export type Language = "hi" | "en";

export const translations = {
  hi: {
    // Navigation
    home: "होम",
    pricing: "मूल्य निर्धारण",
    dashboard: "डैशबोर्ड",
    login: "लॉगिन",
    logout: "लॉगआउट",
    
    // Landing page
    heroTitle: "AI अनुबंध जोखिम विश्लेषक",
    heroSubtitle: "अपने कानूनी अनुबंधों के लिए तत्काल जोखिम विश्लेषण और सुझाए गए रेडलाइन प्राप्त करें।",
    getStarted: "मुफ्त शुरू करें",
    startAnalyzing: "विश्लेषण शुरू करें",
    
    // Features
    features: "मुख्य विशेषताएं",
    uploadContracts: "अनुबंध अपलोड करें",
    uploadContractsDesc: "PDF और DOCX फ़ाइलों के लिए समर्थन। बस अपलोड करें और AI को काम करने दें।",
    riskAnalysis: "जोखिम विश्लेषण",
    riskAnalysisDesc: "10 प्रमुख अनुबंध खंडों का जोखिम स्कोरिंग और विस्तृत अंतर्दृष्टि के साथ विश्लेषण करें।",
    suggestedRedlines: "सुझाए गए रेडलाइन",
    suggestedRedlinesDesc: "जोखिम भरे खंडों के AI-जेनरेटेड सुधारित संस्करण प्राप्त करें।",
    
    // Pricing
    choosePlan: "अपनी योजना चुनें",
    perMonth: "/माह",
    analyses: "अनुबंध विश्लेषण",
    subscribe: "सदस्यता लें",
    
    // Common
    error: "त्रुटि",
    loading: "लोड हो रहा है...",
    cancel: "रद्द करें",
    submit: "जमा करें",
  },
  en: {
    // Navigation
    home: "Home",
    pricing: "Pricing",
    dashboard: "Dashboard",
    login: "Login",
    logout: "Logout",
    
    // Landing page
    heroTitle: "AI Contract Risk Analyzer",
    heroSubtitle: "Get instant risk analysis and suggested redlines for your legal contracts.",
    getStarted: "Get Started Free",
    startAnalyzing: "Start Analyzing",
    
    // Features
    features: "Key Features",
    uploadContracts: "Upload Contracts",
    uploadContractsDesc: "Support for PDF and DOCX files. Simply upload and let AI do the work.",
    riskAnalysis: "Risk Analysis",
    riskAnalysisDesc: "Analyze 10 key contract clauses with risk scoring and detailed insights.",
    suggestedRedlines: "Suggested Redlines",
    suggestedRedlinesDesc: "Get AI-generated improved versions of risky clauses.",
    
    // Pricing
    choosePlan: "Choose Your Plan",
    perMonth: "/month",
    analyses: "contract analyses",
    subscribe: "Subscribe",
    
    // Common
    error: "Error",
    loading: "Loading...",
    cancel: "Cancel",
    submit: "Submit",
  },
};

export function getTranslation(lang: Language, key: string): string {
  return translations[lang][key as keyof typeof translations[typeof lang]] || key;
}

