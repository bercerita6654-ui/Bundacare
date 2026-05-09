import React, { useState, useRef, useEffect } from 'react';
import { Language, Persona, ChatMessage } from '../types';
import { i18nData } from '../constants';
import { getGeminiResponse } from '../services/gemini';

// Declare marked globally
declare const marked: any;

interface AiChatProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  persona: Persona;
  hpht: string;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const AiChat: React.FC<AiChatProps> = ({ isOpen, onClose, lang, persona, hpht, messages, setMessages }) => {
  const dict = i18nData[lang];
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const originalInputRef = useRef('');

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'model', text: dict.aiWelcomeMsg }]);
    }
  }, [isOpen, messages.length, dict.aiWelcomeMsg, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'id' ? "Browser Anda tidak mendukung pengenalan suara." : "Your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : 'id-ID';
    recognition.interimResults = true;
    recognition.continuous = true;

    originalInputRef.current = input + (input && !input.endsWith(' ') ? ' ' : '');
    let lastFinal = '';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let newFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinal += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      lastFinal += newFinal;
      setInput(originalInputRef.current + lastFinal + interimTranscript);
    };

    recognition.onerror = (e: any) => {
      console.error("Speech recognition error", e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userText = input.trim();
    setInput('');
    
    // Capture current history before updating state to pass to API
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    let personaInstruction = "ramah, empati, informatif";
    if (persona === 'formal') {
      personaInstruction = "formal, sangat profesional, objektif, berorientasi medis";
    } else if (persona === 'casual') {
      personaInstruction = "sangat santai, menyenangkan, suportif, layaknya sahabat (bestie)";
    }

    const systemInstruction = `Anda adalah asisten kehamilan cerdas bernama "BundaCare AI".\nTanggal Hari Ini: ${new Date().toISOString().split('T')[0]}.\nData Tambahan: Hari Pertama Haid Terakhir (HPHT) pengguna adalah ${hpht || 'belum disetel'}. Bahasa saat ini: ${lang || 'id'}.\nJawab dalam bahasa yang digunakan pengguna (Indonesia atau Inggris).\nBerikan saran atau rekomendasi yang ${personaInstruction}, ringkas, dan akurat berdasarkan panduan kehamilan umum. Jika ditanya gejala, sertakan peringatan bahwa ini bukan saran medis pengganti dokter. \nPesan Anda akan dirender menggunakan Markdown. Gunakan format Markdown yang sesuai seperti **bold**, *italic*, list peluru (-), link, dan paragraf agar mudah dibaca dan menarik. Jangan gunakan format HTML/tag HTML manual, gunakan murni Markdown.`;

    try {
      const responseText = await getGeminiResponse(userText, systemInstruction, currentHistory);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: dict.aiError }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-end justify-center p-0 transition-opacity duration-300">
      <div className="bg-slate-50 rounded-t-[32px] w-full max-w-sm h-[85vh] flex flex-col shadow-2xl transform transition-transform duration-300">
        <div className="p-4 border-b border-pink-500/20 flex justify-between items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-[32px] relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-[0.2]">
            <i className="fas fa-sparkles text-6xl"></i>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
              <i className="fas fa-robot"></i>
            </div>
            <div>
              <h3 className="font-bold text-sm">{dict.aiBotName}</h3>
              <p className="text-[10px] text-white/80">{dict.aiBotStatus}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition focus:outline-none relative z-10">
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>
         
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shrink-0 border border-pink-200">
                  <i className="fas fa-robot text-xs"></i>
                </div>
              )}
              <div 
                className={`${msg.role === 'user' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-tr-sm' : 'bg-white text-slate-700 rounded-tl-sm border border-slate-100'} p-3 rounded-2xl shadow-sm text-[13px] leading-relaxed font-medium markdown-body`}
                dangerouslySetInnerHTML={{ __html: msg.role === 'model' ? marked.parse(msg.text) : msg.text }}
              />
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 border border-slate-200">
                  <i className="fas fa-user text-xs"></i>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center shrink-0 border border-pink-200">
                <i className="fas fa-robot text-xs"></i>
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 text-[13px] text-slate-500 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
         
        <div className="p-3 bg-white border-t border-slate-100 rounded-t-2xl shadow-[0_-4px_15px_-3px_rgba(0,0,0,0.05)] z-10">
          <form className="flex gap-2 items-end" onSubmit={handleSubmit}>
            <div className="flex-1 bg-slate-100 rounded-2xl flex items-end border border-slate-200 overflow-hidden focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100 transition-all">
              <textarea 
                rows={1} 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-transparent p-3 sm:p-4 text-sm outline-none text-slate-700 resize-none max-h-24 min-h-[44px]" 
                placeholder={dict.aiChatInputPlaceholder}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = target.scrollHeight + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button 
                type="button" 
                onClick={toggleListening}
                className={`p-3 sm:p-4 transition-colors ${isListening ? 'text-pink-500 animate-pulse' : 'text-slate-400 hover:text-pink-500'}`}
              >
                <i className="fas fa-microphone"></i>
              </button>
            </div>
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl flex items-center justify-center hover:opacity-90 transition shadow-md active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-paper-plane text-sm sm:text-base"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
