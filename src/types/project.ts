export type Contributor = {
  name: string;
  github?: string;
};

export type Project = {
  _id: string;
  title: string;
  description: string;
  coverImage?: { asset: { _ref: string } };
  githubUrl: string;
  techStack?: string[];
  contributors?: Contributor[];
  status?: "active" | "completed" | "archived";
};
