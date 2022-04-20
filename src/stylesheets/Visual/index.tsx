import JSXFactory from "@battis/jsx-factory";
import "./visual.scss";

type ElementModifier = <T extends Element>(element: T, ...rest: any[]) => T;
type ElementWrapper = <T extends Element, U extends Element>(
  element: T,
  ...rest: any[]
) => U;
type Direction = "left" | "right" | "up" | "down";

export default class Visual {
  private static replaceWithWrapper = (wrapper, element) => {
    if (element.isConnected) {
      element.parentElement?.replaceChild(wrapper, element);
    }
    return wrapper;
  };

  static hide: ElementModifier = (element) => {
    element.classList.add("hidden");
    return element;
  };

  static unhide: ElementModifier = (element) => {
    element.classList.remove("hidden");
    return element;
  };

  static toggleHide: ElementModifier = (element, isHidden?: boolean) => {
    if (isHidden === undefined) {
      isHidden = !element.classList.contains("hidden");
    }
    (isHidden && Visual.hide(element)) || Visual.unhide(element);
    return element;
  };

  static shadow: ElementModifier = (element, direction?: Direction) => {
    element.classList.add("shadow");
    direction && element.classList.add(direction);
    return element;
  };

  static glow: ElementModifier = (element, direction?: Direction) => {
    element.classList.add("glow");
    direction && element.classList.add(direction);
    return element;
  };

  static fill: ElementModifier = (element) => {
    element.classList.add("fill");
    return element;
  };

  static goldenCenter: ElementWrapper = (element) => {
    return Visual.replaceWithWrapper(
      <div class="golden-wrapper">
        <div class="golden-content">{element}</div>
      </div>,
      element
    );
  };
}
