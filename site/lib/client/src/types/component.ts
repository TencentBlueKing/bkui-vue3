export type ValueType = string | number | boolean | Array<string | number | boolean> | object;
export type LinkType = string | Record<string, string>;

export interface IParam {
  name: string;
  type: string;
  link?: LinkType;
}

export interface IProp {
  name: string;
  description: string;
  type: string;
  default?: ValueType;
  link?: LinkType;
  options?: Array<boolean | number | string>;
  params?: IParam[];
  isSupportVModel?: boolean;
}

export interface IEmit {
  name: string;
  description: string;
  params?: IParam[];
}

export type ISlot = IEmit;

export type IExpose = Pick<IProp, 'description' | 'link' | 'name' | 'type' | 'params'>;

export interface IPreset {
  title: string;
  description: string;
  template?: string;
  props?: Record<string, ValueType>;
  slots?: Record<string, string>;
  events?: Record<string, string>;
  dependent?: {
    components: Array<string>;
  };
  style?: string;
}

export interface IType {
  name: string;
  description: string;
  fields: IProp[];
}

export interface IComponentWiki {
  group: string;
  name: string;
  title: string;
  titleCN: string;
  description: string;
  props?: IProp[];
  emits?: IEmit[];
  exposes?: IExpose[];
  slots?: ISlot[];
  presets: IPreset[];
  types?: IType[];
  children?: Array<Pick<IComponentWiki, 'emits' | 'exposes' | 'name' | 'props' | 'slots'>>;
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
  key: keyof IProp;
  title: string;
  width?: string;
}

export type CodeLanguages = 'javascript' | 'typescript';