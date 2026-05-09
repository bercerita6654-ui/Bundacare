import React, { useState } from 'react';
import { useAppData } from './hooks/useAppData';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { TipsTab, KicksTab, CheckupTab, UsgTab } from './components/OtherTabs';
import { AiChat } from './components/AiChat';
import { Tab } from './types';
import { i18nData } from './constants';

export default function App() {
  const appData = useAppData();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const dict = i18nData[appData.language];

  if (!appData.user) {
    return <Auth onLogin={appData.login} />;
  }

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="bg-white/30 backdrop-blur-md border-b border-white/40 p-4 sm:p-6 rounded-b-[40px] shadow-sm sticky top-0 z-50 max-w-md mx-auto">
        <div className="flex justify-between items-center relative">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 rounded-[14px] sm:rounded-2xl flex items-center justify-center text-white shadow-lg animate-float shrink-0">
              <i className="fas fa-baby-carriage text-base sm:text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-pink-900 leading-none flex items-center gap-2">
                BundaCare
              </h1>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-pink-600 font-bold mt-1 flex items-center gap-1">
                <i className="fas fa-heart text-pink-400 animate-heartbeat"></i> 
                <span>{dict.headerSubtitle}</span>
              </p>
            </div>
          </div>
          <div className="flex justify-end items-center gap-1.5 sm:gap-2">
            <button onClick={() => setIsSettingsOpen(true)} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm bg-white/50 text-pink-600 hover:bg-white flex items-center justify-center transition active:scale-95 backdrop-blur-md shrink-0" title={dict.tooltipSettings}>
              <i className="fas fa-palette text-xs sm:text-sm"></i>
            </button>
            <button onClick={() => { if(confirm(dict.confirmResetData)) appData.resetAllData(); }} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm bg-pink-200 text-pink-600 hover:bg-pink-300 flex items-center justify-center transition active:scale-95 shrink-0" title={dict.tooltipReset}>
              <i className="fas fa-sync-alt text-xs sm:text-sm"></i>
            </button>
            <button onClick={appData.logout} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition active:scale-95 shrink-0" title={dict.logoutBtn}>
              <i className="fas fa-sign-out-alt text-xs sm:text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            hpht={appData.hpht} 
            setHpht={appData.updateHpht} 
            lang={appData.language} 
            onSwitchTab={(t) => setActiveTab(t as Tab)} 
          />
        )}
        {activeTab === 'tips' && <TipsTab lang={appData.language} onOpenAi={() => setIsAiChatOpen(true)} />}
        {activeTab === 'kicks' && <KicksTab lang={appData.language} kicks={appData.kicks} onAddKick={appData.addKick} onReset={appData.resetKicks} />}
        {activeTab === 'checkup' && <CheckupTab lang={appData.language} checkups={appData.checkups} onAdd={appData.addCheckup} onDelete={appData.deleteCheckup} />}
        {activeTab === 'usg' && <UsgTab lang={appData.language} usgRecords={appData.usgRecords} onAdd={appData.addUsg} onDelete={appData.deleteUsg} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/40 backdrop-blur-xl border-t border-white/50 px-4 sm:px-6 py-3 flex justify-between items-center z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] max-w-md mx-auto">
        {[
          { id: 'dashboard', icon: 'fa-home', label: dict.navHome },
          { id: 'tips', icon: 'fa-book-open', label: dict.navTips },
          { id: 'kicks', icon: 'fa-heartbeat', label: dict.navKicks },
          { id: 'checkup', icon: 'fa-stethoscope', label: dict.navCheckup },
          { id: 'usg', icon: 'fa-images', label: dict.navUsg }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)} 
            className={`p-2 flex flex-col items-center transition-colors ${activeTab === tab.id ? 'text-pink-600' : 'text-gray-400 hover:text-pink-400'}`}
          >
            <i className={`fas ${tab.icon} text-xl sm:text-lg mb-1`}></i>
            <span className="text-[10px] sm:text-[9px] font-bold">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Modals */}
      <AiChat 
        isOpen={isAiChatOpen} 
        onClose={() => setIsAiChatOpen(false)} 
        lang={appData.language} 
        persona={appData.persona} 
        hpht={appData.hpht} 
        messages={appData.chatMessages}
        setMessages={appData.setChatMessages}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] w-full max-w-sm p-6 sm:p-8 shadow-2xl border border-white/60">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="bg-pink-100 text-pink-500 w-8 h-8 rounded-xl flex items-center justify-center">
                  <i className="fas fa-paint-brush text-sm"></i>
                </div>
                <span>{dict.settingsDisplay}</span>
              </h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white/50 w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95"><i className="fas fa-times text-sm"></i></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-500 mb-3">{dict.settingsTheme}</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f43f5e'].map(color => (
                    <button key={color} onClick={() => appData.updateTheme(color)} className="w-10 h-10 rounded-full shadow-sm border-[3px] border-white focus:outline-none focus:ring-2 focus:ring-slate-400 active:scale-90 transition" style={{ backgroundColor: color }}></button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-500 mb-3">{dict.settingsLanguage}</h3>
                <div className="flex gap-3">
                  <button onClick={() => appData.updateLanguage('id')} className={`flex-1 py-3 bg-white/50 border rounded-xl font-bold text-sm focus:outline-none transition-all ${appData.language === 'id' ? 'border-pink-200 text-pink-600' : 'border-white text-slate-500'}`}>🇮🇩 Indonesia</button>
                  <button onClick={() => appData.updateLanguage('en')} className={`flex-1 py-3 bg-white/50 border rounded-xl font-bold text-sm focus:outline-none transition-all ${appData.language === 'en' ? 'border-pink-200 text-pink-600' : 'border-white text-slate-500'}`}>🇬🇧 English</button>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-500 mb-3 mt-6">{dict.settingsPersona}</h3>
                <select value={appData.persona} onChange={(e) => appData.updatePersona(e.target.value as Persona)} className="w-full bg-white/50 border border-white rounded-xl px-4 py-3 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all cursor-pointer">
                  <option value="default">{dict.personaDefault}</option>
                  <option value="formal">{dict.personaFormal}</option>
                  <option value="casual">{dict.personaCasual}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
