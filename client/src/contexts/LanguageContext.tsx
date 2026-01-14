import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "cs" | "de" | "en";
export type Variant = "families" | "seniors";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  variant: Variant;
  setVariant: (variant: Variant) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const translations = {
  cs: {
    families: {
      title: "Váš druhý domov v přírodě",
      subtitle: "Prémiové soběstačné bungalovy navržené pro rodiny, které hledají zdravé prostředí a svobodu v přírodě.",
      reserve_button: "Rezervovat",
      view_gallery: "Prohlédnout galerii",
      about: "O projektu",
      offer: "Nabídka",
      gallery_button: "Galerie",
      booking_button: "Pronájem",
      contact: "Kontakt",
      about_title: "O projektu",
      about_text: "Naše bungalovy jsou speciálně navrženy pro rodiny s dětmi. Každý bungalov je vybaven vším, co potřebujete pro pohodlný pobyt v přírodě - od moderní kuchyně až po bezpečné venkovní prostory.",
      hero_description: "Vytvořili jsme místo, kde vaše děti mohou vyrůstat v souladu s přírodou. Naše bungalovy kombinují moderní pohodlí s autentickým přírodním zážitkem.",
      offer_title: "Co nabízíme",
      offer_text: "Prohlédněte si naši galerii a zjistěte více o našich bungalovech.",
      why_nature_title: "Proč příroda?",
      why_nature_text: "Život v přírodě přináší nesčetné výhody pro celou rodinu. Děti se rozvíjejí zdravěji, rodiny tráví více času spolu a všichni si užívají klid a mír přírodního prostředí.",
    },
    seniors: {
      title: "Váš klidný domov v přírodě",
      subtitle: "Komfortní bungalovy navržené pro seniory, kteří hledají klid, bezpečí a kvalitní životní prostředí.",
      reserve_button: "Rezervovat",
      view_gallery: "Prohlédnout galerii",
      about: "O projektu",
      offer: "Nabídka",
      gallery_button: "Galerie",
      booking_button: "Pronájem",
      contact: "Kontakt",
      about_title: "O projektu",
      about_text: "Naše bungalovy jsou speciálně přizpůsobeny potřebám seniorů. Bezbariérový přístup, moderní vybavení a klidné prostředí zajišťují pohodlný a bezpečný život.",
      hero_description: "Vytvořili jsme místo, kde si můžete užít zasloužený odpočinek v harmonii s přírodou. Moderní komfort spojený s klidem venkovského prostředí.",
      offer_title: "Co nabízíme",
      offer_text: "Prohlédněte si naši galerii a zjistěte více o našich bungalovech.",
      why_nature_title: "Proč příroda?",
      why_nature_text: "Život v přírodě přináší klid, zdraví a pohodu. Čerstvý vzduch, krásná krajina a ticho přírodního prostředí jsou ideální pro aktivní a spokojený život v důchodu.",
    },
  },
  de: {
    families: {
      title: "Ihr zweites Zuhause in der Natur",
      subtitle: "Premium-autarke Bungalows für Familien, die eine gesunde Umgebung und Freiheit in der Natur suchen.",
      reserve_button: "Reservieren",
      view_gallery: "Galerie ansehen",
      about: "Über das Projekt",
      offer: "Angebot",
      gallery_button: "Galerie",
      booking_button: "Vermietung",
      contact: "Kontakt",
      about_title: "Über das Projekt",
      about_text: "Unsere Bungalows sind speziell für Familien mit Kindern konzipiert. Jeder Bungalow ist mit allem ausgestattet, was Sie für einen komfortablen Aufenthalt in der Natur benötigen.",
      hero_description: "Wir haben einen Ort geschaffen, an dem Ihre Kinder im Einklang mit der Natur aufwachsen können.",
      offer_title: "Was wir bieten",
      offer_text: "Sehen Sie sich unsere Galerie an und erfahren Sie mehr über unsere Bungalows.",
      why_nature_title: "Warum Natur?",
      why_nature_text: "Das Leben in der Natur bringt unzählige Vorteile für die ganze Familie.",
    },
    seniors: {
      title: "Ihr ruhiges Zuhause in der Natur",
      subtitle: "Komfortable Bungalows für Senioren, die Ruhe, Sicherheit und Lebensqualität suchen.",
      reserve_button: "Reservieren",
      view_gallery: "Galerie ansehen",
      about: "Über das Projekt",
      offer: "Angebot",
      gallery_button: "Galerie",
      booking_button: "Vermietung",
      contact: "Kontakt",
      about_title: "Über das Projekt",
      about_text: "Unsere Bungalows sind speziell auf die Bedürfnisse von Senioren zugeschnitten.",
      hero_description: "Wir haben einen Ort geschaffen, an dem Sie Ihren wohlverdienten Ruhestand in Harmonie mit der Natur genießen können.",
      offer_title: "Was wir bieten",
      offer_text: "Sehen Sie sich unsere Galerie an und erfahren Sie mehr über unsere Bungalows.",
      why_nature_title: "Warum Natur?",
      why_nature_text: "Das Leben in der Natur bringt Ruhe, Gesundheit und Wohlbefinden.",
    },
  },
  en: {
    families: {
      title: "Your Second Home in Nature",
      subtitle: "Premium self-sufficient bungalows designed for families seeking a healthy environment and freedom in nature.",
      reserve_button: "Reserve",
      view_gallery: "View Gallery",
      about: "About",
      offer: "Offer",
      gallery_button: "Gallery",
      booking_button: "Rental",
      contact: "Contact",
      about_title: "About the Project",
      about_text: "Our bungalows are specially designed for families with children. Each bungalow is equipped with everything you need for a comfortable stay in nature.",
      hero_description: "We have created a place where your children can grow up in harmony with nature.",
      offer_title: "What We Offer",
      offer_text: "Browse our gallery and learn more about our bungalows.",
      why_nature_title: "Why Nature?",
      why_nature_text: "Living in nature brings countless benefits for the whole family.",
    },
    seniors: {
      title: "Your Peaceful Home in Nature",
      subtitle: "Comfortable bungalows designed for seniors seeking peace, safety, and quality of life.",
      reserve_button: "Reserve",
      view_gallery: "View Gallery",
      about: "About",
      offer: "Offer",
      gallery_button: "Gallery",
      booking_button: "Rental",
      contact: "Contact",
      about_title: "About the Project",
      about_text: "Our bungalows are specially adapted to the needs of seniors.",
      hero_description: "We have created a place where you can enjoy your well-deserved retirement in harmony with nature.",
      offer_title: "What We Offer",
      offer_text: "Browse our gallery and learn more about our bungalows.",
      why_nature_title: "Why Nature?",
      why_nature_text: "Living in nature brings peace, health, and well-being.",
    },
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("cs");
  const [variant, setVariant] = useState<Variant>("families");

  return (
    <LanguageContext.Provider value={{ language, setLanguage, variant, setVariant }}>
      {children}
    </LanguageContext.Provider>
  );
};
