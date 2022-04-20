import JSXFactory from "@battis/jsx-factory";
import "./Icon.scss";
import SVG from "./svg/";

export const loadIcon = (svgSource: string) => {
  return (props = {}) => {
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
    const icon = loadIcon(SVG.Loading)(props);
    return <span class="loading">{icon}</span>;
  };
};

const Icon = {
  Add: loadIcon(SVG.Add),
  Ballot: {
    Checked: loadIcon(SVG.Ballot.Checked),
    Unchecked: loadIcon(SVG.Ballot.Unchecked),
  },
  Close: loadIcon(SVG.Close),
  Document: loadIcon(SVG.Document),
  Ellipsis: loadIcon(SVG.Ellipsis),
  Loading: LoadingIcon,
  Delete: loadIcon(SVG.Close),
  User: loadIcon(SVG.User),
};
export default Icon;
