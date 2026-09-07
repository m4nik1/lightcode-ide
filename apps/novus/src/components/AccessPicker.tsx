import { ShieldAlertIcon } from "lucide-react";
import { PickerDropdown, type PickerOption } from "./ModelPicker";
import { useAIChat } from "../context/useAIChat";

type AccessMode = "read-only" | "workspace-write" | "danger-full-access";

const accessOptions: PickerOption<AccessMode>[] = [
  { label: "Read only", value: "read-only", description: "Chat only" },
  { label: "Auto", value: "workspace-write", description: "Edit in workspace" },
  {
    label: "Full access",
    value: "danger-full-access",
    description: "Edit anywhere, run commands",
  },
];

export default function AccessPicker() {
  const { access, accessSet } = useAIChat();

  const isFullAccess = access === "danger-full-access";

  return (
    <PickerDropdown
      options={accessOptions}
      value={access}
      onSelect={accessSet}
      menuWidth="min-w-64"
      showChevron={false}
      triggerLeading={
        isFullAccess ? <ShieldAlertIcon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" /> : null
      }
      triggerClassName={
        isFullAccess
          ? "text-[#FF873D] hover:text-[#FFA265] data-[state=open]:text-[#FF873D]"
          : undefined
      }
    />
  );
}
