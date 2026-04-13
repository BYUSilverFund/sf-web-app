import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function ActiveSwitch({
  active,
  setActive,
}: {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    // This compact switch keeps the active/total control styling aligned with the updated dashboard controls.
    <div className="flex items-center gap-3">
      <Label className="text-base font-normal text-gray-700">Active</Label>
      <Switch
        checked={active}
        onCheckedChange={setActive}
        className="data-[state=checked]:bg-[#002E5D]"
      />
    </div>
  );
}
