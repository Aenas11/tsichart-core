import { C as Component } from './Component-C2OFsACF.js';
import './Enums-CjbndcX3.js';
import './Interfaces-DBBnA26W.js';

declare class ModelSearch extends Component {
    private hierarchies;
    private clickedInstance;
    private wrapper;
    private types;
    private instanceResults;
    private usedContinuationTokens;
    private contextMenu;
    private currentResultIndex;
    constructor(renderTarget: Element);
    ModelSearch(): void;
    render(environmentFqdn: string, getToken: any, hierarchyData: any, chartOptions: any): void;
    handleKeydown(event: any, ap: any): void;
    private closeContextMenu;
    private stripHits;
    private getInstanceHtml;
}

export { ModelSearch as default };
