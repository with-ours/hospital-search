"use client";

export interface FilterState {
  distance: number;
  categories: string[];
}

interface FiltersSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const distanceOptions = [
  { value: 1, label: "1 mile" },
  { value: 5, label: "5 miles" },
  { value: 10, label: "10 miles" },
  { value: 25, label: "25 miles" },
  { value: 50, label: "50 miles" },
];

const categoryOptions = [
  { value: "Hospital", label: "Hospital" },
  { value: "Clinic", label: "Clinic" },
  { value: "Urgent Care", label: "Urgent Care" },
  { value: "Pharmacy", label: "Pharmacy" },
];

export function FiltersSidebar({
  filters,
  onFiltersChange,
}: FiltersSidebarProps) {
  const handleDistanceChange = (distance: number) => {
    onFiltersChange({ ...filters, distance });
  };

  const handleCategoryToggle = (category: string) => {
    const categories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories });
  };

  return (
    <div className="bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-900">Filters</h2>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Distance</h3>
        <div className="space-y-2">
          {distanceOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center cursor-pointer"
            >
              <input
                type="radio"
                name="distance"
                value={option.value}
                checked={filters.distance === option.value}
                onChange={() => handleDistanceChange(option.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Hospital Type
        </h3>
        <div className="space-y-2">
          {categoryOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(option.value)}
                onChange={() => handleCategoryToggle(option.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
