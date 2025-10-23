export type ValueType = string | number | boolean | Array<string | number | boolean> | object;
export type LinkType = string | Record<string, string>;

export interface IParam {
  name: string;
  type: string;
  link?: LinkType;
}

export interface PropItem {
  name: string;
  type: string;
  default?: ValueType;
  description: string;
  link?: LinkType;
  options?: Array<string | number>;
}

export interface IComponentWiki {
  group: string;
  name: string;
  title: string;
  titleCN: string;
  description: string;
  props?: PropItem[];
  emits?: {
    name: string;
    description: string;
    params: IParam[];
  }[];
  slots?: {
    name: string;
    description: string;
    params?: IParam[];
  }[];
  presets: Array<{
    title: string;
    description: string;
    template?: string;
    props?: Record<string, ValueType>;
    slots?: Record<string, string>;
  }>;
  types?: {
    name: string;
    description: string;
    fields: PropItem[];
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
  componentWiki: IComponentWiki;
  type: string;
}

export interface IFileAuthor {
  login: string;
  avatar: string;
}

// api表格列类型
export interface Column {
  key: string;
  title: string;
  width?: string;
}
