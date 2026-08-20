import { CircleAlertIcon } from "lucide-react";
import { PickerDropdown, type PickerOption } from "./ModelPicker";
import { cn } from "../lib/utils";
import { aiThemeClassNames } from "../theme";
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
      triggerLeading={
        isFullAccess ? <CircleAlertIcon className="size-3.5" /> : null
      }
      triggerClassName={
        isFullAccess
          ? cn(
              aiThemeClassNames.textWarning,
              aiThemeClassNames.hoverTextWarning,
              aiThemeClassNames.dataOpenTextWarning,
            )
          : undefined
      }
    />
  );
}
