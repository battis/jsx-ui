import './Embed.scss';
import JSXFactory, { JSXFunction } from '@battis/jsx-factory';

const Embed: JSXFunction = (props, children) => {
    const element = <div class="embed-wrapper">{children}</div>;
    new MutationObserver(((mutations, observer) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(added => {
                if (added === element) {
                    document.body.classList.add('embed');
                    observer.disconnect();
                }
            })
        })
    })).observe(document.body, {childList: true, subtree: true});
    return element;
};

export default Embed;
