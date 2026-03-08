import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import MoodSelector from "@/components/MoodSelector";
import QuoteCard, { type TemplateStyle } from "@/components/QuoteCard";
import { type MoodKey, getQuoteForMoodAndSeed, generateSeed, moods } from "@/data/quotes";
import { Heart, Download, RefreshCw, Share2, BookmarkPlus, Bookmark, Sparkles } from "lucide-react";

interface SavedQuote {
  quote: string;
  mood: MoodKey;
  name: string;
  date: string;
}

const templates: { key: TemplateStyle; label: string }[] = [
  { key: 'classic', label: '經典' },
  { key: 'modern', label: '現代' },
  { key: 'minimal', label: '極簡' },
  { key: 'ink', label: '水墨' },
  { key: 'starry', label: '星空' },
  { key: 'floral', label: '花卉' },
];

const Index = () => {
  const [step, setStep] = useState<'mood' | 'name' | 'revealing' | 'result'>('mood');
  const [mood, setMood] = useState<MoodKey | undefined>();
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [template, setTemplate] = useState<TemplateStyle>('classic');
  const [drawCount, setDrawCount] = useState(0);
  const [flipKey, setFlipKey] = useState(0);
  const [favorites, setFavorites] = useState<SavedQuote[]>(() => {
    try { return JSON.parse(localStorage.getItem('quote-favorites') || '[]'); } catch { return []; }
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const storyCardRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

  useEffect(() => {
    localStorage.setItem('quote-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const generateQuote = useCallback((m: MoodKey, n: string, extra: number = 0) => {
    const seed = generateSeed(m, n, today, extra);
    return getQuoteForMoodAndSeed(m, seed);
  }, [today]);

  const handleMoodSelect = (m: MoodKey) => {
    setMood(m);
    setStep('name');
  };

  const handleGenerate = () => {
    if (!mood) return;
    const q = generateQuote(mood, name, drawCount);
    setQuote(q);
    // Show revealing ceremony first
    setStep('revealing');
    setTimeout(() => {
      setFlipKey(prev => prev + 1);
      setStep('result');
    }, 1800);
  };

  const handleDrawAnother = () => {
    if (!mood) return;
    const newCount = drawCount + 1;
    setDrawCount(newCount);
    // Brief flip-out then flip-in
    setFlipKey(prev => prev + 1);
    setTimeout(() => {
      const q = generateQuote(mood, name, newCount);
      setQuote(q);
      setFlipKey(prev => prev + 1);
    }, 400);
  };

  const handleDownload = async (storyMode: boolean = false) => {
    const ref = storyMode ? storyCardRef : cardRef;
    if (!ref.current) return;
    try {
      const dataUrl = await toPng(ref.current, { pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `人生金句-${today}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], '人生金句.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({
          title: '我的專屬人生金句',
          text: '這是我今天的專屬金句 🌟 你也來抽一句！',
          files: [file],
        });
      }
    } catch (e) {
      console.error('Share failed', e);
    }
  };

  const isFavorited = favorites.some(f => f.quote === quote && f.mood === mood);

  const toggleFavorite = () => {
    if (!mood) return;
    if (isFavorited) {
      setFavorites(prev => prev.filter(f => !(f.quote === quote && f.mood === mood)));
    } else {
      setFavorites(prev => [...prev, { quote, mood, name, date: today }]);
    }
  };

  const handleReset = () => {
    setStep('mood');
    setMood(undefined);
    setName('');
    setQuote('');
    setDrawCount(0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <header className="text-center mb-5 sm:mb-8 animate-fade-in">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-1.5 sm:mb-2">📖 你的專屬人生金句</h1>
        <p className="text-muted-foreground font-serif-tc text-sm sm:text-base">選擇心情，收穫一句專屬於你的智慧</p>
      </header>

      {/* Favorites toggle */}
      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className="mb-4 sm:mb-6 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors font-serif-tc active:scale-95"
      >
        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        我的收藏 ({favorites.length})
      </button>

      {showFavorites && favorites.length > 0 && (
        <div className="w-full max-w-sm sm:max-w-md mb-6 sm:mb-8 space-y-2.5 sm:space-y-3 animate-fade-in px-1">
          {favorites.map((f, i) => {
            const moodInfo = moods.find(m => m.key === f.mood)!;
            return (
              <div key={i} className="bg-card border border-border rounded-xl p-3 sm:p-4 flex items-start gap-2.5 sm:gap-3 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="text-xl sm:text-2xl">{moodInfo.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-xs sm:text-sm leading-relaxed text-foreground">「{f.quote}」</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-serif-tc">{f.date}{f.name ? ` · ${f.name}` : ''}</p>
                </div>
                <button
                  onClick={() => setFavorites(prev => prev.filter((_, j) => j !== i))}
                  className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Step: Mood */}
      {step === 'mood' && (
        <div className="w-full max-w-sm sm:max-w-md">
          <h2 className="text-center font-serif-tc text-base sm:text-lg text-foreground mb-4 sm:mb-6 animate-fade-in">你現在的心情是？</h2>
          <MoodSelector onSelect={handleMoodSelect} selected={mood} />
        </div>
      )}

      {/* Step: Name */}
      {step === 'name' && mood && (
        <div className="w-full max-w-sm sm:max-w-md text-center space-y-5 sm:space-y-6">
          <div className="text-4xl sm:text-5xl animate-bounce-in">{moods.find(m => m.key === mood)?.emoji}</div>
          <h2 className="font-serif-tc text-base sm:text-lg text-foreground animate-fade-in-up" style={{ animationDelay: '150ms' }}>輸入你的名字（選填）</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的名字"
            className="w-full max-w-[240px] sm:max-w-xs mx-auto block bg-card border border-border rounded-xl px-4 py-2.5 sm:py-3 text-center font-serif-tc text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all animate-fade-in-up"
            style={{ animationDelay: '250ms' }}
          />
          <div className="flex gap-3 justify-center animate-fade-in-up" style={{ animationDelay: '350ms' }}>
            <button
              onClick={() => setStep('mood')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all font-serif-tc text-xs sm:text-sm active:scale-95"
            >
              返回
            </button>
            <button
              onClick={handleGenerate}
              className="px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-serif-tc text-xs sm:text-sm shadow-lg active:scale-95 group"
            >
              <span className="flex items-center gap-1.5">
                抽取金句
                <Sparkles className="w-3.5 h-3.5 group-hover:animate-sparkle" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Step: Revealing Ceremony */}
      {step === 'revealing' && mood && (
        <div className="w-full flex flex-col items-center justify-center py-12 sm:py-20 space-y-6">
          <div className="text-5xl sm:text-6xl animate-float">{moods.find(m => m.key === mood)?.emoji}</div>
          <div className="text-center space-y-3">
            <p className="font-display text-xl sm:text-2xl text-foreground animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              正在為{name ? ` ${name} ` : '你'}尋找金句...
            </p>
            <div className="flex justify-center gap-1.5 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary/60 animate-bounce-in"
                  style={{ animationDelay: `${800 + i * 200}ms`, animationDuration: '0.6s' }}
                />
              ))}
            </div>
          </div>
          {/* Decorative sparkles */}
          <div className="relative w-24 h-24">
            {[0, 1, 2, 3].map(i => (
              <Sparkles
                key={i}
                className="absolute text-primary/40 animate-sparkle"
                style={{
                  width: '16px',
                  height: '16px',
                  top: `${[10, 60, 20, 70][i]}%`,
                  left: `${[20, 70, 80, 30][i]}%`,
                  animationDelay: `${i * 0.4}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step: Result */}
      {step === 'result' && mood && (
        <div className="w-full flex flex-col items-center space-y-4 sm:space-y-6">
          {/* Template switcher — horizontally scrollable */}
          <div className="w-full overflow-x-auto scrollbar-hide animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex gap-1.5 sm:gap-2 px-4 sm:px-0 sm:justify-center w-max sm:w-full mx-auto">
              {templates.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTemplate(t.key)}
                  className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-serif-tc transition-all active:scale-95 whitespace-nowrap shrink-0 ${
                    template === t.key
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Card with flip animation */}
          <div className="w-full flex justify-center px-2" key={flipKey} style={{ perspective: '1000px' }}>
            <div className="animate-flip-in">
              <QuoteCard
                ref={cardRef}
                quote={quote}
                mood={mood}
                name={name}
                date={today}
                template={template}
              />
            </div>
          </div>

          {/* Hidden story card for download */}
          <div className="fixed -left-[9999px] top-0">
            <QuoteCard
              ref={storyCardRef}
              quote={quote}
              mood={mood}
              name={name}
              date={today}
              template={template}
              isStoryMode
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <button
              onClick={handleDrawAnother}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all font-serif-tc text-xs sm:text-sm active:scale-95 group"
            >
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-500" /> 再抽一句
            </button>
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all font-serif-tc text-xs sm:text-sm active:scale-95 ${
                isFavorited
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {isFavorited ? <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> : <BookmarkPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              {isFavorited ? '已收藏' : '收藏'}
            </button>
            <button
              onClick={() => handleDownload(false)}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all font-serif-tc text-xs sm:text-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 下載
            </button>
            <button
              onClick={() => handleDownload(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all font-serif-tc text-xs sm:text-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> IG 限動
            </button>
            {typeof navigator.share === 'function' && (
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-serif-tc text-xs sm:text-sm shadow-md active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 分享
              </button>
            )}
          </div>

          <button
            onClick={handleReset}
            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors font-serif-tc mt-2 sm:mt-4 active:scale-95 animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
            重新選擇心情
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
