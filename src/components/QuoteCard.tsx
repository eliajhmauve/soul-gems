import { forwardRef } from "react";
import { moods, type MoodKey } from "@/data/quotes";

export type TemplateStyle = 'classic' | 'modern' | 'minimal' | 'ink' | 'starry' | 'floral';

interface QuoteCardProps {
  quote: string;
  mood: MoodKey;
  name?: string;
  date: string;
  template: TemplateStyle;
  isStoryMode?: boolean;
}

const moodGradients: Record<MoodKey, string> = {
  happy: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  confused: 'linear-gradient(135deg, #c3cfe2 0%, #a8b8d8 50%, #bdc3c7 100%)',
  tired: 'linear-gradient(135deg, #c2b4d6 0%, #a78bbd 50%, #957dad 100%)',
  excited: 'linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)',
  anxious: 'linear-gradient(135deg, #89d4cf 0%, #6cc4c4 50%, #56b4d3 100%)',
  calm: 'linear-gradient(135deg, #96deb1 0%, #7bc99a 50%, #6bb58a 100%)',
};

const moodDarkText: Record<MoodKey, boolean> = {
  happy: true,
  confused: true,
  tired: false,
  excited: false,
  anxious: true,
  calm: true,
};

// Ink wash style — mood-tinted wash backgrounds
const inkMoodColors: Record<MoodKey, { bg: string; wash: string }> = {
  happy: { bg: '#f7f3ea', wash: 'rgba(180, 140, 80, 0.12)' },
  confused: { bg: '#f0f0f0', wash: 'rgba(120, 130, 150, 0.15)' },
  tired: { bg: '#f3f0f5', wash: 'rgba(140, 110, 160, 0.12)' },
  excited: { bg: '#fdf0ea', wash: 'rgba(200, 100, 80, 0.1)' },
  anxious: { bg: '#eaf5f3', wash: 'rgba(80, 150, 140, 0.1)' },
  calm: { bg: '#eef5ea', wash: 'rgba(100, 150, 90, 0.1)' },
};

// Starry night palette per mood
const starryMoodColors: Record<MoodKey, { bg1: string; bg2: string; accent: string }> = {
  happy: { bg1: '#1a1a3e', bg2: '#2d2456', accent: '#ffd700' },
  confused: { bg1: '#1c1c2e', bg2: '#2a2a44', accent: '#8899bb' },
  tired: { bg1: '#1a1528', bg2: '#2d1f42', accent: '#b48edd' },
  excited: { bg1: '#2a1020', bg2: '#3d1838', accent: '#ff6b9d' },
  anxious: { bg1: '#0f1f2a', bg2: '#1a3040', accent: '#56d4cf' },
  calm: { bg1: '#0f2018', bg2: '#1a3528', accent: '#7ee8a8' },
};

// Floral color palette per mood
const floralMoodColors: Record<MoodKey, { bg: string; petal1: string; petal2: string; petal3: string }> = {
  happy: { bg: '#fefbf3', petal1: '#f6d365', petal2: '#fda085', petal3: '#f9c74f' },
  confused: { bg: '#f5f5fa', petal1: '#c3cfe2', petal2: '#b8c6db', petal3: '#a8b8d8' },
  tired: { bg: '#f8f3fa', petal1: '#d4a5d0', petal2: '#c2a0d6', petal3: '#b08bc4' },
  excited: { bg: '#fff5f5', petal1: '#ff9a9e', petal2: '#fecfef', petal3: '#ff6b95' },
  anxious: { bg: '#f0faf8', petal1: '#89d4cf', petal2: '#a8e6cf', petal3: '#6cc4c4' },
  calm: { bg: '#f2faf2', petal1: '#96deb1', petal2: '#b5e8c3', petal3: '#7bc99a' },
};

