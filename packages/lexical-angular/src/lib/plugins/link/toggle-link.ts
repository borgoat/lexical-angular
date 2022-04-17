// https://github.com/facebook/lexical/blob/4de4ca71965e8bdd8ea8677d6b51364e77718696/packages/lexical-react/src/LexicalLinkPlugin.js#L25
import {$getSelection, $isElementNode, $setSelection} from 'lexical';
import {$createLinkNode, $isLinkNode, LinkNode} from '@lexical/link';

export function toggleLink(url: string | null): void {
  const selection = $getSelection();
  if (selection) {
    $setSelection(selection);
  }
  const sel = $getSelection();
  if (sel) {
    const nodes = sel.extract();
    if (url === null) {
      nodes.forEach(node => {
        const parent = node.getParent();
        if (parent && $isLinkNode(parent)) {
          const children = parent.getChildren();
          for (let i = 0; i < children.length; i++) {
            parent.insertBefore(children[i]);
          }
          parent.remove();
        }
      });
    } else {
      if (nodes.length === 1) {
        const firstNode = nodes[0];
        if ($isLinkNode(firstNode)) {
          // @ts-expect-error: TODO: Internal lexical types
          firstNode.setURL(url);
          return;
        } else {
          if (nodes.length === 1) {
            const firstNode = nodes[0];
            if ($isLinkNode(firstNode)) {
              // @ts-expect-error: TODO: Internal lexical types
              firstNode.setURL(url);
              return;
            } else {
              const parent = firstNode.getParent();
              if ($isLinkNode(parent)) {
                // @ts-expect-error: TODO: Internal lexical types
                parent.setURL(url);
                return;
              }
            }
          }
        }

        let prevParent: LinkNode | null = null;
        let linkNode: LinkNode | null = null;
        nodes.forEach(node => {
          const parent = node.getParent();
          if (
            parent === linkNode ||
            !parent ||
            // @ts-expect-error: TODO: Internal lexical types
            ($isElementNode(node) && !node.isInline())
          ) {
            return;
          }
          // @ts-expect-error: TODO: Internal lexical types
          if (!parent.is(prevParent)) {
            // @ts-expect-error: TODO: Internal lexical types
            prevParent = parent;
            linkNode = $createLinkNode(url);
            if ($isLinkNode(parent)) {
              if (node.getPreviousSibling() === null) {
                // @ts-expect-error: TODO: Internal lexical types
                parent.insertBefore(linkNode);
              } else {
                // @ts-expect-error: TODO: Internal lexical types
                parent.insertAfter(linkNode);
              }
            } else {
              // @ts-expect-error: TODO: Internal lexical types
              node.insertBefore(linkNode);
            }
          }
          if ($isLinkNode(node)) {
            if (linkNode !== null) {
              // @ts-expect-error: TODO: Internal lexical types
              const children = node.getChildren();
              for (let i = 0; i < children.length; i++) {
                // @ts-expect-error: TODO: Internal lexical types
                linkNode.append(children[i]);
              }
            }
            node.remove();
            return;
          }
          if (linkNode) {
            // @ts-expect-error: TODO: Internal lexical types
            linkNode.append(node);
          }
        });
      }
    }
  }
}
