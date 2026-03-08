import { useState, useRef, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import MoodSelector from "@/components/MoodSelector";
import QuoteCard, { type TemplateStyle } from "@/components/QuoteCard";
import { type MoodKey, getQuoteForMoodAndSeed, generateSeed, moods } from "@/data/quotes";
import { Heart, Download, RefreshCw, Share2, BookmarkPlus, Bookmark } from "lucide-react";

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
];

const Index = () => {
  const [step, setStep] = useState<'mood' | 'name' | 'result'>('mood');
  const [mood, setMood] = useState<MoodKey | undefined>();
  const [name, setName] = useState('');
  const [quote, setQuote] = useState('');
  const [template, setTemplate] = useState<TemplateStyle>('classic');
  const [drawCount, setDrawCount] = useState(0);
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
    setStep('result');
  };

  const handleDrawAnother = () => {
    if (!mood) return;
    const newCount = drawCount + 1;
    setDrawCount(newCount);
    const q = generateQuote(mood, name, newCount);
    setQuote(q);
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
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-8">
      {/* Header */}
      <header className="text-center mb-8 animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-foreground mb-2">📖 你的專屬人生金句</h1>
        <p className="text-muted-foreground font-serif-tc text-base">選擇心情，收穫一句專屬於你的智慧</p>
      </header>

      {/* Favorites toggle */}
      <button
        onClick={() => setShowFavorites(!showFavorites)}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-serif-tc"
      >
        <Heart className="w-4 h-4" />
        我的收藏 ({favorites.length})
      </button>

      {showFavorites && favorites.length > 0 && (
        <div className="w-full max-w-md mb-8 space-y-3 animate-fade-in">
          {favorites.map((f, i) => {
            const moodInfo = moods.find(m => m.key === f.mood)!;
            return (
              <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">{moodInfo.emoji}</span>
                <div className="flex-1">
                  <p className="font-display text-sm leading-relaxed text-foreground">「{f.quote}」</p>
                  <p className="text-xs text-muted-foreground mt-1 font-serif-tc">{f.date}{f.name ? ` · ${f.name}` : ''}</p>
                </div>
                <button
                  onClick={() => setFavorites(prev => prev.filter((_, j) => j !== i))}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Step: Mood */}
      {step === 'mood' && (
        <div className="animate-fade-in w-full max-w-md">
          <h2 className="text-center font-serif-tc text-lg text-foreground mb-6">你現在的心情是？</h2>
          <MoodSelector onSelect={handleMoodSelect} selected={mood} />
        </div>
      )}

      {/* Step: Name */}
      {step === 'name' && mood && (
        <div className="animate-fade-in w-full max-w-md text-center space-y-6">
          <div className="text-5xl mb-2">{moods.find(m => m.key === mood)?.emoji}</div>
          <h2 className="font-serif-tc text-lg text-foreground">輸入你的名字（選填）</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的名字"
            className="w-full max-w-xs mx-auto block bg-card border border-border rounded-xl px-4 py-3 text-center font-serif-tc text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setStep('mood')}
              className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all font-serif-tc text-sm"
            >
              返回
            </button>
            <button
              onClick={handleGenerate}
              className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-serif-tc text-sm shadow-lg"
            >
              抽取金句 ✨
            </button>
          </div>
        </div>
      )}

      {/* Step: Result */}
      {step === 'result' && mood && (
        <div className="animate-scale-in w-full flex flex-col items-center space-y-6">
          {/* Template switcher */}
          <div className="flex gap-2">
            {templates.map(t => (
              <button
                key={t.key}
                onClick={() => setTemplate(t.key)}
                className={`px-4 py-1.5 rounded-full text-sm font-serif-tc transition-all ${
                  template === t.key
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Card */}
          <QuoteCard
            ref={cardRef}
            quote={quote}
            mood={mood}
            name={name}
            date={today}
            template={template}
          />

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
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDrawAnother}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all font-serif-tc text-sm"
            >
              <RefreshCw className="w-4 h-4" /> 再抽一句
            </button>
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-serif-tc text-sm ${
                isFavorited
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {isFavorited ? <Bookmark className="w-4 h-4 fill-current" /> : <BookmarkPlus className="w-4 h-4" />}
              {isFavorited ? '已收藏' : '收藏'}
            </button>
            <button
              onClick={() => handleDownload(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all font-serif-tc text-sm"
            >
              <Download className="w-4 h-4" /> 下載
            </button>
            <button
              onClick={() => handleDownload(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all font-serif-tc text-sm"
            >
              <Download className="w-4 h-4" /> IG 限動
            </button>
            {typeof navigator.share === 'function' && (
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-serif-tc text-sm shadow-md"
              >
                <Share2 className="w-4 h-4" /> 分享
              </button>
            )}
          </div>

          <button
            onClick={handleReset}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors font-serif-tc mt-4"
          >
            重新選擇心情
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
