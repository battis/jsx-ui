import { Component } from '@battis/jsx-components';
declare type HideableValueConfig = {
    [key: string]: any;
    isHidden?: () => boolean;
    isShown?: () => boolean;
    tagName?: string;
};
export default class HideableValue extends Component {
    private isHidden;
    constructor({ isHidden, isShown, tagName: TagName, ...props }: HideableValueConfig);
    setElement(element: any): void;
}
export {};
