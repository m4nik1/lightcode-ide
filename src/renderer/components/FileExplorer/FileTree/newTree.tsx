import { useMemo, useEffect, useRef } from "react";
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

  const previousSelectedPathRef = useRef<string | undefined>(undefined);

  const { model } = useFileTree({
    preparedInput,
    initialExpandedPaths,
  });

  const selectedPaths = useFileTreeSelection(model);

  useEffect(() => {
    const selectedPath = selectedPaths[0];

    if (!selectedPath || previousSelectedPathRef.current === selectedPath) {
      return;
    }

    previousSelectedPathRef.current = selectedPath;
    onSelect(selectedPath, false);
  }, [selectedPaths, onSelect]);

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      <FileTree model={model} style={{ flex: 1, minHeight: 0, height: "100%" }} />
    </div>
  );
}
