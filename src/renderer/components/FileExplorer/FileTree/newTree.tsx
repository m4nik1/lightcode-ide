import { useMemo, useEffect, useRef } from "react";
import { FileTree, useFileTree, useFileTreeSelection } from "@pierre/trees/react";
import type { FileTreePreparedInput } from "@pierre/trees";
import { FILE_TREE_UNSAFE_CSS, fileTreeHostStyle, styles } from "./newTree.styles";

interface ModernTreeProps {
  preparedInput: FileTreePreparedInput;
  onSelect: (fileName: string, isFolder: boolean) => void;
}

const FILE_TREE_ITEM_HEIGHT = 26;

const fileTreeModelOptions = {
  itemHeight: FILE_TREE_ITEM_HEIGHT,
  density: "compact" as const,
  icons: { set: "standard" as const, colored: true },
  unsafeCSS: FILE_TREE_UNSAFE_CSS,
};

export default function ModernTree({ preparedInput, onSelect }: ModernTreeProps) {
  const previousSelectedPathRef = useRef<string | undefined>(undefined);

  const { model } = useFileTree({
    ...fileTreeModelOptions,
    preparedInput,
    initialExpandedPaths: ['src', 'src/renderer'],
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
    <div style={styles.root}>
      <FileTree model={model} style={fileTreeHostStyle} />
    </div>
  );
}
