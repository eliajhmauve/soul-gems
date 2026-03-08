import { moods, type MoodKey } from "@/data/quotes";

interface MoodSelectorProps {
  onSelect: (mood: MoodKey) => void;
  selected?: MoodKey;
}

const MoodSelector = ({ onSelect, selected }: MoodSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
      {moods.map((mood) => (
        <button
          key={mood.key}
          onClick={() => onSelect(mood.key)}
          className={`
            flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300
            hover:scale-105 hover:shadow-lg cursor-pointer
            ${selected === mood.key
              ? 'border-primary bg-primary/10 shadow-md scale-105'
              : 'border-border bg-card hover:border-primary/40'
            }
          `}
        >
          <span className="text-4xl">{mood.emoji}</span>
          <span className="font-serif-tc text-sm font-semibold text-foreground">{mood.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
