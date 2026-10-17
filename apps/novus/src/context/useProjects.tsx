import { trpcClient } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

// Loads sidebar projects and exposes project creation.

export function useProjects() {
  const getProjects = useQuery({
    queryKey: ["projects"],
    queryFn: () => trpcClient.getProjects.query(),
  });

  async function createProject() {
    const projectFolder = await window.electronAPI.openFolder();
    const projectFolderPath = projectFolder.filePaths[0];

    if (!projectFolderPath) {
      return;
    }

    const folderName = projectFolderPath.split("/")?.at(-1);

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
