import { forwardRef } from "react";
import { moods, type MoodKey } from "@/data/quotes";

export type TemplateStyle = 'classic' | 'modern' | 'minimal';

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

    if (template === 'classic') {
      return (
        <div
          ref={ref}
          className={`${aspectClass} rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden`}
          style={baseStyle}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)'
          }} />
          <div className="relative z-10 flex-1 flex items-center justify-center">
            <div className="text-center px-2">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">{moodInfo.emoji}</div>
              <p className="font-display text-xl sm:text-2xl leading-relaxed tracking-wide">
                「{quote}」
              </p>
            </div>
          </div>
          <div className="relative z-10 text-center space-y-1">
            {name && (
              <p className="font-handwriting text-base sm:text-lg" style={{ color: subTextColor }}>
                ── 給 {name} 的金句
              </p>
            )}
            <p className="font-serif-tc text-xs sm:text-sm" style={{ color: subTextColor }}>{date}</p>
            <p className="font-serif-tc text-xs mt-2" style={{ color: subTextColor }}>🟡 你的專屬人生金句</p>
          </div>
        </div>
      );
    }

    if (template === 'modern') {
      return (
        <div
          ref={ref}
          className={`${aspectClass} rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden`}
          style={{ ...baseStyle, borderRadius: '2rem' }}
        >
          <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 rounded-full opacity-20" style={{
            background: 'rgba(255,255,255,0.3)',
            filter: 'blur(40px)',
            transform: 'translate(20%, -20%)',
          }} />
          <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 rounded-full opacity-15" style={{
            background: 'rgba(255,255,255,0.3)',
            filter: 'blur(30px)',
            transform: 'translate(-20%, 20%)',
          }} />
          <div className="relative z-10">
            <span className="text-2xl sm:text-3xl">{moodInfo.emoji}</span>
          </div>
          <div className="relative z-10 flex-1 flex items-center">
            <p className="font-display text-2xl sm:text-3xl leading-loose tracking-wider">
              {quote}
            </p>
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

    // minimal
    return (
      <div
        ref={ref}
        className={`${aspectClass} rounded-xl p-6 sm:p-10 flex flex-col justify-center relative border-2`}
        style={{ ...baseStyle, background: isDark ? '#1a1a2e' : '#faf8f5', border: `2px solid ${subTextColor}` }}
      >
        <div className="text-center space-y-6 sm:space-y-8">
          <span className="text-3xl sm:text-4xl">{moodInfo.emoji}</span>
          <p className="font-display text-xl sm:text-2xl leading-relaxed" style={{ color: isDark ? '#faf8f5' : '#2c1810' }}>
            「{quote}」
          </p>
          <div className="space-y-1">
            {name && (
              <p className="font-handwriting text-sm sm:text-base" style={{ color: subTextColor }}>── {name}</p>
            )}
            <p className="font-serif-tc text-xs" style={{ color: subTextColor }}>{date} · 人生金句</p>
          </div>
        </div>
      </div>
    );
  }
);

QuoteCard.displayName = 'QuoteCard';
export default QuoteCard;
