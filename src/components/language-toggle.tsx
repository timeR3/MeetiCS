"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "./ui/button";

export function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            {language === 'en' ? 'ES' : 'EN'}
            <span className="sr-only">Change language</span>
        </Button>
    )
}
