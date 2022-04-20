import { Component } from "@battis/jsx-components";
import JSXFactory from "@battis/jsx-factory";
import { v4 as uuid } from "uuid";
import "./Tabbed.scss";

// TODO ok... maybe it's time to start thinking about ARIA?

class TabLabel extends Component {
  private tab;

  public constructor(props) {
    const { tab, ...rest } = props;
    super({ ...rest });
    this.tab = tab;
  }

  public render(children?) {
    return (this.element = (
      <span
        id={`label-for-${this.tab.id}`}
        class="tab"
        onclick={this.handleClick.bind(this)}
      >
        <span>{this.tab.name}</span>
        <span class="hack" />
      </span>
    ));
  }

  private handleClick() {
    Tabbed.parent(this.element)?.select(this.tab.id);
  }
}

class TabContent extends Component {
  private _name;
  public readonly id;

  public get name() {
    return this._name;
  }

  public set name(name) {
    this._name = name;
    const label = document.body.querySelector(`#label-for-${this.id}`);
    label && (label.innerHTML = name);
  }

  public constructor(props) {
    const { name, ...rest } = props;
    super({ ...rest });
    this._name = name;
    this.id = `tab-${uuid()}`;
  }

  render(children?: Element[]) {
    return (this.element = (
      <div class="tab-content" id={this.id}>
        {children}
      </div>
    ));
  }
}

export default class Tabbed extends Component {
  public static Tab = TabContent;

  public constructor(props) {
    super(props);
  }

  public render(children?) {
    this.element = (
      <div class="tabbed">
        <div class="tabs">
          {children.map((child) => {
            const tab = TabContent.for(child);
            return (tab && <TabLabel tab={tab} />) || <></>;
          })}
        </div>
        {children}
      </div>
    );

    this.element.querySelector(".tab")?.dispatchEvent(new Event("click"));

    new MutationObserver((mutations) => {
      const tabs = this.element.querySelector(".tabs");
      if (tabs) {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((added) => {
            const tab = added instanceof Element && TabContent.for(added);
            tab && tabs.appendChild(<TabLabel tab={tab} />);
          });
        });
      }
    }).observe(this.element, { childList: true });

    return this.element;
  }

  public select(tabId) {
    this.element.querySelector(`#${tabId}`)?.classList.add("active");
    this.element.querySelector(`#label-for-${tabId}`)?.classList.add("active");
    for (const tab of Array.from(
      this.element.querySelectorAll(`.tab-content:not([id="${tabId}"])`)
    )) {
      tab.classList.remove("active");
      this.element
        .querySelector(`#label-for-${tab.id}`)
        ?.classList.remove("active");
    }
  }
}
