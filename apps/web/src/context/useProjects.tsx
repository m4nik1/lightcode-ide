import { useState } from "react";
import { trpcClient } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

// Loads sidebar projects and exposes project creation.

export function useProjects() {
  const [isFolderPickerOpen, setFolderPickerOpen] = useState(false);
  const getProjects = useQuery({
    queryKey: ["projects"],
    queryFn: () => trpcClient.getProjects.query(),
  });

  async function createProject() {
    if (!window.electronAPI) {
      // Browsers can't expose absolute paths, so browse the server's folders.
      setFolderPickerOpen(true);
      return;
    }

    const projectFolderPath = (await window.electronAPI.openFolder()).filePaths[0];

    if (projectFolderPath) {
      await addProjectFromPath(projectFolderPath);
    }
  }

  async function addProjectFromPath(projectFolderPath: string) {
    const folderName = projectFolderPath.split(/[\\/]/).filter(Boolean).at(-1);

    if (!folderName) {
      return;
    }

    await trpcClient.addProject.mutate({
      projectName: folderName,
      path: projectFolderPath,
    });

    await getProjects.refetch();
  }

  return {
    getProjects,
    createProject,
    addProjectFromPath,
    isFolderPickerOpen,
    setFolderPickerOpen,
  };
}
