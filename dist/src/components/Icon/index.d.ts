import "./Icon.scss";
export declare const loadIcon: (svgSource: string) => (props?: {}) => Element;
export declare const LoadingIcon: () => (props?: {}) => any;
declare const Icon: {
    Add: (props?: {}) => Element;
    Ballot: {
        Checked: (props?: {}) => Element;
        Unchecked: (props?: {}) => Element;
    };
    Close: (props?: {}) => Element;
    Document: (props?: {}) => Element;
    Ellipsis: (props?: {}) => Element;
    Loading: () => (props?: {}) => any;
    Delete: (props?: {}) => Element;
    User: (props?: {}) => Element;
};
export default Icon;
