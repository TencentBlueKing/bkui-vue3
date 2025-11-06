export type ValueType = string | number | boolean | Array<string | number | boolean> | object;
export type LinkType = string | Record<string, string>;

export interface IParam {
  name: string;
  type: string;
  link?: LinkType;
}

// 公共属性方法配置项
export interface PropItem {
  name: string;
  type?: string;
  default?: ValueType;
  description: string;
  link?: LinkType;
  options?: Array<boolean | number | string>;
  params?: IParam[];
}

export interface IComponentWiki {
  group: string;
  name: string;
  title: string;
  titleCN: string;
  description: string;
  props?: PropItem[];
  emits?: PropItem[];
  methods?: PropItem[];
  slots?: PropItem[];
  presets: Array<{
    title: string;
    description: string;
    template?: string;
    props?: Record<string, ValueType>;
    slots?: Record<string, string>;
    dependent?: {
      components: Array<string>;
    };
    style?: Record<string, string>;
  }>;
  types?: {
    name: string;
    description: string;
    fields: PropItem[];
  }[];
  children?: Array<Pick<IComponentWiki, 'emits' | 'name' | 'props' | 'slots' | 'methods'>>;
}
export interface INavGroups {
  componentGroupMap: {
    [groupName: string]: IComponentWiki[];
  };
  directiveList: IComponentWiki[];
  customComponentList: IComponentWiki[];
  startList?: IComponentWiki[]
}

export interface IComponentMeta {
  componentWiki: IComponentWiki;
  routerName: string;
}

export interface IFileAuthor {
  login: string;
  avatar: string;
}

// api表格列类型
export interface Column {
  key: keyof PropItem;
  title: string;
  width?: string;
}
