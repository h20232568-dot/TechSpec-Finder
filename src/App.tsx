/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect, ChangeEvent } from 'react';
import { 
  Search, 
  ArrowRight, 
  Smartphone, 
  User, 
  MessageSquare, 
  ArrowLeftRight, 
  ChevronRight, 
  ChevronLeft, 
  ChevronUp, 
  ChevronDown,
  Battery,
  Maximize,
  Cpu,
  Star,
  CheckCircle2,
  Heart,
  Send,
  PlusCircle,
  X,
  CreditCard,
  Bell,
  Compass,
  Check,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, Page, SearchFilters } from './types';
import { MOCK_DEVICES, CHAT_SUGGESTIONS } from './constants';
import { fetchSmartphoneNews, searchDevices, NewsItem } from './services/geminiService';
import { TechCatchGame } from './components/TechCatchGame';

// --- Shared Components ---

const TopAppBar = ({ 
  onNavigate, 
  currentPage, 
  onToggleNotifications, 
  unreadCount,
  onLogoClick
}: { 
  onNavigate: (p: Page) => void, 
  currentPage: Page, 
  onToggleNotifications: () => void,
  unreadCount: number,
  onLogoClick: () => void
}) => (
  <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 dark:bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300">
    <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onLogoClick}>
        <div className="p-1.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Smartphone className="text-primary w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-on-surface font-manrope tracking-tight whitespace-nowrap">
          TechSpec Finder
        </h1>
      </div>
      <nav className="hidden md:flex gap-8">
        <button 
          onClick={() => onNavigate('search')}
          className={`font-manrope font-semibold flex items-center gap-2 transition-colors ${currentPage === 'search' || currentPage === 'results' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
        >
          <Search className="w-4 h-4" /> 검색
        </button>
        <button 
          onClick={() => onNavigate('compare')}
          className={`font-manrope font-semibold flex items-center gap-2 transition-colors ${currentPage === 'compare' ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
        >
          <ArrowLeftRight className="w-4 h-4" /> 비교하기
        </button>
      </nav>
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleNotifications}
          className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
          )}
        </button>
        <button 
          onClick={() => onNavigate('profile')}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentPage === 'profile' ? 'bg-primary text-white ring-2 ring-primary-container' : 'bg-primary-container text-on-primary-container hover:brightness-95'}`}
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </div>
  </header>
);

const NotificationPanel = ({ 
  isOpen, 
  onClose, 
  news, 
  loading 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  news: NewsItem[], 
  loading: boolean 
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <div className="fixed inset-0 z-[60]" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 right-4 left-4 md:left-auto md:right-6 md:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 z-[70] overflow-hidden flex flex-col max-h-[70vh]"
        >
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-primary/5">
            <h3 className="font-manrope font-bold text-lg text-primary flex items-center gap-2">
              <Compass className="w-5 h-5" /> 실시간 스마트폰 뉴스
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-surface-container-high rounded-full transition-colors">
              <X className="w-4 h-4 text-on-surface-variant/60" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
                <p className="text-sm font-medium">최신 뉴스를 가져오는 중...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm">현재 소식이 없습니다.</p>
              </div>
            ) : (
              news.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group block p-4 rounded-xl hover:bg-surface-container-low border border-transparent hover:border-outline-variant transition-all cursor-pointer"
                  onClick={() => window.open(item.url, '_blank')}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-bold text-sm text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-3 mb-2 leading-relaxed">
                    {item.summary}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-0.5 rounded">
                      {item.source}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-center text-gray-400 font-medium">
              Google Search를 통해 수집된 실시간 정보입니다.
            </p>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const BottomNavBar = ({ onNavigate, currentPage }: { onNavigate: (p: Page) => void, currentPage: Page }) => (
  <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface/90 dark:bg-surface/95 backdrop-blur-md border-t border-outline-variant/30 shadow-xl rounded-t-[32px] pb-safe transition-colors duration-300">
    <div className="flex justify-around items-center px-4 py-2 h-16">
      <button 
        onClick={() => onNavigate('search')}
        className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${currentPage === 'search' || currentPage === 'results' ? 'text-primary bg-primary/10' : 'text-on-surface-variant/60 hover:text-primary'}`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">검색</span>
      </button>
      <button 
        onClick={() => onNavigate('compare')}
        className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${currentPage === 'compare' ? 'text-primary bg-primary/10' : 'text-on-surface-variant/60 hover:text-primary'}`}
      >
        <ArrowLeftRight className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">비교</span>
      </button>
      <button 
        onClick={() => onNavigate('profile')}
        className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all ${currentPage === 'profile' ? 'text-primary bg-primary/10' : 'text-on-surface-variant/60 hover:text-primary'}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">프로필</span>
      </button>
    </div>
  </nav>
);

// --- Pages ---

// --- Helper Components ---

const DualRangeSlider = ({ 
  min, 
  max, 
  step, 
  minValue, 
  maxValue, 
  onMinChange, 
  onMaxChange,
  unit
}: { 
  min: number, 
  max: number, 
  step: number, 
  minValue: number | undefined, 
  maxValue: number | undefined,
  onMinChange: (val: number) => void,
  onMaxChange: (val: number) => void,
  unit: string
}) => {
  const currentMin = minValue || min;
  const currentMax = maxValue || max;

  return (
    <div className="space-y-4">
      <div className="relative h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
        {/* Track Highlight */}
        <div 
          className="absolute h-full bg-primary rounded-full transition-all"
          style={{ 
            left: `${((currentMin - min) / (max - min)) * 100}%`, 
            right: `${100 - ((currentMax - min) / (max - min)) * 100}%` 
          }}
        />
        {/* Min Input */}
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMin}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val <= currentMax) onMinChange(val);
          }}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
        />
        {/* Max Input */}
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMax}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= currentMin) onMaxChange(val);
          }}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
        <span>{currentMin}{unit}</span>
        <span>{currentMax}{unit}</span>
      </div>
    </div>
  );
};

const SearchPage = ({ onSearch }: { onSearch: (filters: SearchFilters) => void }) => {
  const [formData, setFormData] = useState<SearchFilters>({
    brand: '모든 브랜드',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (e.target.type === 'number' || e.target.type === 'range' ? Number(value) : value)
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start"
    >
      <div className="lg:col-span-5 space-y-md">
        <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-semibold text-xs uppercase tracking-wider">
          스마트 검색
        </span>
        <h2 className="font-manrope text-4xl lg:text-5xl font-bold text-on-surface leading-tight mb-6 lg:mb-8">
          수치로 찾는 나만의<br />완벽한 기기
        </h2>
        <p className="text-body-lg text-on-surface-variant max-w-md">
          정밀한 검색 엔진으로 수천 대의 스마트폰 중 원하는 사양을 정확히 찾아보세요.
        </p>
        <div className="relative w-full aspect-square rounded-[48px] overflow-hidden shadow-2xl border border-outline-variant/20 bg-surface-container-lowest group mt-10 lg:mt-12 flex items-center justify-center p-12">
          {/* 하이테크 배경 효과 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent_70%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[100px] rounded-full" />
          
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10 w-full h-full flex items-center justify-center"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC29sc-pJVYWx2OE2gbnYA4cHgPlykXpNFbDPk9N5Rsz47ZLNsKc94K6VfAjahjnyZDa-ldUiRMsA8oI3k1aXYAe8A5SaaGKJLYwdaQ8CDXM6opavh9Izys-jqK-aUc43SL5swWCbrVra0j2u5aH3B9iHmKCAilCB5DybC64hMGspMlDllBCmPSh67fLvU8UrHkziN-4B-C_6sr3i0mnKTtk8x8vtwzJYr3yf6ggCgb90gMGZ4Gz7YN7A-F8vNZ5_pyC-6EIxRZcPs" 
              alt="Hero Showcase" 
              className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>

          {/* 장식용 부유 태그 */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-[20%] right-[10%] bg-surface/90 backdrop-blur-md border border-outline-variant/30 shadow-lg px-4 py-2 rounded-2xl z-20 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">AI Optimized</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute bottom-[20%] left-[10%] bg-surface/90 backdrop-blur-md border border-outline-variant/30 shadow-lg px-4 py-2 rounded-2xl z-20 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">Snapdragon 8 Gen 3</span>
          </motion.div>

          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/[0.02] to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-6 lg:p-10 shadow-xl shadow-on-surface/5">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); onSearch(formData); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">제조사</label>
              <input 
                type="text"
                name="brand"
                list="brands-list"
                placeholder="예: Samsung, Apple..."
                value={formData.brand === '모든 브랜드' ? '' : formData.brand}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl bg-surface border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-container outline-none transition-all"
              />
              <datalist id="brands-list">
                <option value="Samsung" />
                <option value="Apple" />
                <option value="Google" />
                <option value="Nothing" />
                <option value="Xiaomi" />
                <option value="Sony" />
                <option value="Asus" />
                <option value="OnePlus" />
              </datalist>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">출시년도</label>
              <div className="relative">
                <input 
                  type="number" 
                  name="year"
                  placeholder="2026" 
                  min="2010"
                  value={formData.year || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-surface border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-container outline-none" 
                />
              </div>
            </div>
            
            <div className="space-y-4 md:col-span-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">화면 크기 (인치)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    type="number" 
                    name="minDisplay"
                    placeholder="최소" 
                    step="0.1" 
                    value={formData.minDisplay || ''}
                    onChange={handleChange}
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-surface border border-outline-variant focus:border-primary outline-none" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs opacity-60">in</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    name="maxDisplay"
                    placeholder="최대" 
                    step="0.1" 
                    value={formData.maxDisplay || ''}
                    onChange={handleChange}
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-surface border border-outline-variant focus:border-primary outline-none" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs opacity-60">in</span>
                </div>
              </div>
              <DualRangeSlider 
                min={0}
                max={8.0}
                step={0.1}
                minValue={formData.minDisplay}
                maxValue={formData.maxDisplay}
                onMinChange={(val) => setFormData(p => ({ ...p, minDisplay: val }))}
                onMaxChange={(val) => setFormData(p => ({ ...p, maxDisplay: val }))}
                unit="in"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">배터리 용량 (mAh)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    type="number" 
                    name="minBattery"
                    placeholder="최소" 
                    value={formData.minBattery || ''}
                    onChange={handleChange}
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-surface border border-outline-variant focus:border-primary outline-none" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs opacity-60">mAh</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    name="maxBattery"
                    placeholder="최대" 
                    value={formData.maxBattery || ''}
                    onChange={handleChange}
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-surface border border-outline-variant focus:border-primary outline-none" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs opacity-60">mAh</span>
                </div>
              </div>
              <DualRangeSlider 
                min={0}
                max={7000}
                step={100}
                minValue={formData.minBattery}
                maxValue={formData.maxBattery}
                onMinChange={(val) => setFormData(p => ({ ...p, minBattery: val }))}
                onMaxChange={(val) => setFormData(p => ({ ...p, maxBattery: val }))}
                unit="mAh"
              />
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">출시가</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    type="number" 
                    name="minPrice"
                    placeholder="최소" 
                    value={formData.minPrice || ''}
                    onChange={handleChange}
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-surface border border-outline-variant focus:border-primary outline-none" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs opacity-60">$</span>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    name="maxPrice"
                    placeholder="최대" 
                    value={formData.maxPrice || ''}
                    onChange={handleChange}
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-surface border border-outline-variant focus:border-primary outline-none" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs opacity-60">$</span>
                </div>
              </div>
              <DualRangeSlider 
                min={0}
                max={2500}
                step={50}
                minValue={formData.minPrice}
                maxValue={formData.maxPrice}
                onMinChange={(val) => setFormData(p => ({ ...p, minPrice: val }))}
                onMaxChange={(val) => setFormData(p => ({ ...p, maxPrice: val }))}
                unit="$"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-on-primary h-14 rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all"
          >
            <Search className="w-5 h-5" /> 기기 검색하기
          </button>

          <div className="pt-4 border-t border-gray-50">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4">인기 필터</p>
            <div className="flex flex-wrap gap-2">
              {[
                { tag: '컴팩트 플래그십', filters: { maxDisplay: 6.2, minScore: 80, brand: '모든 브랜드' } },
                { tag: '대용량 배터리', filters: { minBattery: 5000, brand: '모든 브랜드' } },
                { tag: '가벼운 무게', filters: { maxWeight: 195, brand: '모든 브랜드' } },
                { tag: '가성비 5G', filters: { maxPrice: 700, minScore: 60, brand: '모든 브랜드' } }
              ].map(({ tag, filters }) => (
                <button 
                  key={tag} 
                  type="button" 
                  onClick={() => onSearch(filters)}
                  className="px-4 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-bold hover:bg-primary hover:text-white transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

const ResultsPage = ({ 
  devices, 
  onSelectDevice, 
  onAddToCompare,
  onToggleFavorite,
  compareIds,
  favoriteIds,
  formatPrice
}: { 
  devices: Device[], 
  onSelectDevice: (d: Device) => void,
  onAddToCompare: (id: string) => void,
  onToggleFavorite: (id: string) => void,
  compareIds: string[],
  favoriteIds: string[],
  formatPrice: (p: number) => string
}) => (
  <motion.section 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-8"
  >
      <div className="lg:col-span-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-on-surface mb-2 font-manrope">검색 결과 ({devices.length})</h1>
            <p className="text-on-surface-variant">설정한 조건에 맞는 고성능 기기들을 찾았습니다.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'search' }))}
              className="bg-surface-container-high text-on-surface-variant px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-surface-container-highest transition-all"
            >
              <Search className="w-4 h-4" /> 다시 검색
            </button>
            {compareIds.length > 0 && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'compare' }))}
                className="bg-primary-container text-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:brightness-95 transition-all"
              >
                <ArrowLeftRight className="w-4 h-4" /> {compareIds.length}개 기기 비교하기
              </button>
            )}
          </div>
        </div>

        {devices.length === 0 ? (
          <div className="bg-surface-container rounded-[32px] p-20 text-center border-2 border-dashed border-outline-variant/30">
            <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-on-surface-variant/40" />
            </div>
            <h3 className="text-2xl font-bold text-on-surface mb-2">검색 결과가 없습니다</h3>
            <p className="text-on-surface-variant/70 mb-8 max-w-sm mx-auto">
              조건을 조금 더 완만하게 설정하거나 제조사를 '모든 브랜드'로 설정하여 다시 시도해보세요.
            </p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'search' }))}
              className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all"
            >
              필터 다시 설정하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device) => (
              <motion.div 
                key={device.id}
                whileHover={{ y: -4 }}
                className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xl shadow-on-surface/5 overflow-hidden group cursor-pointer flex flex-col"
                onClick={() => onSelectDevice(device)}
              >
                <div className="bg-surface-container flex items-center justify-center relative p-10">
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    <button 
                      className={`p-2 bg-surface/80 dark:bg-surface/90 backdrop-blur-sm rounded-full shadow-sm transition-colors ${compareIds.includes(device.id) ? 'text-primary' : 'text-on-surface-variant/60 hover:text-primary'}`}
                      onClick={(e) => { e.stopPropagation(); onAddToCompare(device.id); }}
                    >
                      <ArrowLeftRight className={`w-5 h-5 ${compareIds.includes(device.id) ? 'fill-primary' : ''}`} />
                    </button>
                    <button 
                      className={`p-2 bg-surface/80 dark:bg-surface/90 backdrop-blur-sm rounded-full shadow-sm transition-colors ${favoriteIds.includes(device.id) ? 'text-red-500' : 'text-on-surface-variant/60 hover:text-red-500'}`}
                      onClick={(e) => { e.stopPropagation(); onToggleFavorite(device.id); }}
                    >
                      <Heart className={`w-5 h-5 ${favoriteIds.includes(device.id) ? 'fill-red-500' : ''}`} />
                    </button>
                  </div>
                  <img 
                    src={device.imageUrl} 
                    alt={device.name} 
                    className="h-40 w-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://img.icons8.com/clouds/100/000000/touchscreen-smartphone.png';
                    }}
                  />
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-on-surface font-manrope">{device.name}</h2>
                    <span className="text-primary font-bold text-lg font-mono tracking-tighter">{formatPrice(device.price)}</span>
                  </div>
                  <ul className="space-y-3 flex-1">
                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <Battery className="w-4 h-4 text-primary opacity-60" /> {device.battery}mAh 배터리
                    </li>
                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <Maximize className="w-4 h-4 text-primary opacity-60" /> {device.display}
                    </li>
                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                      <Cpu className="w-4 h-4 text-primary opacity-60" /> {device.chipset}
                    </li>
                  </ul>
                  <button className="w-full py-4 bg-primary-container text-on-primary-container rounded-xl font-bold hover:brightness-95 transition-all flex items-center justify-center gap-2">
                    상세 보기 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
  </motion.section>
);

const ComparisonPage = ({ 
  compareIds, 
  onRemove, 
  onClear,
  onNavigate,
  allDevices,
  formatPrice
}: { 
  compareIds: string[], 
  onRemove: (id: string) => void, 
  onClear: () => void,
  onNavigate: (p: Page) => void,
  allDevices: Device[],
  formatPrice: (p: number) => string
}) => {
  const devices = useMemo(() => allDevices.filter(d => compareIds.includes(d.id)), [compareIds, allDevices]);

  // Comparison Logic - Determine winner for each category
  const winners = useMemo(() => {
    if (devices.length < 2) return {};
    const categories: { [key: string]: 'max' | 'min' } = {
      price: 'min',
      displaySize: 'max',
      battery: 'max',
      weight: 'min',
      score: 'max',
      'geekbench.single': 'max',
      'geekbench.multi': 'max'
    };

    const result: { [key: string]: string[] } = {};
    Object.entries(categories).forEach(([key, type]) => {
      const getVal = (d: Device) => {
        if (key.includes('.')) {
          const [p1, p2] = key.split('.');
          return (d as any)[p1]?.[p2] || 0;
        }
        return (d as any)[key] || 0;
      };

      const values = devices.map(getVal);
      const targetVal = type === 'max' ? Math.max(...values) : Math.min(...values);
      result[key] = devices.filter(d => getVal(d) === targetVal).map(d => d.id);
    });
    return result;
  }, [devices]);

  if (devices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
        <ArrowLeftRight className="w-16 h-16 text-gray-200 mb-6" />
        <h2 className="text-2xl font-manrope font-bold text-on-surface mb-2">비교할 기기가 없습니다</h2>
        <button 
          onClick={() => onNavigate('search')}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-primary/20"
        >
          기기 검색하러 가기
        </button>
      </div>
    );
  }

  const otherDevices = allDevices.filter(d => !compareIds.includes(d.id));

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2 block">비교 엔진</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-on-surface font-manrope">기기 스펙 비교</h2>
            <p className="text-body-lg text-on-surface-variant mt-2 max-w-xl">
              선택하신 기기들 중 어떤 것이 사용자님께 더 적합한지 데이터를 통해 확인하세요.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate('search')}
              className="bg-primary/10 text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <PlusCircle className="w-5 h-5" /> 기기 추가
            </button>
            <button 
              onClick={onClear}
              className="text-gray-400 px-4 py-3 rounded-xl font-bold hover:text-red-500 transition-all flex items-center gap-2"
            >
              <X className="w-5 h-5" /> 전체 비우기
            </button>
          </div>
        </div>

        {otherDevices.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> 비교에 추가할 기기
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {otherDevices.slice(0, 8).map(d => (
                <button 
                  key={d.id}
                  onClick={() => {
                    if (compareIds.length < 4) {
                      window.dispatchEvent(new CustomEvent('addToCompare', { detail: d.id }));
                    }
                  }}
                  className="flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-3 flex items-center gap-3 hover:border-primary transition-all shadow-sm group"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-lg p-1 flex items-center justify-center">
                    <img src={d.imageUrl} className="max-h-full max-w-full object-contain" alt={d.name}/>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-300 uppercase leading-none mb-1">{d.brand}</p>
                    <p className="text-xs font-bold text-on-surface leading-tight">{d.name}</p>
                  </div>
                  <PlusCircle className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px]">
             {/* Header Row */}
            <div className="grid grid-cols-10 gap-4 mb-10 items-end">
              <div className="col-span-2 pb-6">
                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-center">비교 대상 ({devices.length})</p>
                </div>
              </div>
              {devices.map((d) => (
                <div key={d.id} className="col-span-2 relative group px-2">
                   <button 
                    onClick={() => onRemove(d.id)}
                    className="absolute -top-3 -right-1 w-7 h-7 bg-white text-gray-400 rounded-full flex items-center justify-center hover:text-red-500 transition-all z-10 shadow-lg border border-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col items-center gap-4 bg-white/50 p-4 rounded-[32px] border border-transparent hover:border-primary/20 hover:bg-white transition-all">
                    <div className="aspect-square w-full bg-gray-50/50 rounded-2xl p-4 flex items-center justify-center">
                      <img src={d.imageUrl} className="max-h-full max-w-full object-contain drop-shadow-md" alt={d.name}/>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-primary uppercase mb-1">{d.brand}</p>
                      <p className="text-sm font-bold text-on-surface leading-tight line-clamp-2 h-10">{d.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec Rows */}
            <div className="space-y-4">
              {[
                 { label: '출시가', key: 'price', format: (v: any) => formatPrice(v), winnerKey: 'price' },
                 { label: '성능 점수', key: 'score', format: (v: any) => `${v}%`, winnerKey: 'score' },
                 { label: 'Geekbench S', key: 'geekbench.single', format: (v: any) => v?.toLocaleString(), winnerKey: 'geekbench.single' },
                 { label: 'Geekbench M', key: 'geekbench.multi', format: (v: any) => v?.toLocaleString(), winnerKey: 'geekbench.multi' },
                 { label: '화면 크기', key: 'displaySize', unit: 'in', winnerKey: 'displaySize' },
                 { label: '배터리', key: 'battery', unit: 'mAh', winnerKey: 'battery' },
                 { label: '기기 무게', key: 'weight', unit: 'g', winnerKey: 'weight' },
              ].map(spec => (
                <div key={spec.label} className="grid grid-cols-10 gap-4 py-4 px-2 items-center group/row border-b border-gray-50/50 hover:bg-gray-50/50 rounded-xl transition-all">
                  <div className="col-span-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover/row:text-primary transition-colors">{spec.label}</span>
                  </div>
                  {devices.map(d => {
                    const rowKey = spec.key;
                    const getVal = (dev: Device) => {
                      if (rowKey.includes('.')) {
                        const [p1, p2] = rowKey.split('.');
                        return (dev as any)[p1]?.[p2] || 0;
                      }
                      return (dev as any)[rowKey] || 0;
                    };
                    const val = getVal(d);
                    const winnerLookup = spec.winnerKey || rowKey;
                    const isWinner = winners[winnerLookup]?.includes(d.id);
                    
                    return (
                      <div key={d.id} className="col-span-2 px-2">
                        <div className={`p-4 rounded-2xl flex flex-col items-center justify-center transition-all ${isWinner ? 'bg-primary/5 border border-primary/20 scale-[1.02] shadow-sm' : 'opacity-60'}`}>
                          <span className={`text-sm font-manrope font-black ${isWinner ? 'text-primary' : 'text-on-surface'}`}>
                            {spec.format ? spec.format(val) : (spec.unit ? `${val}${spec.unit}` : val.toLocaleString())}
                          </span>
                          {isWinner && (
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3 h-3 text-primary" />
                              <span className="text-[10px] font-bold text-primary uppercase">Best</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              
              <div className="grid grid-cols-10 gap-4 py-8 px-2 items-start group/row">
                <div className="col-span-2 pt-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">프로세서</span>
                </div>
                {devices.map(d => (
                  <div key={d.id} className="col-span-2 px-2 text-center">
                    <div className="bg-surface p-4 rounded-2xl border border-gray-100 h-full">
                      <p className="text-sm font-bold text-on-surface mb-2 leading-tight">{d.chipset}</p>
                      <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${d.score}%` }} />
                      </div>
                      <p className="text-[9px] font-extrabold text-primary uppercase mt-2">종합 점수 {d.score}%</p>
                    </div>
                  </div>
                ))}
              </div>

               <div className="grid grid-cols-10 gap-4 py-8 px-2 items-start group/row border-t border-gray-100 pt-10">
                <div className="col-span-2 pt-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">운영체제</span>
                </div>
                {devices.map(d => (
                  <div key={d.id} className="col-span-2 px-2 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <span className={`px-4 py-2 rounded-full text-xs font-bold ${d.os.toLowerCase() === 'ios' ? 'bg-black text-white' : 'bg-green-500 text-white'}`}>
                        {d.os}
                      </span>
                      <p className="text-[10px] text-gray-400 font-medium">최신 버전 지원</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const ChatPage = () => {
  const [input, setInput] = useState('');
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col max-w-4xl mx-auto w-full pb-32"
    >
      <div className="flex-1 py-8 space-y-10">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Assistant</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl rounded-tl-none max-w-[85%] border border-gray-100 shadow-xl shadow-gray-200/20">
            <p className="text-on-surface leading-relaxed">
              어떤 스마트폰을 찾으시나요? 원하시는 스펙이나 가격대를 말씀해 주시면 딱 맞는 제품을 추천해 드릴게요.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">나</span>
          <div className="bg-primary text-white px-6 py-4 rounded-3xl rounded-tr-none max-w-[85%] shadow-xl shadow-primary/10">
            <p className="font-medium">6인치 이상에 배터리가 오래가는 가성비 좋은 폰 추천해줘</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Assistant</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl rounded-tl-none w-full border border-gray-100 shadow-xl shadow-gray-200/20 space-y-6">
            <p className="text-on-surface leading-relaxed">말씀하신 조건에 맞는 최고의 가성비 모델 3가지를 찾았습니다. 대화면 디스플레이와 5,000mAh 이상의 대용량 배터리를 탑재한 제품들입니다:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CHAT_SUGGESTIONS.map(device => (
                <div key={device.id} className="bg-surface-container-low rounded-2xl border border-outline-variant p-4 hover:border-primary cursor-pointer transition-all flex flex-col group">
                  <div className="aspect-square bg-white rounded-xl mb-4 flex items-center justify-center overflow-hidden p-2">
                    <img src={device.imageUrl} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" alt={device.name}/>
                  </div>
                  <h2 className="font-bold text-sm mb-2">{device.name}</h2>
                  <div className="space-y-1 mb-4 flex-1">
                    <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                      <Maximize className="w-2.5 h-2.5" /> {device.display}
                    </p>
                    <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                      <Battery className="w-2.5 h-2.5" /> {device.battery}mAh
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-primary">₩{device.price.toLocaleString()}</span>
                    <ArrowLeftRight className="w-3.5 h-3.5 text-primary opacity-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[88px] left-0 w-full px-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-white/80 backdrop-blur-xl p-3 rounded-[28px] border border-gray-100 shadow-2xl shadow-gray-200/40">
          <input 
            type="text" 
            placeholder="예: 100만원 이하 게임용 폰 추천해줘" 
            className="flex-1 bg-transparent px-4 py-2 outline-none font-medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProfilePage = ({ 
  favoriteIds, 
  allDevices,
  onNavigate,
  onToggleFavorite,
  userName,
  userEmail,
  currency,
  onSaveProfile,
  formatPrice
}: { 
  favoriteIds: string[], 
  allDevices: Device[],
  onNavigate: (p: Page) => void,
  onToggleFavorite: (id: string) => void,
  userName: string,
  userEmail: string,
  currency: 'USD' | 'KRW',
  onSaveProfile: (name: string, email: string, currency: 'USD' | 'KRW') => void,
  formatPrice: (p: number) => string
}) => {
  const [localName, setLocalName] = useState(userName);
  const [localEmail, setLocalEmail] = useState(userEmail);
  const [localCurrency, setLocalCurrency] = useState<'USD' | 'KRW'>(currency);
  const favoriteDevices = useMemo(() => allDevices.filter(d => favoriteIds.includes(d.id)), [favoriteIds, allDevices]);

  return (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto w-full space-y-10"
  >
    <header>
      <h2 className="text-4xl font-bold text-on-surface mb-2 font-manrope">프로필 설정</h2>
      <p className="text-on-surface-variant">계정 정보 및 개인화 설정을 관리하세요.</p>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/30">
          <h3 className="text-xs font-bold text-primary mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
            <User className="w-4 h-4" /> 사용자 정보
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-2">사용자 이름</label>
              <input 
                type="text"
                value={localName} 
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="이름 입력"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-bold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-2">이메일</label>
              <input 
                type="email"
                value={localEmail} 
                onChange={(e) => setLocalEmail(e.target.value)}
                placeholder="이메일 입력"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary outline-none font-medium" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/30">
          <h3 className="text-xs font-bold text-primary mb-6 flex items-center gap-3 uppercase tracking-[0.2em]">
            <Star className="w-4 h-4" /> 환경 설정
          </h3>
          <div className="space-y-6">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block ml-2">표시 통화 단위</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setLocalCurrency('KRW')}
                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 transition-all ${localCurrency === 'KRW' ? 'border-primary bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'border-gray-100 bg-white text-gray-500 font-bold hover:border-primary/40'}`}
              >
                KRW {localCurrency === 'KRW' && <Check className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setLocalCurrency('USD')}
                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl border-2 transition-all ${localCurrency === 'USD' ? 'border-primary bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'border-gray-100 bg-white text-gray-500 font-bold hover:border-primary/40'}`}
              >
                USD {localCurrency === 'USD' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={() => onSaveProfile(localName, localEmail, localCurrency)}
          className="w-full bg-primary text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          설정 저장하기
        </button>
      </div>

      <div className="lg:col-span-7">
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-200/30 h-full">
          <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
            <h3 className="text-xs font-bold text-primary flex items-center gap-3 uppercase tracking-[0.2em]">
              <Heart className="w-4 h-4 fill-primary" /> 나의 즐겨찾기 ({favoriteDevices.length})
            </h3>
            {favoriteDevices.length > 0 && <button onClick={() => onNavigate('search')} className="text-primary font-bold text-xs hover:underline">기기 추가하기</button>}
          </div>
          
          {favoriteDevices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="w-12 h-12 text-gray-100 mb-4" />
              <p className="text-sm font-bold text-gray-300">즐겨찾기한 기기가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {favoriteDevices.map(device => (
                <div key={device.id} className="group border border-gray-100 rounded-3xl overflow-hidden hover:border-primary transition-all p-4 space-y-4 bg-gray-50/30">
                  <div className="aspect-square bg-white rounded-2xl relative p-6 flex items-center justify-center shadow-sm">
                    <img src={device.imageUrl} className="object-contain w-full h-full group-hover:scale-105 transition-transform drop-shadow-sm" alt={device.name}/>
                    <button 
                      onClick={() => onToggleFavorite(device.id)}
                      className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur rounded-full text-red-500 shadow-md hover:scale-110 active:scale-95 transition-all"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-manrope font-bold text-lg mb-1 leading-tight">{device.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">{device.brand}</p>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-primary">{formatPrice(device.price)}</p>
                      </div>
                      <button 
                        onClick={() => window.dispatchEvent(new CustomEvent('openDevice', { detail: device }))}
                        className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline"
                      >
                        상세보기 <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
  );
};

// --- Component Details Modal ---

const DeviceDetailsModal = ({ 
  device, 
  onClose,
  onAddToCompare,
  onToggleFavorite,
  compareIds,
  favoriteIds,
  formatPrice
}: { 
  device: Device, 
  onClose: () => void,
  onAddToCompare: (id: string) => void,
  onToggleFavorite: (id: string) => void,
  compareIds: string[],
  favoriteIds: string[],
  formatPrice: (p: number) => string
}) => (
  <AnimatePresence>
    {device && (
      <div className="fixed inset-0 z-[100] flex items-end justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
        />
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-2xl bg-surface-container-lowest rounded-t-[40px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-colors duration-300"
        >
          <div className="flex justify-center p-4 border-b border-outline-variant/20 flex-shrink-0 relative">
            <div className="w-12 h-1.5 bg-on-surface-variant/20 rounded-full" />
            <div className="absolute right-6 top-3 flex gap-2">
               <button 
                onClick={() => onToggleFavorite(device.id)}
                className={`p-2 rounded-full transition-all ${favoriteIds.includes(device.id) ? 'bg-red-500/10 text-red-500' : 'hover:bg-surface-container-high text-on-surface-variant/60'}`}
              >
                <Heart className={`w-6 h-6 ${favoriteIds.includes(device.id) ? 'fill-red-500' : ''}`} />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-surface-container-high rounded-full text-on-surface-variant/60">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto p-8 md:p-10 hide-scrollbar flex-1 pb-10">
            <div className="flex flex-col md:flex-row gap-10 items-start mb-10">
              <div className="w-full md:w-1/2 aspect-square bg-surface-container rounded-[32px] p-6 lg:p-10 flex items-center justify-center shadow-inner border border-outline-variant/20">
                <img src={device.imageUrl} className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-700" alt={device.name}/>
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="bg-primary text-on-primary text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em]">{device.brand}</span>
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'fill-yellow-400' : ''}`} />)}
                  </div>
                </div>
                <h1 className="text-4xl font-manrope font-extrabold text-on-surface leading-tight tracking-tight">{device.name}</h1>
                <p className="text-on-surface-variant font-medium leading-relaxed opacity-80">{device.description}</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-primary font-mono tracking-tighter">{formatPrice(device.price)}</span>
                  <span className="text-on-surface-variant/40 line-through text-sm font-bold font-mono tracking-tighter">{formatPrice(device.price + 100)}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => { onAddToCompare(device.id); }}
                    className={`w-full h-14 rounded-2xl font-bold transition-all border-2 flex items-center justify-center gap-3 ${compareIds.includes(device.id) ? 'bg-primary text-on-primary border-primary shadow-xl shadow-primary/20' : 'border-primary text-primary hover:bg-primary/5'}`}
                  >
                    <ArrowLeftRight className="w-5 h-5" /> 
                    {compareIds.includes(device.id) ? '비교 목록에서 제거' : '이 기기와 비교하기'}
                  </button>
                  {compareIds.length >= 2 && (
                    <button 
                      onClick={() => { onClose(); window.dispatchEvent(new CustomEvent('navigate', { detail: 'compare' })); }}
                      className="w-full h-14 bg-on-surface text-surface rounded-2xl font-bold hover:brightness-110 transition-all flex items-center justify-center gap-3"
                    >
                      지금 바로 비교 결과 확인 <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="font-manrope font-extrabold text-2xl text-on-surface border-b border-outline-variant/30 pb-3">기술 사양</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                  {[
                    { label: '제조사', value: device.brand },
                    { label: '운영체제', value: device.brand.toLowerCase().includes('apple') ? 'iOS' : 'Android' },
                    { label: '출시년도', value: `${device.year}년` },
                    { label: '출시가', value: formatPrice(device.price) },
                    { label: '화면 크기', value: device.display },
                    { label: '배터리 용량', value: `${device.battery} mAh` },
                    { label: '기기 무게', value: `${device.weight} g` },
                    { label: '주사율', value: '1-120 Hz' },
                    { label: '칩셋', value: device.chipset }
                  ].map(spec => (
                    <div key={spec.label} className="flex justify-between items-center py-3 border-b border-outline-variant/10 last:border-0 md:last:border-b">
                      <span className="text-on-surface-variant/60 font-medium text-sm">{spec.label}</span>
                      <span className="font-bold text-on-surface text-sm">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-manrope font-extrabold text-2xl text-on-surface border-b border-gray-100 pb-3">Geekbench 6 성능 지표</h3>
                <div className="space-y-6 pt-4">
                  {device.geekbench ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/5 p-6 rounded-[24px] border border-primary/10 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all opacity-50" />
                        <div className="text-[11px] font-bold text-primary uppercase tracking-tighter mb-2 opacity-70">Single-Core Score</div>
                        <div className="text-4xl font-black text-primary font-manrope">
                          {device.geekbench.single.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-primary p-6 rounded-[24px] border border-primary relative overflow-hidden group shadow-xl shadow-primary/20">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all opacity-30" />
                        <div className="text-[11px] font-bold text-white/70 uppercase tracking-tighter mb-2">Multi-Core Score</div>
                        <div className="text-4xl font-black text-white font-manrope">
                          {device.geekbench.multi.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-[24px] text-center border border-dashed border-gray-200">
                      <span className="text-gray-400 font-medium">실시간 성능 데이터를 분석 중입니다...</span>
                    </div>
                  )}
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                    <p className="text-[11px] text-gray-400 leading-relaxed font-semibold italic text-center">
                      "Geekbench 6 점수는 프로세서의 연산 속도를 정밀하게 측정한 결과입니다. 싱글코어는 일상적인 앱 사용, 멀티코어는 고사양 작업 및 멀티태스킹 성능을 나타냅니다."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('search');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Device[]>([]);
  const [allKnownDevices, setAllKnownDevices] = useState<Device[]>(MOCK_DEVICES);
  const [isSearching, setIsSearching] = useState(false);
  
  const [userName, setUserName] = useState('김테크');
  const [userEmail, setUserEmail] = useState('tech.kim@example.com');
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('KRW');
  
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [hasNewNews, setHasNewNews] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showGame, setShowGame] = useState(false);

  // 테마 자동 감지 및 적용
  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    applyTheme(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // 로고 클릭 핸들러 (이스터에그)
  const handleLogoClick = () => {
    setLogoClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setShowGame(true);
        return 0;
      }
      // 3초 후 카운트 초기화
      setTimeout(() => setLogoClickCount(0), 3000);
      return next;
    });
    if (currentPage !== 'search') setCurrentPage('search');
  };

  useEffect(() => {
    const savedFavs = localStorage.getItem('favorites');
    if (savedFavs) {
      setFavoriteIds(JSON.parse(savedFavs));
    }

    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      if (parsed.userName) setUserName(parsed.userName);
      if (parsed.userEmail) setUserEmail(parsed.userEmail);
      if (parsed.currency) setCurrency(parsed.currency);
    }

    const handleNavigate = (e: any) => setCurrentPage(e.detail);
    const handleOpenDevice = (e: any) => setSelectedDevice(e.detail);
    const handleAddComparison = (e: any) => handleAddToCompare(e.detail);
    
    window.addEventListener('navigate', handleNavigate);
    window.addEventListener('openDevice', handleOpenDevice);
    window.addEventListener('addToCompare', handleAddComparison);
    
    return () => {
      window.removeEventListener('navigate', handleNavigate);
      window.removeEventListener('openDevice', handleOpenDevice);
      window.removeEventListener('addToCompare', handleAddComparison);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const handleSaveProfile = (name: string, email: string, curr: 'USD' | 'KRW') => {
    setUserName(name);
    setUserEmail(email);
    setCurrency(curr);
    localStorage.setItem('profile', JSON.stringify({ userName: name, userEmail: email, currency: curr }));
  };

  const formatPrice = (priceInUsd: number) => {
    if (currency === 'KRW') {
      const krwPrice = priceInUsd * 1450; 
      const rounded = Math.round(krwPrice / 10000) * 10000;
      return `${rounded.toLocaleString()}원`;
    }
    return `$${priceInUsd.toLocaleString()}`;
  };

  const handleSearch = async (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setIsSearching(true);
    setCurrentPage('results');
    
    try {
      const results = await searchDevices(newFilters);
      setSearchResults(results);
      // Keep track of all devices seen for Profile/Compare pages
      setAllKnownDevices(prev => {
        const newOnes = results.filter(r => !prev.find(p => p.id === r.id));
        return [...prev, ...newOnes];
      });
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) return prev; 
      return [...prev, id];
    });
  };

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const loadNews = async () => {
      setLoadingNews(true);
      const data = await fetchSmartphoneNews();
      // 상세 페이지 URL이 유효한지(도메인 외에 경로가 포함되어 있는지) 확인하여 필터링
      const filteredData = data.filter(item => {
        try {
          const url = new URL(item.url);
          // '/' 경로만 있는 메인 페이지는 제외 (예: https://naver.com/)
          return url.pathname.length > 1;
        } catch (e) {
          return false;
        }
      });
      setNews(filteredData);
      setLoadingNews(false);
      if (filteredData.length > 0) setHasNewNews(true);
    };
    loadNews();
  }, []);

  const handleToggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (!isNotificationsOpen) setHasNewNews(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'results': return (
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-3xl rounded-[32px] py-20"
              >
                <div className="relative mb-10">
                  <motion.div 
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.2, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 -m-16 bg-primary/30 rounded-full blur-3xl"
                  />
                  <div className="relative w-32 h-32 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-primary/40 overflow-hidden">
                    <Smartphone className="w-16 h-16 text-white" />
                    <motion.div 
                      animate={{ y: [-80, 80] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-1 bg-white/60 blur-[1px] shadow-[0_0_20px_white]"
                    />
                  </div>
                </div>
                <div className="text-center space-y-5 px-6">
                  <motion.h3 
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl font-bold text-on-surface font-manrope tracking-tight"
                  >
                    최적의 기기 선별 중
                  </motion.h3>
                  <div className="flex items-center gap-2 justify-center">
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2.5 h-2.5 bg-primary rounded-full" />
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-2.5 h-2.5 bg-primary/60 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-2.5 h-2.5 bg-primary/30 rounded-full" />
                  </div>
                  <p className="text-on-surface-variant text-base max-w-[340px] mx-auto leading-relaxed font-medium">
                    사용자의 정밀한 검색 조건에 부합하는<br />
                    전 세계 실시간 기기 데이터를 분석합니다.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <ResultsPage 
                  devices={searchResults} 
                  onSelectDevice={setSelectedDevice} 
                  onAddToCompare={handleAddToCompare}
                  onToggleFavorite={handleToggleFavorite}
                  compareIds={compareIds}
                  favoriteIds={favoriteIds}
                  formatPrice={formatPrice}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
      case 'compare': return (
        <ComparisonPage 
          compareIds={compareIds} 
          onRemove={(id) => setCompareIds(prev => prev.filter(i => i !== id))}
          onClear={() => setCompareIds([])}
          onNavigate={setCurrentPage}
          allDevices={allKnownDevices}
          formatPrice={formatPrice}
        />
      );
      case 'chat': return <ChatPage />;
      case 'profile': return (
        <ProfilePage 
          favoriteIds={favoriteIds}
          allDevices={allKnownDevices}
          onNavigate={setCurrentPage}
          onToggleFavorite={handleToggleFavorite}
          userName={userName}
          userEmail={userEmail}
          currency={currency}
          onSaveProfile={handleSaveProfile}
          formatPrice={formatPrice}
        />
      );
      default: return <SearchPage onSearch={handleSearch} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <TopAppBar 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        onToggleNotifications={handleToggleNotifications}
        unreadCount={hasNewNews ? news.length : 0}
        onLogoClick={handleLogoClick}
      />

      <AnimatePresence>
        {showGame && <TechCatchGame onClose={() => setShowGame(false)} />}
      </AnimatePresence>
      
      <NotificationPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
        news={news}
        loading={loadingNews}
      />

      <main className="flex-1 pt-24 pb-32 px-6 lg:px-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNavBar onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <DeviceDetailsModal 
        device={selectedDevice!} 
        onClose={() => setSelectedDevice(null)}
        onAddToCompare={handleAddToCompare}
        onToggleFavorite={handleToggleFavorite}
        compareIds={compareIds}
        favoriteIds={favoriteIds}
        formatPrice={formatPrice}
      />

      {/* Spacing for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
