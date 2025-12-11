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
    <div className="bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-6 flex-1 overflow-y-auto">
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
                <span className="ml-3 text-sm text-gray-700">
                  {option.label}
                </span>
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
                <span className="ml-3 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-gray-200">
        <a
          href="https://github.com/with-ours/hospital-search/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
}
