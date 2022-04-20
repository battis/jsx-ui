import { Component } from "@battis/jsx-components";
import "./Tabbed.scss";
declare class TabContent extends Component {
    private _name;
    readonly id: any;
    get name(): any;
    set name(name: any);
    constructor(props: any);
    render(children?: Element[]): any;
}
export default class Tabbed extends Component {
    static Tab: typeof TabContent;
    constructor(props: any);
    render(children?: any): import("@battis/jsx-components/dist/src/Component").ComponentizedElement;
    select(tabId: any): void;
}
export {};
