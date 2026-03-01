export type ModuleComponent = {
  key: string;
  title: string;
  icon: string | { src: string };
};

export type GameModule = {
  type: "base";
  components: ModuleComponent[];
};
