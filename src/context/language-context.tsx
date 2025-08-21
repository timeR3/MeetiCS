"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Language = "en" | "es";

const translations = {
    en: {
        your_meetings: "Your Meetings",
        search_meetings: "Search meetings...",
        new_meeting: "New Meeting",
        start_new_meeting: "Start a new meeting",
        upload: "Upload",
        record: "Record",
        connect: "Connect",
        drag_and_drop: "Drag & drop your file here or <span class=\"font-semibold text-primary\">browse</span>",
        selected_file: "Selected file",
        click_to_record: "Click to start recording",
        record_coming_soon: "Recording feature coming soon.",
        connect_coming_soon: "Connect your favorite meeting app. Coming soon.",
        connect_zoom: "Connect with Zoom",
        connect_gmeet: "Connect with Google Meet",
        connect_teams: "Connect with Microsoft Teams",
        processing: "Processing",
        transcribe_meeting: "Transcribe Meeting"
    },
    es: {
        your_meetings: "Tus Reuniones",
        search_meetings: "Buscar reuniones...",
        new_meeting: "Nueva Reunión",
        start_new_meeting: "Iniciar una nueva reunión",
        upload: "Subir",
        record: "Grabar",
        connect: "Conectar",
        drag_and_drop: "Arrastra y suelta tu archivo aquí o <span class=\"font-semibold text-primary\">explora</span>",
        selected_file: "Archivo seleccionado",
        click_to_record: "Haz clic para empezar a grabar",
        record_coming_soon: "La función de grabación llegará pronto.",
        connect_coming_soon: "Conecta tu aplicación de reuniones favorita. Próximamente.",
        connect_zoom: "Conectar con Zoom",
        connect_gmeet: "Conectar con Google Meet",
        connect_teams: "Conectar con Microsoft Teams",
        processing: "Procesando",
        transcribe_meeting: "Transcribir Reunión"
    }
}

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
