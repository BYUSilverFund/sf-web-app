"use client";

export function MetricToggleSwitch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    // This small shared switch keeps the metric toggles visually consistent across performance pages.
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className="relative h-5 w-9 rounded-full bg-gray-200 transition-colors hover:bg-gray-300"
    >
      <div
        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-[#002E5D] transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
