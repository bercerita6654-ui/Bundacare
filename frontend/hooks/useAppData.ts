import { useState, useEffect, useCallback } from 'react';
import { User, Checkup, UsgRecord, EmergencyContact, Language, Persona, ChatMessage } from '../types';

export function useAppData() {
  const [user, setUser] = useState<User | null>(null);
  const [hpht, setHpht] = useState<string>('');
  const [language, setLanguage] = useState<Language>('id');
  const [persona, setPersona] = useState<Persona>('default');
  const [theme, setTheme] = useState<string>('#ec4899');
  
  const [kicks, setKicks] = useState<number>(0);
  const [kickDate, setKickDate] = useState<string>('');
  
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [usgRecords, setUsgRecords] = useState<UsgRecord[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Load initial data
  useEffect(() => {
    const storedUser = localStorage.getItem('bunda_care_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const storedHpht = localStorage.getItem('bunda_care_hpht');
    if (storedHpht) setHpht(storedHpht);

    const storedLang = localStorage.getItem('bunda_care_lang') as Language;
    if (storedLang) setLanguage(storedLang);

    const storedPersona = localStorage.getItem('bunda_care_persona') as Persona;
    if (storedPersona) setPersona(storedPersona);

    const storedTheme = localStorage.getItem('bunda_care_theme');
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    }

    const storedCheckups = localStorage.getItem('bunda_care_checkups');
    if (storedCheckups) setCheckups(JSON.parse(storedCheckups));

    const storedUsg = localStorage.getItem('bunda_care_usg');
    if (storedUsg) setUsgRecords(JSON.parse(storedUsg));

    const storedContacts = localStorage.getItem('bunda_care_emergency');
    if (storedContacts) setEmergencyContacts(JSON.parse(storedContacts));

    // Kicks logic
    const todayStr = new Date().toDateString();
    const storedKickDate = localStorage.getItem('bunda_care_kick_date');
    if (storedKickDate === todayStr) {
      setKicks(parseInt(localStorage.getItem('bunda_care_kicks') || '0', 10));
      setKickDate(storedKickDate);
    } else {
      setKicks(0);
      setKickDate(todayStr);
      localStorage.setItem('bunda_care_kick_date', todayStr);
      localStorage.setItem('bunda_care_kicks', '0');
    }
  }, []);

  const applyTheme = (hex: string) => {
    const hexToRgb = (h: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
      return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    };
    const rgbToHsl = (r: number, g: number, b: number) => {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return [h, s, l];
    };
    const hslToRgb = (h: number, s: number, l: number) => {
      let r, g, b;
      if (s === 0) { r = g = b = l; } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    };

    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    const root = document.documentElement;
    
    root.style.setProperty('--theme-500', rgb.join(' '));
    const lDiffLight = 0.98 - l;
    root.style.setProperty('--theme-50', hslToRgb(h, s, l + lDiffLight * 0.9).join(' '));
    root.style.setProperty('--theme-100', hslToRgb(h, s, l + lDiffLight * 0.8).join(' '));
    root.style.setProperty('--theme-200', hslToRgb(h, s, l + lDiffLight * 0.6).join(' '));
    root.style.setProperty('--theme-300', hslToRgb(h, s, l + lDiffLight * 0.4).join(' '));
    root.style.setProperty('--theme-400', hslToRgb(h, s, l + lDiffLight * 0.2).join(' '));
    const lDiffDark = l - 0.1;
    root.style.setProperty('--theme-600', hslToRgb(h, s, Math.max(0.1, l - lDiffDark * 0.2)).join(' '));
    root.style.setProperty('--theme-700', hslToRgb(h, s, Math.max(0.1, l - lDiffDark * 0.4)).join(' '));
    root.style.setProperty('--theme-800', hslToRgb(h, s, Math.max(0.1, l - lDiffDark * 0.6)).join(' '));
    root.style.setProperty('--theme-900', hslToRgb(h, s, Math.max(0.1, l - lDiffDark * 0.8)).join(' '));
  };

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('bunda_care_theme', newTheme);
    applyTheme(newTheme);
  };

  const updateLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('bunda_care_lang', lang);
  };

  const updatePersona = (p: Persona) => {
    setPersona(p);
    localStorage.setItem('bunda_care_persona', p);
  };

  const updateHpht = (date: string) => {
    setHpht(date);
    localStorage.setItem('bunda_care_hpht', date);
  };

  const login = (name: string) => {
    const newUser = { name, email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com` };
    setUser(newUser);
    localStorage.setItem('bunda_care_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bunda_care_user');
  };

  const addKick = () => {
    const newKicks = kicks + 1;
    setKicks(newKicks);
    localStorage.setItem('bunda_care_kicks', newKicks.toString());
  };

  const resetKicks = () => {
    setKicks(0);
    localStorage.setItem('bunda_care_kicks', '0');
  };

  const addCheckup = (checkup: Checkup) => {
    const updated = [...checkups, checkup].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setCheckups(updated);
    localStorage.setItem('bunda_care_checkups', JSON.stringify(updated));
  };

  const deleteCheckup = (id: string) => {
    const updated = checkups.filter(c => c.id !== id);
    setCheckups(updated);
    localStorage.setItem('bunda_care_checkups', JSON.stringify(updated));
  };

  const addUsg = (usg: UsgRecord) => {
    const updated = [...usgRecords, usg].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setUsgRecords(updated);
    localStorage.setItem('bunda_care_usg', JSON.stringify(updated));
  };

  const deleteUsg = (id: string) => {
    const updated = usgRecords.filter(u => u.id !== id);
    setUsgRecords(updated);
    localStorage.setItem('bunda_care_usg', JSON.stringify(updated));
  };

  const addEmergencyContact = (contact: EmergencyContact) => {
    const updated = [...emergencyContacts, contact];
    setEmergencyContacts(updated);
    localStorage.setItem('bunda_care_emergency', JSON.stringify(updated));
  };

  const deleteEmergencyContact = (id: string) => {
    const updated = emergencyContacts.filter(c => c.id !== id);
    setEmergencyContacts(updated);
    localStorage.setItem('bunda_care_emergency', JSON.stringify(updated));
  };

  const resetAllData = () => {
    localStorage.removeItem('bunda_care_hpht');
    localStorage.removeItem('bunda_care_kicks');
    localStorage.removeItem('bunda_care_kick_date');
    setHpht('');
    setKicks(0);
    setChatMessages([]);
  };

  return {
    user, login, logout,
    hpht, updateHpht, resetAllData,
    language, updateLanguage,
    persona, updatePersona,
    theme, updateTheme,
    kicks, addKick, resetKicks,
    checkups, addCheckup, deleteCheckup,
    usgRecords, addUsg, deleteUsg,
    emergencyContacts, addEmergencyContact, deleteEmergencyContact,
    chatMessages, setChatMessages
  };
}
