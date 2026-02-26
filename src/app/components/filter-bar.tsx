import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

type GradeFilter = "9-10" | "10-11" | "11-12";

interface FilterBarProps {
  gradeFilters: GradeFilter[];
  subjectFilters: string[];
  sessionFilters: string[];
  onlineOnly: boolean;
  eligibleOnly: boolean;
  costRange: number[];
  allSubjects: string[];
  onGradeToggle: (grade: GradeFilter) => void;
  onSubjectToggle: (subject: string) => void;
  onSessionToggle: (session: string) => void;
  onOnlineOnlyChange: (next: boolean) => void;
  onEligibleOnlyChange: (next: boolean) => void;
  onCostRangeChange: (range: number[]) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  gradeFilters,
  subjectFilters,
  sessionFilters,
  onlineOnly,
  eligibleOnly,
  costRange,
  allSubjects,
  onGradeToggle,
  onSubjectToggle,
  onSessionToggle,
  onOnlineOnlyChange,
  onEligibleOnlyChange,
  onCostRangeChange,
  onClearFilters,
}: FilterBarProps) {
  return (
    <div className="sketch-card space-y-5 p-4">
      <div>
        <p className="sketch-title text-xl">Filters</p>
        <p className="text-sm text-muted-foreground">Narrow by grade, cost, and eligibility.</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Grade level</p>
        {(["9-10", "10-11", "11-12"] as GradeFilter[]).map((grade) => (
          <label key={grade} className="sketch-check flex items-center gap-2 text-sm">
            <Checkbox checked={gradeFilters.includes(grade)} onCheckedChange={() => onGradeToggle(grade)} />
            {grade}
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Subject</p>
        {allSubjects.map((subject) => (
          <label key={subject} className="sketch-check flex items-center gap-2 text-sm">
            <Checkbox checked={subjectFilters.includes(subject)} onCheckedChange={() => onSubjectToggle(subject)} />
            {subject}
          </label>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Cost range</p>
        <Slider
          value={costRange}
          min={0}
          max={3000}
          step={100}
          onValueChange={(value) => onCostRangeChange(value as number[])}
          className="sketch-slider"
        />
        <p className="text-xs text-muted-foreground">${costRange[0]} - ${costRange[1]}</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Dates</p>
        {["Session 1", "Session 2"].map((session) => (
          <label key={session} className="sketch-check flex items-center gap-2 text-sm">
            <Checkbox checked={sessionFilters.includes(session)} onCheckedChange={() => onSessionToggle(session)} />
            {session}
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Location & eligibility</p>
        <label className="sketch-check flex items-center gap-2 text-sm">
          <Checkbox checked={onlineOnly} onCheckedChange={() => onOnlineOnlyChange(!onlineOnly)} />
          Online only
        </label>
        <label className="sketch-check flex items-center gap-2 text-sm">
          <Checkbox checked={eligibleOnly} onCheckedChange={() => onEligibleOnlyChange(!eligibleOnly)} />
          No prerequisites
        </label>
      </div>

      <Button variant="outline" className="w-full sketch-btn" onClick={onClearFilters}>
        Reset filters
      </Button>
    </div>
  );
}
