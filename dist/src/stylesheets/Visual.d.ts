import './visual.scss';
declare type ElementModifier = <T extends Element>(element: T, ...rest: any[]) => T;
declare type ElementWrapper = <T extends Element, U extends Element>(element: T, ...rest: any[]) => U;
export default class Visual {
    private static replaceWithWrapper;
    static hide: ElementModifier;
    static unhide: ElementModifier;
    static toggleHide: ElementModifier;
    static shadow: ElementModifier;
    static glow: ElementModifier;
    static fill: ElementModifier;
    static goldenCenter: ElementWrapper;
}
export {};
