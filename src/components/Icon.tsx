import JSXFactory from "@battis/jsx-factory";
import { Nullable } from "@battis/typescript-tricks";
import "./Icon.scss";

export const loadIcon = (svgSource: string) => {
  return (props: Nullable<object> = {}) => {
    const icon = JSXFactory.elementFromSource(svgSource)();
    if (props) {
      for (const name of Object.getOwnPropertyNames(props)) {
        icon.setAttribute(name, props[name]);
      }
    }
    icon.classList.add("icon");
    return icon;
  };
};

export const LoadingIcon = () => {
  return (props = {}) => {
    // FIXME props are not being passed into the loading icon
    const icon = loadIcon(require("../icons/loading.svg"))(props);
    return <span class="loading">{icon}</span>;
  };
};

const Icon = {
  Add: loadIcon(require("../icons/add.svg")),
  Ballot: {
    Checked: loadIcon(require("../icons/ballot/checked.svg")),
    Unchecked: loadIcon(require("../icons/ballot/unchecked.svg")),
  },
  Close: loadIcon(require("../icons/close.svg")),
  Document: loadIcon(require("../icons/document.svg")),
  Ellipsis: loadIcon(require("../icons/ellipsis.svg")),
  Loading: LoadingIcon,
  Delete: loadIcon(require("../icons/close.svg")),
  User: loadIcon(require("../icons/user.svg")),
};
export default Icon;