// SVG ink wash decorations
const InkWashDecoration = ({ wash }: { wash: string }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 500" preserveAspectRatio="none">
    <defs>
      <filter id="ink-blur">
        <feGaussianBlur stdDeviation="20" />
      </filter>
    </defs>
    {/* Mountain silhouette */}
    <path d="M0 420 Q80 340 160 380 Q220 320 280 360 Q340 300 400 350 L400 500 L0 500 Z"
      fill={wash} opacity="0.6" filter="url(#ink-blur)" />
    {/* Top corner wash */}
    <ellipse cx="350" cy="60" rx="120" ry="80" fill={wash} opacity="0.4" filter="url(#ink-blur)" />
    {/* Ink dots */}
    <circle cx="60" cy="80" r="3" fill={wash} opacity="0.5" />
    <circle cx="340" cy="420" r="2" fill={wash} opacity="0.4" />
    <circle cx="50" cy="300" r="4" fill={wash} opacity="0.3" />
    {/* Bamboo-like strokes */}
    <line x1="30" y1="150" x2="35" y2="350" stroke={wash} strokeWidth="2" opacity="0.3" />
    <line x1="38" y1="200" x2="60" y2="190" stroke={wash} strokeWidth="1.5" opacity="0.25" />
    <line x1="36" y1="260" x2="55" y2="250" stroke={wash} strokeWidth="1.5" opacity="0.25" />
  </svg>
);

// SVG star field
const StarField = ({ accent }: { accent: string }) => {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    cx: (i * 67 + 13) % 400,
    cy: (i * 43 + 7) % 500,
    r: (i % 3 === 0) ? 1.5 : (i % 2 === 0 ? 1 : 0.6),
    opacity: 0.3 + (i % 5) * 0.15,
  }));
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 500" preserveAspectRatio="none">
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={i % 4 === 0 ? accent : '#ffffff'} opacity={s.opacity} />
      ))}
      {/* Shooting star */}
      <line x1="300" y1="40" x2="260" y2="80" stroke={accent} strokeWidth="1" opacity="0.5" />
      <circle cx="300" cy="40" r="2" fill={accent} opacity="0.8" />
      {/* Milky way band */}
      <defs><filter id="glow"><feGaussianBlur stdDeviation="8" /></filter></defs>
      <ellipse cx="200" cy="250" rx="300" ry="40" fill="rgba(255,255,255,0.03)" filter="url(#glow)" transform="rotate(-20, 200, 250)" />
    </svg>
  );
};

// SVG floral decorations
const FloralDecoration = ({ petal1, petal2, petal3 }: { petal1: string; petal2: string; petal3: string }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 500" preserveAspectRatio="none">
    <defs>
      <filter id="soft"><feGaussianBlur stdDeviation="2" /></filter>
    </defs>
    {/* Top-right corner flowers */}
    <g transform="translate(340, 50)">
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.5" transform="rotate(0)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.4" transform="rotate(72)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.45" transform="rotate(144)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.4" transform="rotate(216)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.5" transform="rotate(288)" />
      <circle cx="0" cy="0" r="4" fill={petal2} opacity="0.6" />
    </g>
    <g transform="translate(370, 90) scale(0.7)">
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal2} opacity="0.4" transform="rotate(15)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal2} opacity="0.35" transform="rotate(87)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal2} opacity="0.4" transform="rotate(159)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal2} opacity="0.35" transform="rotate(231)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal2} opacity="0.4" transform="rotate(303)" />
      <circle cx="0" cy="0" r="3" fill={petal3} opacity="0.5" />
    </g>
    {/* Bottom-left flowers */}
    <g transform="translate(50, 440)">
      <ellipse cx="0" cy="-14" rx="9" ry="16" fill={petal3} opacity="0.45" transform="rotate(10)" />
      <ellipse cx="0" cy="-14" rx="9" ry="16" fill={petal3} opacity="0.4" transform="rotate(82)" />
      <ellipse cx="0" cy="-14" rx="9" ry="16" fill={petal3} opacity="0.45" transform="rotate(154)" />
      <ellipse cx="0" cy="-14" rx="9" ry="16" fill={petal3} opacity="0.4" transform="rotate(226)" />
      <ellipse cx="0" cy="-14" rx="9" ry="16" fill={petal3} opacity="0.45" transform="rotate(298)" />
      <circle cx="0" cy="0" r="5" fill={petal1} opacity="0.5" />
    </g>
    <g transform="translate(90, 470) scale(0.5)">
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.35" transform="rotate(30)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.3" transform="rotate(102)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.35" transform="rotate(174)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.3" transform="rotate(246)" />
      <ellipse cx="0" cy="-12" rx="8" ry="14" fill={petal1} opacity="0.35" transform="rotate(318)" />
    </g>
    {/* Scattered petals */}
    <ellipse cx="120" cy="60" rx="6" ry="3" fill={petal2} opacity="0.25" transform="rotate(45)" />
    <ellipse cx="300" cy="400" rx="5" ry="2.5" fill={petal1} opacity="0.2" transform="rotate(-30)" />
    <ellipse cx="200" cy="30" rx="4" ry="2" fill={petal3} opacity="0.2" transform="rotate(60)" />
    {/* Leaves */}
    <path d="M30 460 Q50 445 70 460" stroke={petal3} fill="none" strokeWidth="1.5" opacity="0.3" />
    <path d="M360 70 Q375 55 390 72" stroke={petal3} fill="none" strokeWidth="1" opacity="0.25" />
  </svg>
);

