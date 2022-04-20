import { v4 as uuid } from "uuid";
import { Component, Container } from "@battis/jsx-components";
import { _DOM } from "@battis/monkey-patches";
import { Constructor, Mixin, Nullable } from "@battis/typescript-tricks";
import "./Draggable.scss";

// TODO nested draggables
// TODO drag handles (display an element that, when clicked, sets draggable to draggable?)
// TODO restrict to "home" container (reorder, but not transfer)

export type DropDescriptor = {
  dropped: Component;
  source: Container<any>;
  target: Container<any>;
};
export type DropHandler = (dropDescriptor: DropDescriptor) => any;

function Draggable<T extends Constructor<Component>>(
  Base: T
): object /* TS4094 work-around */ {
  return class Draggable extends Base {
    public static Container = class DraggableContainer extends Container<Draggable> {
      private dropCallback;

      private source;
      private target;

      public constructor(...args) {
        const [element, children, dropCallback] = args;
        super(element, children);
        this.dropCallback = dropCallback;
      }

      private getOriginalSource(event) {
        return document.querySelector(".draggable.dragging:not(.proxy)");
      }

      private getDraggableSource(event) {
        if (!this.source) {
          const source = document.querySelector(".draggable.dragging");
          if (source) {
            this.source = source.cloneNode(true);
            this.source.classList.add("proxy");
          }
        }
        return this.source;
      }

      private getDraggableTarget(event: DragEvent) {
        let target = event.target;
        while (
          target &&
          target instanceof Element &&
          (target.parentElement as Element) != this.element
        ) {
          target = target.parentElement;
        }
        if (!target && this.target) {
          if (
            this.target !==
              this.element.querySelector(".draggable:last-child") &&
            _DOM.rectContains(
              this.element.getBoundingClientRect(),
              event.clientX,
              event.clientY
            )
          ) {
            return this.target;
          }
        }
        this.target = target;
        return target as Nullable<Element>;
      }

      protected onDragEnter(event: DragEvent) {
        event.preventDefault();
        document
          .querySelectorAll(".draggable.container.target")
          .forEach((elt) => elt.classList.remove("target"));
        this.element.classList.add("target");
        event.dataTransfer!.dropEffect = "move";
      }

      protected onDragOver(event: DragEvent) {
        event.preventDefault();
        const source = this.getDraggableSource(event);
        const target = this.getDraggableTarget(event);
        if (target && target !== this.getOriginalSource(event)) {
          if (source) {
            this.element.insertBefore(source, target);
          }
        } else if (source) {
          // FIXME this happens when _between_ draggable elts
          this.element.appendChild(source);
        }
      }

      protected onDragLeave(event: DragEvent) {
        event.preventDefault();
        if (event.target === this.element) {
          const target = this.getDraggableTarget(event);
          if (!target) {
            if (this.source) {
              this.source.remove();
              this.source = null;
            }
            this.element.classList.remove("target");
          }
        }
      }

      protected onDrop(event: DragEvent) {
        event.preventDefault();
        const dropped = this.getOriginalSource(event);
        if (dropped) {
          const droppedComponent = Component.for(dropped) as Draggable;
          const source = DraggableContainer.parent(dropped);
          this.element.replaceChild(dropped, this.getDraggableSource(event)!);
          if (this.dropCallback) {
            this.dropCallback({
              dropped: Component.for(dropped),
              source,
              target: this,
            });
          }
        }
      }

      public setElement(element) {
        if (element !== this._element) {
          element.classList.add("draggable", "container");
          [
            this.onDragEnter,
            this.onDragOver,
            this.onDragLeave,
            this.onDrop,
          ].forEach((handler) => {
            element.addEventListener(
              handler.name.substr(2).toLowerCase(),
              handler.bind(this)
            );
          });
        }
        super.setElement(element);
      }
    };

    protected onDragStart(event: DragEvent) {
      this.element.classList.add("dragging");
      if (!this.element.id) {
        this.element.id = uuid();
      }
      event.dataTransfer?.setData("dragging", this.element.id);
    }

    protected onDragEnd(event: DragEvent) {
      //this.element.classList.remove('dragging');
      [".dragging.proxy", ".dragging", ".container.target"].forEach(
        (selector) => {
          document
            .querySelectorAll(`.draggable${selector}`)
            .forEach((elt) =>
              elt.classList.remove(
                ...selector.split(".").filter((token) => token.length)
              )
            );
        }
      );
    }

    public setElement(element) {
      if (element !== this._element) {
        if (element instanceof HTMLElement) {
          element.draggable = true;
          element.classList.add("draggable");
          ["onDragStart", "onDragEnd"].forEach((handler) => {
            element.addEventListener(
              handler.substr(2).toLowerCase(),
              this[handler].bind(this)
            );
          });
        } else {
          throw new TypeError();
        }
      }
      super.setElement(element);
    }
  };
}

export default Draggable;

export function instanceOfDraggable(obj: any): obj is Mixin<typeof Draggable> {
  return "onDragStart" in obj && "onDragEnd" in obj;
}
