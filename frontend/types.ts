export interface User {
  name: string;
  email: string;
}

export interface Checkup {
  id: string;
  clinic: string;
  date: string;
  doctor: string;
  note: string;
}

export interface UsgRecord {
  id: string;
  date: string;
  photo: string | null;
  crl: string;
  ga: string;
  edd: string;
  note: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type Language = 'id' | 'en';
export type Persona = 'default' | 'formal' | 'casual';
export type Tab = 'dashboard' | 'tips' | 'kicks' | 'checkup' | 'usg';
