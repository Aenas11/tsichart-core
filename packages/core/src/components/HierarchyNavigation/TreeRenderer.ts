import * as d3 from 'd3';
import Utils from '../../utils';
import type { IHierarchyNode, IInstanceNode } from './HierarchyNavigation';

// Centralized renderer for the hierarchy tree. Keeps a stable D3 data-join and
// updates existing DOM nodes instead of fully recreating them on each render.
export default class TreeRenderer {
    public static render(owner: any & { selectedIds?: string[]; createHierarchyItemElem: (x: any, y: any) => d3.Selection<any, any, any, any>; getAriaLabel: (x: any) => string; instanceNodeString: (x: any) => string; instanceNodeStringToDisplay: (x: any) => string; hierarchyElem?: d3.Selection<any, any, any, any> }, data: Record<string, IHierarchyNode | IInstanceNode>, target: d3.Selection<any, any, any, any>) {
        // Ensure an <ul> exists for this target (one list per level)
        let list = target.select('ul');
        if (list.empty()) {
            list = target.append('ul').attr('role', target === owner.hierarchyElem ? 'tree' : 'group');
        }

        const entries: Array<{ key: string; item: any }> = Object.keys(data).map(k => ({ key: k, item: data[k] }));

        const liSelection = list.selectAll('li').data(entries, (d: any) => d && d.key);
        liSelection.exit().remove();

        const liEnter = liSelection.enter().append('li')
            .attr('role', 'none')
            .classed('tsi-leaf', (d: any) => !!d.item.isLeaf);

        const liMerged = liEnter.merge(liSelection as any);

        const setSize = entries.length;

        liMerged.each((d: any, i: number, nodes: any[]) => {
            const entry = d as { key: string; item: any };
            const li = d3.select(nodes[i]);

            if (owner.selectedIds && owner.selectedIds.includes(entry.item.id)) {
                li.classed('tsi-selected', true);
            } else {
                li.classed('tsi-selected', false);
            }

            // determine instance vs hierarchy node by presence of isLeaf flag
            const isInstance = !!entry.item.isLeaf;
            const nodeNameToCheckIfExists = isInstance ? owner.instanceNodeString(entry.item) : entry.key;
            const displayName = (entry.item && (entry.item.displayName || nodeNameToCheckIfExists)) || nodeNameToCheckIfExists;
            li.attr('data-display-name', displayName);

            let itemElem = li.select('.tsi-hierarchyItem');
            if (itemElem.empty()) {
                const newListElem = owner.createHierarchyItemElem(entry.item, entry.key);
                li.node().appendChild(newListElem.node());
                itemElem = li.select('.tsi-hierarchyItem');
            }

            itemElem.attr('aria-label', isInstance ? owner.getAriaLabel(entry.item) : entry.key);
            itemElem.attr('title', isInstance ? owner.getAriaLabel(entry.item) : entry.key);
            itemElem.attr('aria-expanded', String(entry.item.isExpanded));
            // accessibility: set treeitem level and position in set
            const ariaLevel = String(((entry.item && typeof entry.item.level === 'number') ? entry.item.level : 0) + 1);
            itemElem.attr('aria-level', ariaLevel);
            itemElem.attr('aria-posinset', String(i + 1));
            itemElem.attr('aria-setsize', String(setSize));

            if (!isInstance) {
                itemElem.select('.tsi-caret-icon').attr('style', `left: ${(entry.item.level) * 18 + 20}px`);
                itemElem.select('.tsi-name').text(entry.key);
                itemElem.select('.tsi-instanceCount').text(entry.item.cumulativeInstanceCount);
            } else {
                const nameSpan = itemElem.select('.tsi-name');
                nameSpan.html('');
                Utils.appendFormattedElementsFromString(nameSpan, owner.instanceNodeStringToDisplay(entry.item));
            }

            entry.item.node = li;

            if (entry.item.children) {
                entry.item.isExpanded = true;
                li.classed('tsi-expanded', true);
                // recurse using TreeRenderer to keep rendering logic centralized
                TreeRenderer.render(owner, entry.item.children, li);
            } else {
                li.classed('tsi-expanded', false);
                li.selectAll('ul').remove();
            }
        });
    }
}
