export type AIThread = {
  id: string;
  title: string;
};

export type AIProject = {
  id: string;
  name: string;
  threads: AIThread[];
};
