import { useMemo, useEffect } from "react";
import { FileTree, useFileTree, useFileTreeSelection } from "@pierre/trees/react";
import type { FileTreePreparedInput } from "@pierre/trees";

interface ModernTreeProps {
  preparedInput: FileTreePreparedInput;
  onSelect: (fileName: string, isFolder: boolean) => void;
}

/** Top-level directory public ids (no slash) for initial expansion. */
function topLevelExpandedPaths(paths: readonly string[]): string[] {
  return paths
    .filter((p) => p.endsWith("/"))
    .map((p) => p.slice(0, -1))
    .filter((dir) => dir.length > 0 && !dir.includes("/"));
}

export default function ModernTree({ preparedInput, onSelect }: ModernTreeProps) {
  const initialExpandedPaths = useMemo(
    () => topLevelExpandedPaths(preparedInput.paths),
    [preparedInput],
  );

  const { model } = useFileTree({
    preparedInput,
    initialExpandedPaths,
  });

  const selectedPaths = useFileTreeSelection(model);

  useEffect(() => {
    onSelect(selectedPaths[0], false);
  }, [selectedPaths]);

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <FileTree model={model} style={{ flex: 1, minHeight: 0, height: "100%" }} />
    </div>
  );
}
