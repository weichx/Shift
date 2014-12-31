class TemplateBlock {
    private elements : Array<HTMLElement> = []; //actual html node references, not populated until inserted in dom
    private dirtyElementIndices : Array<number> = []; //list of element indices that need an update
    private blockStructure : TemplateBlockStructure;
    private template : Template;

    public isRendered : boolean;
    public renderUpdateFlag : TemplateBlockRenderFlag;
    public templateInterface : TemplateInterface;
    public parentBlock : TemplateBlock; //todo evaluate this system regarding loops in content

    constructor(template : Template, blockStructure : TemplateBlockStructure) {
        this.template = template;
        this.blockStructure = blockStructure;
        this.parentBlock = template.getBlock(blockStructure.parentBlockIndex);
        this.templateInterface = template.getInterface(TemplateInterface);
        this.renderUpdateFlag = TemplateBlockRenderFlag.Insert;
    }

    public evaluateForRendering(elementIndex : number, usage : number) : void {
        if (this.parentBlock && !this.parentBlock.isRendered) {
            return;
        }
        var shouldRenderThisFrame : boolean = this.blockStructure.blockFunction();
        if (shouldRenderThisFrame) {
            if (this.isRendered) {
                this.renderUpdateFlag = TemplateBlockRenderFlag.Update;
                this.dirtyElementIndices.push(elementIndex);
            } else {
                this.isRendered = true;
                this.renderUpdateFlag = TemplateBlockRenderFlag.Insert;
            }

        } else {
            if (this.isRendered) {
                this.isRendered = false;
                this.renderUpdateFlag = TemplateBlockRenderFlag.Remove;
            }
        }
    }

    public render() : void {
        switch (this.renderUpdateFlag) {
            case TemplateBlockRenderFlag.Update:
                this.renderUpdate();
                break;
            case TemplateBlockRenderFlag.Insert:
                this.renderInsert();
                break;
            case TemplateBlockRenderFlag.Remove:
                this.renderRemove();
                break;
        }
        this.dirtyElementIndices.splice(0, this.dirtyElementIndices.length);
        this.renderUpdateFlag = TemplateBlockRenderFlag.NoOp;
    }

    public renderUpdate() : void {
        var dirtyElementIndices = this.dirtyElementIndices;
        var interpolatedContent = this.blockStructure.interpolatedContent;
        var interpolatedContentIndices= this.blockStructure.interpolatedContentElementIndices;
        for(var i = 0, il = dirtyElementIndices.length; i < il; i++) {
            var elementIndex = dirtyElementIndices[i];
            var contentIndex = interpolatedContentIndices.indexOf(elementIndex);
            var content = interpolatedContent[contentIndex];
            var element = this.elements[elementIndex];
            element.textContent = this.stitchContent(content);
        }
    }

    public renderInsert() : void {
        //todo this should be profiled against something like crel
        var attachPoint = this.getAttachPoint();
        if(!attachPoint) return;
        var fragment = document.createDocumentFragment();
        var placeholder = document.createElement('div');
        placeholder.innerHTML = this.blockStructure.htmlString;
        var childNodes = placeholder.childNodes;
        this.traverseChildren(childNodes);
        for(var i = 0, il = childNodes.length; i < il; i++) {
            fragment.appendChild(childNodes[i]);
        }
        this.interpolateAllElements();
        attachPoint.appendChild(fragment);
        placeholder = null;
    }

    private getAttachPoint() : HTMLElement {
        if(this.parentBlock == null) {
            if(this.template.isRoot) {
                return document.body;
            } else {
                // attachPoint = template.parent.lastChild;
            }
        } else {
            //unsure of this
            //attachPoint = this.parentBlock.elements[this.parentBlock.elements.length -1];
        }
        return null;
    }

    private interpolateAllElements() : void {
        //go through and replace content of all interpolated elements
        var interpolatedContentSrc : Array<IElementContent> = this.blockStructure.interpolatedContent;
        var replacedContentIndices = this.blockStructure.interpolatedContentElementIndices;
        for(var i = 0, il = replacedContentIndices.length; i < il; i++) {
            var index = replacedContentIndices[i];
            var element = this.elements[index];
            element.textContent = this.stitchContent(interpolatedContentSrc[i]);
        }
    }

    private stitchContent(elementContent : IElementContent) : string {
        var retn = '';
        var isArray = Array.isArray;
        var content = elementContent.content;
        var variableNames = elementContent.variables;
        var templateInterface = this.templateInterface;
        for(var i = 0, il = variableNames.length; i < il; i++) {
            if(isArray(variableNames[i])) {
                retn += content[i] + followPropertyChain(this.templateInterface, variableNames[i]);
            } else {
                retn += content[i] + templateInterface[variableNames[i]];
            }
        }
        return retn + content[content.length - 1];
    }

    private traverseChildren(nodes) : void {
        for(var i = 0, il = nodes.length; i < il; i++) {
            var node = nodes[i];
            this.elements.push(node);
            if(node.hasChildNodes()) {
                this.traverseChildren(node.childNodes);
            }
        }
    }

    public renderRemove() : void {
        for(var i = 0, il = this.elements.length; i < il; i++) {
           this.elements[i] = null;
        }
        this.elements = [];
        //todo attachPoint.remove(this.elements[0]);
    }
}