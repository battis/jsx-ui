import { Component } from '@battis/jsx-components';
declare type Selector = (element: Element) => boolean;
declare type KeyedViewConfig = object & {
    isSelected: Selector;
};
export default class KeyedView extends Component {
    private isSelected;
    constructor({ isSelected, ...props }: KeyedViewConfig);
    setElement(element: Element): void;
}
export {};
