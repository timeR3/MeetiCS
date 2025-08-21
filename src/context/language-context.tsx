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
        transcribe_meeting: "Transcribe Meeting",
        back_to_meetings: "Back to Meetings",
        transcript: "Transcript",
        edit: "Edit",
        save: "Save",
        ai_generated_transcript: "AI-generated transcript. You can edit it for accuracy.",
        participants: "Participants",
        save_names: "Save Names",
        enter_participant_name: "Enter participant's name",
        participant_names_saved: "Participant names saved (check console)!",
        assign_names_to_speakers: "Assign names to speakers for better identification.",
        ai_summary: "AI Summary",
        key_discussion_points: "Key Discussion Points",
        decisions_made: "Decisions Made",
        ai_generated_summary: "AI-generated summary.",
        action_items: "Action Items",
        assigned_to: "Assigned to",
        email: "Email",
        ai_extracted_action_items: "AI-extracted action items.",
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
        transcribe_meeting: "Transcribir Reunión",
        back_to_meetings: "Volver a Reuniones",
        transcript: "Transcripción",
        edit: "Editar",
        save: "Guardar",
        ai_generated_transcript: "Transcripción generada por IA. Puedes editarla para mayor precisión.",
        participants: "Participantes",
        save_names: "Guardar Nombres",
        enter_participant_name: "Introduce el nombre del participante",
        participant_names_saved: "Nombres de participantes guardados (revisa la consola)!",
        assign_names_to_speakers: "Asigna nombres a los oradores para una mejor identificación.",
        ai_summary: "Resumen IA",
        key_discussion_points: "Puntos Clave de Discusión",
        decisions_made: "Decisiones Tomadas",
        ai_generated_summary: "Resumen generado por IA.",
        action_items: "Tareas Pendientes",
        assigned_to: "Asignado a",
        email: "Enviar correo",
        ai_extracted_action_items: "Tareas extraídas por IA.",
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
