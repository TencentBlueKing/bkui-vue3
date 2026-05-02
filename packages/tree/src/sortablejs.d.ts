declare module 'sortablejs' {
  namespace Sortable {
    interface SortableEvent {
      item: HTMLElement;
      from?: HTMLElement;
      to?: HTMLElement;
      oldIndex?: number;
      newIndex?: number;
      related?: HTMLElement;
    }

    interface MoveEvent extends SortableEvent {
      dragged: HTMLElement;
      related: HTMLElement;
      willInsertAfter?: boolean;
    }

    interface Options {
      animation?: number;
      chosenClass?: string;
      dragClass?: string;
      draggable?: string;
      filter?: string;
      ghostClass?: string;
      onEnd?: (evt: SortableEvent) => void;
      onMove?: (evt: MoveEvent, originalEvent: Event) => -1 | boolean | void;
      onStart?: (evt: SortableEvent) => void;
      onUnchoose?: (evt: SortableEvent) => void;
    }

    interface Instance {
      destroy: () => void;
    }
  }

  const Sortable: {
    create: (element: HTMLElement, options: Sortable.Options) => Sortable.Instance;
  };

  export default Sortable;
}
