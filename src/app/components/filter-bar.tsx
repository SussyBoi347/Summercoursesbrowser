import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface FilterBarProps {
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  selectedSubject,
  onSubjectChange,
  onClearFilters,
}: FilterBarProps) {
  const hasActiveFilters = selectedSubject !== "all";

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <Select value={selectedSubject} onValueChange={onSubjectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Arts">Arts</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Music">Music</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" size="icon" onClick={onClearFilters} title="Clear filters">
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
