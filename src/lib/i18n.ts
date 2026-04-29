export type Lang = 'en' | 'hi' | 'te';

export const LANGS: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
];

type Dict = Record<string, { en: string; hi: string; te: string }>;

export const t: Dict = {
  app_name: { en: 'ElectionGuide AI', hi: 'इलेक्शनगाइड AI', te: 'ఎలక్షన్‌గైడ్ AI' },
  tagline: {
    en: 'Your neutral, AI-powered guide to Indian elections.',
    hi: 'भारतीय चुनावों के लिए आपका तटस्थ, AI-संचालित मार्गदर्शक।',
    te: 'భారత ఎన్నికలకు మీ నిష్పాక్షిక AI మార్గదర్శి.',
  },
  hero_sub: {
    en: 'Check eligibility, register to vote, find your polling booth, and follow live election updates — in your language.',
    hi: 'पात्रता जांचें, मतदाता पंजीकरण करें, अपना मतदान केंद्र खोजें और लाइव चुनाव अपडेट देखें — अपनी भाषा में।',
    te: 'అర్హత తనిఖీ చేయండి, ఓటు నమోదు చేయండి, మీ పోలింగ్ బూత్ కనుగొనండి మరియు లైవ్ ఎన్నికల అప్‌డేట్‌లు పొందండి — మీ భాషలో.',
  },
  cta_chat: { en: 'Ask the AI', hi: 'AI से पूछें', te: 'AIని అడగండి' },
  cta_journey: { en: 'Start voter journey', hi: 'मतदाता यात्रा शुरू करें', te: 'ఓటరు ప్రయాణం ప్రారంభించండి' },
  cta_timeline: { en: 'View timeline', hi: 'समयरेखा देखें', te: 'కాలక్రమం చూడండి' },
  nav_home: { en: 'Home', hi: 'होम', te: 'హోమ్' },
  nav_chat: { en: 'AI Assistant', hi: 'AI सहायक', te: 'AI సహాయకుడు' },
  nav_journey: { en: 'Voter Journey', hi: 'मतदाता यात्रा', te: 'ఓటరు ప్రయాణం' },
  nav_timeline: { en: 'Timeline', hi: 'समयरेखा', te: 'కాలక్రమం' },
  nav_booth: { en: 'Find Booth', hi: 'बूथ खोजें', te: 'బూత్ కనుగొనండి' },
  nav_quiz: { en: 'Quiz', hi: 'क्विज़', te: 'క్విజ్' },
  nav_profile: { en: 'Profile', hi: 'प्रोफ़ाइल', te: 'ప్రొఫైల్' },
  sign_in: { en: 'Sign in', hi: 'साइन इन', te: 'సైన్ ఇన్' },
  sign_out: { en: 'Sign out', hi: 'साइन आउट', te: 'సైన్ అవుట్' },
  get_started: { en: 'Get started', hi: 'शुरू करें', te: 'ప్రారంభించండి' },
  features_title: { en: 'Everything a first-time voter needs', hi: 'पहली बार के मतदाता के लिए सब कुछ', te: 'మొదటిసారి ఓటరుకు అవసరమైనదంతా' },
  trusted: { en: 'Built on official Election Commission of India sources.', hi: 'भारत निर्वाचन आयोग के आधिकारिक स्रोतों पर आधारित।', te: 'భారత ఎన్నికల కమీషన్ అధికారిక మూలాలపై ఆధారపడింది.' },
};

export function tr(key: keyof typeof t, lang: Lang) {
  return t[key]?.[lang] ?? t[key]?.en ?? key;
}
