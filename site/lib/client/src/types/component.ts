export type PropValue = string | number | boolean | Array<string | number | boolean> | object;

export interface IComponentWiki {
  group: string;
  name: string;
  title: string;
  titleCN: string;
  description: string;
  props: {
    name: string;
    type: string;
    default: string;
    description: string;
    link?: string;
  }[];
  emits?: {
    name: string;
    description: string;
    params: {
      name: string;
      type: string;
      link?: string;
    }[]
  }[];
  slots?: {
    name: string;
    description: string;
    params?: {
      name: string;
      type: string;
      link?: string;
    }[]
  }[];
  presets: Array<{
    title: string;
    description: string;
    props: Record<string, PropValue>;
    slots?: Record<string, string>;
  }>
  types?: {
    name: string;
    description: string;
    fields: {
      name: string;
      type: string;
      description: string;
      default?: string;
      link?: string;
    }[]
  }[];
}

export interface INavGroups {
  componentGroupMap: {
    [groupName: string]: IComponentWiki[];
  };
  directiveList: IComponentWiki[];
}
