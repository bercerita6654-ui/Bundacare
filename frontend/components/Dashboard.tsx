import React, { useEffect, useRef, useState } from 'react';
import { PREGNANCY_DAYS, detailedWeeks, i18nData } from '../constants';
import { Language } from '../types';

// We need to declare Chart globally since it's loaded via CDN
declare const Chart: any;

interface DashboardProps {
  hpht: string;
  setHpht: (date: string) => void;
  lang: Language;
  onSwitchTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ hpht, setHpht, lang, onSwitchTab }) => {
  const dict = i18nData[lang];
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);
  const [localHpht, setLocalHpht] = useState(hpht);

  const handleCalculate = () => {
    if (localHpht) {
      setHpht(localHpht);
    }
  };

  // Chart Effect
  useEffect(() => {
    if (!hpht || !chartRef.current) return;
    
    const hphtDate = new Date(hpht);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - hphtDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const standardWeeks = [8, 12, 16, 20, 24, 28, 32, 36, 40];
    const standardAvgLength = [1.6, 5.4, 11.6, 25.6, 30.0, 37.6, 42.4, 47.4, 51.2];
    
    let exactWeek = diffDays / 7;
    let combinedWeeks = [...standardWeeks];
    if (!combinedWeeks.some(w => Math.abs(w - exactWeek) < 0.1) && exactWeek <= 42) {
      combinedWeeks.push(exactWeek);
    }
    combinedWeeks.sort((a, b) => a - b);

    const getAvgAt = (w: number) => {
      if (w <= 8) return 1.6;
      if (w >= 40) return 51.2;
      for (let i = 1; i < standardWeeks.length; i++) {
        if (w === standardWeeks[i]) return standardAvgLength[i];
        if (w < standardWeeks[i]) {
          const ratio = (w - standardWeeks[i-1]) / (standardWeeks[i] - standardWeeks[i-1]);
          return standardAvgLength[i-1] + ratio * (standardAvgLength[i] - standardAvgLength[i-1]);
        }
      }
      return 0;
    };

    const avgLength = combinedWeeks.map(w => getAvgAt(w));
    const currentData = combinedWeeks.map(w => w <= exactWeek ? getAvgAt(w) : null);
    const labels = combinedWeeks.map(w => {
      const isCurrent = Math.abs(w - exactWeek) < 0.0001;
      return isCurrent ? (lang === 'en' ? 'Now' : 'Skrg') : (lang === 'en' ? `W${Math.round(w)}` : `Mg${Math.round(w)}`);
    });

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: lang === 'en' ? 'Average Length (cm)' : 'Rata-rata Panjang (cm)',
            data: avgLength,
            borderColor: '#fbcfe8',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            tension: 0.4
          },
          {
            label: lang === 'en' ? 'Your Progress' : 'Progres Anda',
            data: currentData,
            borderColor: '#ec4899',
            backgroundColor: '#fce7f3',
            borderWidth: 3,
            pointBackgroundColor: '#be185d',
            pointBorderColor: '#fff',
            pointHoverRadius: 6,
            pointRadius: 4,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#be185d',
            bodyColor: '#475569',
            borderColor: '#fbcfe8',
            borderWidth: 1,
            callbacks: {
              label: (context: any) => context.parsed.y.toFixed(1) + ' cm'
            }
          }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [hpht, lang]);

  if (!hpht) {
    return (
      <div className="glass-card p-6 sm:p-10 rounded-[40px]">
        <h2 className="text-lg font-semibold text-pink-600 mb-1">{dict.setupTitle}</h2>
        <p className="text-sm text-gray-500 mb-6">{dict.setupDesc}</p>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{dict.hphtLabel}</label>
            <input 
              type="date" 
              value={localHpht}
              onChange={(e) => setLocalHpht(e.target.value)}
              className="w-full p-4 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-500 outline-none bg-white"
            />
          </div>
          <button 
            onClick={handleCalculate}
            className="w-full pink-gradient text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform hover:shadow-pink-300/50"
          >
            {dict.calcBtn}
          </button>
        </div>
      </div>
    );
  }

  // Calculations
  const hphtDate = new Date(hpht);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - hphtDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const weeks = Math.max(0, Math.floor(diffDays / 7));
  const days = Math.max(0, diffDays % 7);
  const progress = Math.min((diffDays / PREGNANCY_DAYS) * 100, 100).toFixed(1);
  const months = (diffDays / 30.44).toFixed(1);

  const edd = new Date(hphtDate);
  edd.setDate(edd.getDate() + PREGNANCY_DAYS);
  const conception = new Date(hphtDate);
  conception.setDate(conception.getDate() + 14);
  const remDays = Math.ceil((edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let trimester = dict.tri1Title;
  let trimesterDesc = dict.tri1Desc;
  if (weeks >= 13 && weeks < 28) {
    trimester = dict.tri2Title;
    trimesterDesc = dict.tri2Desc;
  } else if (weeks >= 28) {
    trimester = dict.tri3Title;
    trimesterDesc = dict.tri3Desc;
  }

  const safeWeek = Math.min(Math.max(weeks, 4), 40);
  const weekData = detailedWeeks[lang].weeks[safeWeek] || '';
  const symptomData = detailedWeeks[lang].symptoms[safeWeek] || '';
  const adviceData = detailedWeeks[lang].advices[safeWeek] || '';
  
  const parts = weekData.split('. ');
  const sizeStr = parts[0];
  const textStr = parts.slice(1).join('. ') || sizeStr;

  const formatDate = (d: Date) => d.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const formatShortDate = (d: Date) => d.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5 animate-[fadeIn_0.4s_ease-out]">
      {/* Main Card */}
      <div className="glass-card p-6 sm:p-10 rounded-[40px] relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-pink-600 font-bold uppercase tracking-widest text-[10px] mb-2">{dict.pregAgeLabel}</p>
          <h2 className="text-5xl font-black text-pink-900 mb-2 leading-tight tracking-tighter">
            {weeks} {dict.weeksLabel} {days} {dict.daysLabel}
          </h2>
          <h3 className="text-xl font-bold text-pink-700/80 mb-6">
            {dict.aroundMonthsLabel.replace('{m}', months)}
          </h3>
          
          <div className="w-full bg-pink-100/50 h-3 rounded-full overflow-hidden mb-4 border border-pink-200">
            <div className="bg-pink-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(236,72,153,0.3)]" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between items-start text-[10px] font-bold text-pink-400 uppercase relative">
            <div className="flex flex-col items-start gap-1 w-1/3">
              <span className="tracking-widest">{dict.startLabel}</span>
              <span className="text-[9px] text-pink-600 bg-white/50 px-2 py-1 rounded-md whitespace-nowrap leading-none shadow-sm border border-pink-100 font-medium">{formatShortDate(hphtDate)}</span>
            </div>
            <span className="bg-pink-500 text-white px-3 py-1.5 rounded-full shadow-sm z-10 shrink-0 transform -translate-y-1">{progress}%</span>
            <div className="flex flex-col items-end gap-1 w-1/3">
              <span className="tracking-widest">{dict.birthLabel}</span>
              <span className="text-[9px] text-pink-600 bg-white/50 px-2 py-1 rounded-md whitespace-nowrap leading-none shadow-sm border border-pink-100 font-medium">{formatShortDate(edd)}</span>
            </div>
          </div>
        </div>
        <i className="fas fa-baby-carriage absolute -bottom-4 -right-4 text-8xl text-pink-500 opacity-5 rotate-12 animate-pulse" style={{ animationDuration: '4s' }}></i>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="glass-morphism p-4 sm:p-6 rounded-3xl">
          <p className="text-[10px] font-bold text-pink-400 uppercase mb-2">{dict.eddLabel}</p>
          <p className="text-lg font-bold text-pink-900 leading-tight">{formatDate(edd)}</p>
          <p className="text-[10px] text-pink-600 mt-1 font-medium">{remDays > 0 ? dict.daysRemaining.replace('{d}', remDays.toString()) : dict.timeToMeet}</p>
        </div>
        <div className="glass-morphism p-4 sm:p-6 rounded-3xl">
          <p className="text-[10px] font-bold text-pink-400 uppercase mb-2">{dict.conceptionLabel}</p>
          <p className="text-lg font-bold text-pink-900 leading-tight">{formatDate(conception)}</p>
          <p className="text-[10px] text-slate-500 mt-1 font-medium">{dict.conceptionDesc}</p>
        </div>
      </div>

      {/* Trimester Detail */}
      <div className="glass-morphism p-4 sm:p-6 rounded-3xl flex items-start flex-col gap-3 relative overflow-hidden cursor-pointer group" onClick={() => onSwitchTab('tips')}>
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
          <i className="fas fa-book-reader text-8xl text-pink-500"></i>
        </div>
        <div className="flex justify-between items-center w-full relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 w-8 h-8 flex items-center justify-center rounded-xl text-white shadow-sm">
              <i className="fas fa-star text-xs"></i>
            </div>
            <h3 className="font-bold text-pink-900 text-lg">{trimester}</h3>
          </div>
          <div className="bg-white/50 w-8 h-8 rounded-full flex items-center justify-center text-pink-400 group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors">
            <i className="fas fa-arrow-right text-sm"></i>
          </div>
        </div>
        <div className="relative z-10">
          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{trimesterDesc}</p>
          <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-2">{dict.readTipsBtn}</p>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="glass-morphism p-4 sm:p-6 rounded-3xl border border-white/50 relative overflow-hidden bg-gradient-to-br from-white/70 to-pink-50/50 shadow-sm">
        <div className="absolute -right-4 -top-4 opacity-[0.03]">
          <i className="fas fa-calendar-week text-8xl text-pink-500"></i>
        </div>
        <div className="flex items-center gap-3 mb-5 relative z-10">
          <div className="bg-gradient-to-br from-pink-400 to-pink-500 p-2.5 rounded-[14px] text-white shadow-md shadow-pink-200">
            <i className="fas fa-calendar-check text-[14px]"></i>
          </div>
          <h3 className="font-bold text-gray-800 text-sm">{dict.weeklySummaryTitle}</h3>
        </div>
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl shadow-sm border border-white backdrop-blur-sm">
            <div className="bg-pink-100 p-2.5 rounded-[12px] text-pink-500 shrink-0">
              <i className="fas fa-child text-sm"></i>
            </div>
            <div>
              <h4 className="font-bold text-[11px] text-pink-900 uppercase tracking-wider">{dict.fetalSizeTitle}</h4>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed"><span className="font-bold text-pink-700">{sizeStr}</span></p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-white/60 rounded-2xl shadow-sm border border-white backdrop-blur-sm">
            <div className="bg-blue-100 p-2.5 rounded-[12px] text-blue-500 shrink-0">
              <i className="fas fa-lightbulb text-sm"></i>
            </div>
            <div>
              <h4 className="font-bold text-[11px] text-blue-900 uppercase tracking-wider">{dict.weeklyTipTitle}</h4>
              <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">{textStr}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-orange-50/80 rounded-2xl shadow-sm border border-orange-100 backdrop-blur-sm">
            <div className="bg-orange-100 p-2.5 rounded-[12px] text-orange-500 shrink-0">
              <i className="fas fa-stethoscope text-sm"></i>
            </div>
            <div>
              <h4 className="font-bold text-[11px] text-orange-900 uppercase tracking-wider">{dict.symptomTitle}</h4>
              <p className="text-[11px] text-orange-800 mt-1 leading-relaxed">{symptomData}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-emerald-50/80 rounded-2xl shadow-sm border border-emerald-100 backdrop-blur-sm">
            <div className="bg-emerald-100 p-2.5 rounded-[12px] text-emerald-500 shrink-0">
              <i className="fas fa-leaf text-sm"></i>
            </div>
            <div>
              <h4 className="font-bold text-[11px] text-emerald-900 uppercase tracking-wider">{dict.adviceTitle}</h4>
              <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">{adviceData}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="glass-morphism p-4 sm:p-6 rounded-3xl">
        <h3 className="font-bold text-pink-900 text-sm mb-2 flex items-center gap-2">
          <i className="fas fa-chart-line text-pink-500"></i> <span>{dict.growthChartTitle}</span>
        </h3>
        <p className="text-[10px] text-slate-500 mb-4">{dict.growthChartSubtitle}</p>
        <div className="relative h-48 sm:h-56 w-full bg-white/50 rounded-2xl p-2 border border-white">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};
