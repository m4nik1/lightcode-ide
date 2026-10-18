import { trpcClient } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

// Loads sidebar projects and exposes project creation.

export function useProjects() {
  const getProjects = useQuery({
    queryKey: ["projects"],
    queryFn: () => trpcClient.getProjects.query(),
  });

  async function createProject() {
    const projectFolderPath = window.electronAPI
      ? (await window.electronAPI.openFolder()).filePaths[0]
      : window.prompt("Enter the absolute project folder path on the machine running the Novus server:")?.trim();

    if (!projectFolderPath) {
      return;
    }

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

  return { getProjects, createProject };
}
