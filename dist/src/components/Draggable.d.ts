import { Component, Container } from "@battis/jsx-components";
import { Constructor, Mixin } from "@battis/typescript-tricks";
import "./Draggable.scss";
export declare type DropDescriptor = {
    dropped: Component;
    source: Container<any>;
    target: Container<any>;
};
export declare type DropHandler = (dropDescriptor: DropDescriptor) => any;
declare function Draggable<T extends Constructor<Component>>(Base: T): object;
export default Draggable;
export declare function instanceOfDraggable(obj: any): obj is Mixin<typeof Draggable>;
