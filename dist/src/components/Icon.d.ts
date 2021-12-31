import { Nullable } from "@battis/typescript-tricks";
import "./Icon.scss";
export declare const loadIcon: (svgSource: string) => (props?: Nullable<object>) => Element;
export declare const LoadingIcon: () => (props?: {}) => any;
declare const Icon: {
    Add: (props?: Nullable<object>) => Element;
    Ballot: {
        Checked: (props?: Nullable<object>) => Element;
        Unchecked: (props?: Nullable<object>) => Element;
    };
    Close: (props?: Nullable<object>) => Element;
    Document: (props?: Nullable<object>) => Element;
    Ellipsis: (props?: Nullable<object>) => Element;
    Loading: () => (props?: {}) => any;
    Delete: (props?: Nullable<object>) => Element;
    User: (props?: Nullable<object>) => Element;
};
export default Icon;
