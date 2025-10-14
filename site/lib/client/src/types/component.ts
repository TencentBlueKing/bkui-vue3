export type ValueType = string | number | boolean | Array<string | number | boolean> | object;
export type LinkType = string | Record<string, string>;

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
    link?: LinkType;
    options?: Array<string | number>;
  }[];
  emits?: {
    name: string;
    description: string;
    params: {
      name: string;
      type: string;
      link?: LinkType;
    }[]
  }[];
  slots?: {
    name: string;
    description: string;
    params?: {
      name: string;
      type: string;
      link?: LinkType;
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
      link?: LinkType;
    }[]
  }[];
  children?: Array<Pick<IComponentWiki, 'emits' | 'name' | 'props' | 'slots'>>;
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
