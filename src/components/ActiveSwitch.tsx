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
    <div className="flex items-center gap-2">
      <Switch defaultChecked onClick={() => setActive(!active)} />
      <Label>Active</Label>
    </div>
  );
}
