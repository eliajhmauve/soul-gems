import { moods, type MoodKey } from "@/data/quotes";

interface MoodSelectorProps {
  onSelect: (mood: MoodKey) => void;
  selected?: MoodKey;
}

const MoodSelector = ({ onSelect, selected }: MoodSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-sm sm:max-w-md mx-auto px-2">
      {moods.map((mood, index) => (
        <button
          key={mood.key}
          onClick={() => onSelect(mood.key)}
          className={`
            flex flex-col items-center gap-1.5 sm:gap-2 py-4 px-3 sm:p-5 rounded-2xl border-2 
            transition-all duration-300 cursor-pointer active:scale-95
            animate-fade-in-up
            hover:scale-105 hover:shadow-lg
            ${selected === mood.key
              ? 'border-primary bg-primary/10 shadow-md scale-105'
              : 'border-border bg-card hover:border-primary/40'
            }
          `}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <span className="text-3xl sm:text-4xl transition-transform duration-300 hover:scale-110">
            {mood.emoji}
          </span>
          <span className="font-serif-tc text-xs sm:text-sm font-semibold text-foreground">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
