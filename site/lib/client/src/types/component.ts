export type ValueType = string | number | boolean | Array<string | number | boolean> | object;

export interface IComponentWiki {
  group: string;
  name: string;
  title: string;
  titleCN: string;
  description: string;
  props: {
    name: string;
    type: string;
    default?: ValueType;
    description: string;
    link?: string;
    options?: Array<string | number>;
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
    props: Record<string, ValueType>;
    slots?: Record<string, string>;
  }>
  types?: {
    name: string;
    description: string;
    fields: {
      name: string;
      type: string;
      description: string;
      default?: ValueType;
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

export interface IComponentMeta {
  componentWiki: IComponentWiki,
  type: string
}
