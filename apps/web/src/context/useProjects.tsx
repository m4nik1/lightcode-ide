import { useState } from "react";
import { trpcClient } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useThreads } from "./useThreads";

// Loads sidebar projects and exposes project creation.

export function useProjects() {
  const [isFolderPickerOpen, setFolderPickerOpen] = useState(false);
  const { newThread } = useThreads();
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

    const project = await trpcClient.addProject.mutate({
      projectName: folderName,
      path: projectFolderPath,
    });

    await getProjects.refetch();

    // Adding a project means you want to chat about it, so open a chat right away
    try {
      await newThread(project.id, project.path);
    } catch (error) {
      console.error("Failed to create chat for new project", error);
    }
  }

  return {
    getProjects,
    createProject,
    addProjectFromPath,
    isFolderPickerOpen,
    setFolderPickerOpen,
  };
}
