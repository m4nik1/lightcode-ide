export type thread = {
  id: string;
  projectId: string;
  title: string;
}

export type AIThread = {
  id: string;
  title: string;
}

export type AIProject = {
  id: string;
  name: string;
  threads: AIThread[];
};
