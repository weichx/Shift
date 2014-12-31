class Template {
    private blocks : Array<TemplateBlock> = []; //might make sense to make this a map w/ unique ids instead of updating all references when blocks are removed or having a sparse array
    private structure : TemplateStructure; //listing of all variables used in this template w/ their types and block descriptors
    private templateInterface : TemplateInterface; //definition and values of the template variables
    public isRoot : boolean = false;

    constructor(structure : TemplateStructure, templateInterface : TemplateInterface, blockStructures : Array<TemplateBlockStructure>) {
        this.structure = structure;
        this.templateInterface = templateInterface;
        this.templateInterface.setTemplate(this);
        for(var i = 0, il = blockStructures.length; i < il; i++) {
            this.blocks.push(new TemplateBlock(this, blockStructures[i]));
        }
    }

    public propertyChanged(changedProperty) : void {
        var affectedBlockDescriptors = this.structure.getBlockDescriptors(changedProperty);
        for (var i = 0, il = affectedBlockDescriptors.length; i < il; i++) {
            var blockDescriptor = affectedBlockDescriptors[i];
            var block = this.blocks[blockDescriptor.blockIndex];
            var elementIndex = blockDescriptor.elementIndex;
            var usage = blockDescriptor.usage;
            //maybe aggregate calls to this fn to invoke only once per frame
            block.evaluateForRendering(elementIndex, usage);
            //templateJobQueue.addJob(block, block.evaluateForRendering)
        }
    }

    public getBlock(id : number) : TemplateBlock {
        return this.blocks[id];
    }

    //used for loops
    public addBlock(block : TemplateBlock) : void {

    }

    //used for loops
    public removeBlock(block : TemplateBlock) : void {

    }

    public promoteToRoot() : void {
        this.isRoot = true;
        //attach to body
    }

    public static update() : void {
        //flush template jobs
    }

    public getInterface(type : new() => TemplateInterface) : TemplateInterface {
        if(this.templateInterface instanceof type) {
            return this.templateInterface;
        }
        return null;
    }

    //public evaluate() : void {
    //    for(var i = 0, il = this.blocks.length; i < il; i++) {
    //        console.log('evaluating');
    //        this.blocks[i].evaluateForRendering(0, 0);
    //    }
    //}

    public render() : void {
        for(var i = 0, il = this.blocks.length; i < il; i++) {
            this.blocks[i].render();
        }
    }
}