// Shared footer component
const CardFooter = ({ name, date, brand, subTextColor }: { name?: string; date: string; brand: string; subTextColor: string }) => (
  <div className="relative z-10 text-center space-y-1">
    {name && (
      <p className="font-handwriting text-base sm:text-lg" style={{ color: subTextColor }}>
        ── 給 {name} 的金句
      </p>
    )}
    <p className="font-serif-tc text-xs sm:text-sm" style={{ color: subTextColor }}>{date}</p>
    <p className="font-serif-tc text-xs mt-2" style={{ color: subTextColor }}>{brand}</p>
  </div>
);

const QuoteCard = forwardRef<HTMLDivElement, QuoteCardProps>(
  ({ quote, mood, name, date, template, isStoryMode }, ref) => {
    const moodInfo = moods.find((m) => m.key === mood)!;
    const isDark = !moodDarkText[mood];
    const textColor = isDark ? '#faf8f5' : '#2c1810';
    const subTextColor = isDark ? 'rgba(250,248,245,0.7)' : 'rgba(44,24,16,0.6)';

    const baseStyle = {
      background: moodGradients[mood],
      color: textColor,
    };

    const aspectClass = isStoryMode
      ? 'aspect-[9/16] w-[360px]'
      : 'aspect-[4/5] w-full max-w-[360px] sm:max-w-[420px]';

    // ── Classic ──
    if (template === 'classic') {
      return (
        <div ref={ref} className={`${aspectClass} rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden`} style={baseStyle}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)'
          }} />
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="text-center px-2">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">{moodInfo.emoji}</div>
              <p className="font-display text-xl sm:text-2xl leading-relaxed tracking-wide">「{quote}」</p>
            </div>
          </div>
          <CardFooter name={name} date={date} brand="🟡 你的專屬人生金句" subTextColor={subTextColor} />
        </div>
      );
    }

    // ── Modern ──
    if (template === 'modern') {
      return (
        <div ref={ref} className={`${aspectClass} rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden`} style={{ ...baseStyle, borderRadius: '2rem' }}>
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.3)', filter: 'blur(40px)', transform: 'translate(20%, -20%)' }} />
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 rounded-full opacity-15" style={{ background: 'rgba(255,255,255,0.3)', filter: 'blur(30px)', transform: 'translate(-20%, 20%)' }} />
          <div className="relative z-10"><span className="text-2xl sm:text-3xl">{moodInfo.emoji}</span></div>
          <div className="relative z-10 flex-1 flex items-center">
            <p className="font-display text-2xl sm:text-3xl leading-loose tracking-wider">{quote}</p>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
              {name && <p className="font-handwriting text-sm sm:text-base" style={{ color: subTextColor }}>致 {name}</p>}
              <p className="font-serif-tc text-xs mt-1" style={{ color: subTextColor }}>{date}</p>
            </div>
            <p className="font-serif-tc text-xs" style={{ color: subTextColor }}>✦ 人生金句</p>
          </div>
        </div>
      );
    }

    // ── Minimal ──
    if (template === 'minimal') {
      return (
        <div ref={ref} className={`${aspectClass} rounded-xl p-6 sm:p-10 flex flex-col justify-center relative border-2`}
          style={{ ...baseStyle, background: isDark ? '#1a1a2e' : '#faf8f5', border: `2px solid ${subTextColor}` }}>
          <div className="text-center space-y-6 sm:space-y-8">
            <span className="text-3xl sm:text-4xl">{moodInfo.emoji}</span>
            <p className="font-display text-xl sm:text-2xl leading-relaxed" style={{ color: isDark ? '#faf8f5' : '#2c1810' }}>「{quote}」</p>
            <div className="space-y-1">
              {name && <p className="font-handwriting text-sm sm:text-base" style={{ color: subTextColor }}>── {name}</p>}
              <p className="font-serif-tc text-xs" style={{ color: subTextColor }}>{date} · 人生金句</p>
            </div>
          </div>
        </div>
      );
    }

    // ── Ink Wash (水墨風) ──
    if (template === 'ink') {
      const ink = inkMoodColors[mood];
      const inkTextColor = '#2c1810';
      const inkSubColor = 'rgba(44,24,16,0.5)';
      return (
        <div ref={ref} className={`${aspectClass} rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden`}
          style={{ background: ink.bg, color: inkTextColor }}>
          <InkWashDecoration wash={ink.wash} />
          {/* Textured overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="font-display text-xl sm:text-2xl leading-[2] tracking-widest" style={{ color: inkTextColor }}>
                「{quote}」
              </p>
            </div>
          </div>
          <div className="relative z-10 text-center space-y-1.5">
            {name && <p className="font-handwriting text-base" style={{ color: inkSubColor }}>── {name}</p>}
            <p className="font-serif-tc text-xs" style={{ color: inkSubColor }}>{date}</p>
            <p className="font-serif-tc text-[10px] mt-1" style={{ color: inkSubColor }}>🖌️ 水墨 · 人生金句</p>
          </div>
        </div>
      );
    }

    // ── Starry Night (星空風) ──
    if (template === 'starry') {
      const star = starryMoodColors[mood];
      return (
        <div ref={ref} className={`${aspectClass} rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden`}
          style={{ background: `linear-gradient(170deg, ${star.bg1} 0%, ${star.bg2} 100%)`, color: '#f0eee6' }}>
          <StarField accent={star.accent} />
          {/* Glow circle */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-10"
            style={{ background: star.accent, filter: 'blur(60px)' }} />
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="text-center px-3">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">{moodInfo.emoji}</div>
              <p className="font-display text-xl sm:text-2xl leading-relaxed tracking-wide" style={{ color: '#f0eee6' }}>
                「{quote}」
              </p>
            </div>
          </div>
          <div className="relative z-10 text-center space-y-1.5">
            {name && <p className="font-handwriting text-base" style={{ color: 'rgba(240,238,230,0.6)' }}>── 給 {name} 的金句</p>}
            <p className="font-serif-tc text-xs" style={{ color: 'rgba(240,238,230,0.5)' }}>{date}</p>
            <p className="font-serif-tc text-[10px] mt-1" style={{ color: 'rgba(240,238,230,0.4)' }}>✦ 星空 · 人生金句</p>
          </div>
        </div>
      );
    }

    // ── Floral (花卉風) ──
    const floral = floralMoodColors[mood];
    return (
      <div ref={ref} className={`${aspectClass} rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden`}
        style={{ background: floral.bg, color: '#3d2c22' }}>
        <FloralDecoration petal1={floral.petal1} petal2={floral.petal2} petal3={floral.petal3} />
        {/* Soft gradient overlay */}
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 70% 20%, ${floral.petal1}15 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, ${floral.petal3}10 0%, transparent 60%)`,
        }} />
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">{moodInfo.emoji}</div>
            <p className="font-display text-xl sm:text-2xl leading-relaxed tracking-wide" style={{ color: '#3d2c22' }}>
              「{quote}」
            </p>
          </div>
        </div>
        <div className="relative z-10 text-center space-y-1.5">
          {name && <p className="font-handwriting text-base" style={{ color: 'rgba(61,44,34,0.55)' }}>── 給 {name} 的金句</p>}
          <p className="font-serif-tc text-xs" style={{ color: 'rgba(61,44,34,0.45)' }}>{date}</p>
          <p className="font-serif-tc text-[10px] mt-1" style={{ color: 'rgba(61,44,34,0.4)' }}>🌸 花語 · 人生金句</p>
        </div>
      </div>
    );
  }
);

QuoteCard.displayName = 'QuoteCard';
export default QuoteCard;
