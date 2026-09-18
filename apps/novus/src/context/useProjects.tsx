/*
    This hook is here to load the projects/threads in the sidebar
*/


export function projectProvider({ children } : { children: ReactNode }) {
  const projectsQuery = useQuery({
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

    await projectsQuery.refetch();
  }

  return (
    <projectsContext.provider
      value={{
        projectsQuery,
        createProject
      }}
    >
    </projectsContext.provider>
  )
}
