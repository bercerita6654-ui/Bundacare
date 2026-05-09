import React, { useState, useRef } from 'react';
import { Language, Checkup, UsgRecord } from '../types';
import { i18nData } from '../constants';

// --- TIPS TAB ---
export const TipsTab: React.FC<{ lang: Language, onOpenAi: () => void }> = ({ lang, onOpenAi }) => {
  const dict = i18nData[lang];
  const tips = [
    { title: dict.tip1Title, text: dict.tip1Text, img: "https://picsum.photos/400/200?random=1", icon: "fa-apple-alt", color: "text-red-500", bg: "bg-red-50" },
    { title: dict.tip4Title, text: dict.tip4Text, img: "https://picsum.photos/400/200?random=2", icon: "fa-spa", color: "text-purple-500", bg: "bg-purple-50" }
  ];

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <h2 className="text-2xl font-black text-pink-900 px-2 mt-2">{dict.tipsTitle}</h2>
      
      <div className="glass-morphism p-4 sm:p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-pink-500 to-purple-500 text-white cursor-pointer hover:shadow-lg active:scale-95 transition" onClick={onOpenAi}>
        <div className="absolute -right-4 -top-4 opacity-[0.1]">
          <i className="fas fa-robot text-8xl"></i>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 shadow-inner">
            <i className="fas fa-sparkles text-xl"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg">{dict.aiChatBannerTitle}</h3>
            <p className="text-xs text-white/90">{dict.aiChatBannerDesc}</p>
          </div>
          <i className="fas fa-chevron-right ml-auto text-white/70"></i>
        </div>
      </div>

      <div className="space-y-4">
        {tips.map((t, i) => (
          <div key={i} className="glass-morphism rounded-3xl overflow-hidden hover:shadow-md transition">
            <img src={t.img} className="w-full h-32 object-cover" alt={t.title} loading="lazy" />
            <div className="p-5 flex gap-4 items-start">
              <div className={`w-10 h-10 ${t.bg} ${t.color} rounded-xl shadow-inner flex items-center justify-center shrink-0`}>
                <i className={`fas ${t.icon} text-lg`}></i>
              </div>
              <div>
                <h4 className="font-bold text-pink-900 text-sm mb-1">{t.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{t.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- KICKS TAB ---
export const KicksTab: React.FC<{ lang: Language, kicks: number, onAddKick: () => void, onReset: () => void }> = ({ lang, kicks, onAddKick, onReset }) => {
  const dict = i18nData[lang];
  const KICK_GOAL = 10;
  const circumference = 2 * Math.PI * 85;
  const offset = circumference - (Math.min(kicks, KICK_GOAL) / KICK_GOAL) * circumference;

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="text-center p-6 sm:p-10 glass-card rounded-[40px] mt-2">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">{dict.kicksTitle}</h2>
        <p className="text-[10px] text-pink-500 mb-8 uppercase tracking-widest font-bold bg-pink-100/50 inline-block px-3 py-1 rounded-full border border-pink-200">{dict.kicksDisclaimer}</p>
        
        <div className="relative inline-block mb-4 animate-float">
          <svg className="w-48 h-48 sm:w-56 sm:h-56 relative z-10" viewBox="0 0 200 200">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <circle cx="100" cy="100" r="85" fill="none" className="stroke-pink-50" strokeWidth="16" />
            <circle cx="100" cy="100" r="85" fill="none" className="stroke-pink-500 progress-ring-circle" strokeWidth="16" 
                strokeDasharray={circumference} 
                style={{ strokeDashoffset: offset }} 
                strokeLinecap="round" filter="url(#glow)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black text-pink-600 transition-all duration-300">{kicks}</span>
            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mt-1"><span>{dict.kicksGoal}</span>10</span>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={onAddKick} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition flex items-center justify-center gap-2">
            <i className="fas fa-shoe-prints animate-float"></i> <span>{dict.kicksBtn}</span>
          </button>
          <button onClick={onReset} className="bg-white/40 border border-white/60 text-slate-500 px-6 rounded-2xl hover:bg-white/60 active:scale-95 transition backdrop-blur-md shadow-sm" title={dict.tooltipReset}>
            <i className="fas fa-redo-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CHECKUP TAB ---
export const CheckupTab: React.FC<{ lang: Language, checkups: Checkup[], onDelete: (id: string) => void, onAdd: (c: Checkup) => void }> = ({ lang, checkups, onDelete, onAdd }) => {
  const dict = i18nData[lang];
  const [showModal, setShowModal] = useState(false);
  const [clinic, setClinic] = useState('');
  const [date, setDate] = useState('');
  const [doctor, setDoctor] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!clinic || !date) return;
    onAdd({ id: Date.now().toString(), clinic, date, doctor, note });
    setShowModal(false);
    setClinic(''); setDate(''); setDoctor(''); setNote('');
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="glass-card rounded-[40px] p-4 sm:p-6 mt-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-bl-full opacity-50 blur-2xl"></div>
        
        <div className="flex justify-between items-center mb-4 relative z-10">
          <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">{dict.checkupHomeTitle}</h2>
            <p className="text-[10px] text-pink-500 mt-1 uppercase tracking-widest font-bold">{dict.checkupHomeSubtitle}</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex-none bg-pink-500 hover:bg-pink-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-lg shadow-pink-200 active:scale-95">
            <i className="fas fa-plus"></i>
          </button>
        </div>

        <div className="space-y-3 relative z-10">
          {checkups.length === 0 ? (
            <div className="text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-pink-200">
              <i className="fas fa-notes-medical text-3xl text-pink-200 mb-2"></i>
              <p className="text-xs text-slate-400 font-medium">Belum ada data check-up.</p>
            </div>
          ) : (
            checkups.map(c => (
              <div key={c.id} className="p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-pink-100 shadow-sm relative group overflow-hidden">
                <button onClick={() => onDelete(c.id)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition">
                  <i className="fas fa-trash text-xs"></i>
                </button>
                <div className="flex items-start gap-3">
                  <div className="flex-none bg-pink-100 text-pink-500 w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-inner">
                    <i className="fas fa-hospital"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-700 pr-8">{c.clinic}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <i className="fas fa-calendar-alt"></i> {new Date(c.date).toLocaleDateString()}
                      </span>
                      {c.doctor && <span className="bg-blue-50 text-blue-500 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><i className="fas fa-user-md"></i> {c.doctor}</span>}
                    </div>
                    {c.note && <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl whitespace-pre-wrap">{c.note}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] w-full max-w-sm p-6 sm:p-8 shadow-2xl border border-white/60">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">{dict.addCheckupTitle}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition active:scale-95">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{dict.checkupClinicLabel}</label>
                <input type="text" value={clinic} onChange={e => setClinic(e.target.value)} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-500 outline-none text-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{dict.checkupDateLabel}</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-500 outline-none text-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{dict.checkupDoctorLabel}</label>
                <input type="text" value={doctor} onChange={e => setDoctor(e.target.value)} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-500 outline-none text-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{dict.checkupNoteLabel}</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full bg-slate-50/50 p-3 rounded-2xl border border-pink-100 focus:ring-2 focus:ring-pink-500 outline-none text-slate-700 text-sm"></textarea>
              </div>
              <button onClick={handleSave} className="w-full pink-gradient text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-200 active:scale-95 transition mt-4 flex items-center justify-center gap-2">
                <i className="fas fa-save"></i> <span>{dict.saveBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- USG TAB ---
export const UsgTab: React.FC<{ lang: Language, usgRecords: UsgRecord[], onDelete: (id: string) => void, onAdd: (u: UsgRecord) => void }> = ({ lang, usgRecords, onDelete, onAdd }) => {
  const dict = i18nData[lang];
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState('');
  const [crl, setCrl] = useState('');
  const [ga, setGa] = useState('');
  const [edd, setEdd] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!date) return;
    onAdd({ id: Date.now().toString(), date, photo, crl, ga, edd, note });
    setShowModal(false);
    setDate(''); setCrl(''); setGa(''); setEdd(''); setNote(''); setPhoto(null);
  };

  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="glass-card rounded-[40px] p-4 sm:p-6 mt-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50 blur-2xl"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">{dict.usgHomeTitle}</h2>
            <p className="text-[10px] text-blue-500 mt-1 uppercase tracking-widest font-bold">{dict.usgHomeSubtitle}</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex-none bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-lg shadow-blue-200 active:scale-95">
            <i className="fas fa-plus"></i>
          </button>
        </div>

        <div className="space-y-3 relative z-10">
          {usgRecords.length === 0 ? (
            <div className="text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-blue-200">
              <i className="fas fa-images text-3xl text-blue-200 mb-2"></i>
              <p className="text-xs text-slate-400 font-medium">Belum ada rekaman USG.</p>
            </div>
          ) : (
            usgRecords.map(u => (
              <div key={u.id} className="p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-blue-100 shadow-sm relative group overflow-hidden">
                <button onClick={() => onDelete(u.id)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition z-10">
                  <i className="fas fa-trash text-xs"></i>
                </button>
                {u.photo && (
                  <div className="w-full h-32 mb-3 rounded-xl overflow-hidden relative">
                    <img src={u.photo} className="w-full h-full object-cover" alt="USG" />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="flex-none bg-blue-100 text-blue-500 w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-inner">
                    <i className="fas fa-baby"></i>
                  </div>
                  <div className="flex-1">
                    <span className="bg-blue-50 text-blue-500 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-max">
                      <i className="fas fa-calendar-alt"></i> {new Date(u.date).toLocaleDateString()}
                    </span>
                    {(u.crl || u.ga || u.edd) && (
                      <div className="mt-3 flex items-center bg-blue-50/50 rounded-xl border border-blue-100 p-2 gap-2">
                        <div className="grid grid-cols-3 gap-2 flex-1 divide-x divide-blue-100">
                          <div className="text-center px-1"><span className="block text-[9px] font-bold text-blue-400 uppercase">CRL</span><span className="text-xs text-slate-700 font-bold">{u.crl || '-'}</span></div>
                          <div className="text-center px-1"><span className="block text-[9px] font-bold text-blue-400 uppercase">GA</span><span className="text-xs text-slate-700 font-bold">{u.ga || '-'}</span></div>
                          <div className="text-center px-1"><span className="block text-[9px] font-bold text-blue-400 uppercase">EDD</span><span className="text-xs text-slate-700 font-bold">{u.edd ? new Date(u.edd).toLocaleDateString() : '-'}</span></div>
                        </div>
                      </div>
                    )}
                    {u.note && <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-xl whitespace-pre-wrap">{u.note}</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] w-full max-w-sm p-6 sm:p-8 shadow-2xl border border-white/60 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">{dict.addUsgTitle}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition active:scale-95">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tanggal *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-50/50 p-4 rounded-2xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Foto USG</label>
                <div className="relative w-full h-32 bg-slate-50/50 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center text-blue-400 overflow-hidden">
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {!photo ? (
                    <>
                      <i className="fas fa-cloud-upload-alt text-2xl mb-1"></i>
                      <span className="text-xs font-bold">Pilih Foto</span>
                    </>
                  ) : (
                    <img src={photo} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">CRL (cm/mm)</label>
                  <input type="text" value={crl} onChange={e => setCrl(e.target.value)} className="w-full bg-slate-50/50 p-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">GA (Usia)</label>
                  <input type="text" value={ga} onChange={e => setGa(e.target.value)} className="w-full bg-slate-50/50 p-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 text-sm" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">EDD (HPL)</label>
                  <input type="date" value={edd} onChange={e => setEdd(e.target.value)} className="w-full bg-slate-50/50 p-3 rounded-xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Catatan</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full bg-slate-50/50 p-3 rounded-2xl border border-blue-100 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 text-sm"></textarea>
              </div>
              <button onClick={handleSave} className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition mt-4 flex items-center justify-center gap-2">
                <i className="fas fa-save"></i> <span>{dict.saveBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
