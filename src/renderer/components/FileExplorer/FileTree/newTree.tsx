import { FileTree, useFileTree } from "@pierre/trees/react";
import type { FileTreePreparedInput } from "@pierre/trees";

interface ModernTreeProps {
    data: FileTreePreparedInput;
}

export default function ModernTree({ data }: ModernTreeProps) {
    const { tree, setTree } = useFileTree(data);

    
    return (
        <div>
            <h1>Modern Tree</h1>
        </div>
    )
}