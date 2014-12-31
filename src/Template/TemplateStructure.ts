class TemplateStructure {
    private descriptors : { [s:string] : Array<IBlockDescriptor>} = {};

    public getBlockDescriptors(variableName : string) : Array<IBlockDescriptor> {
        return this.descriptors[variableName];
    }

    public setBlockDescriptors(variableName : string, descriptors : Array<IBlockDescriptor>) {
        this.descriptors[variableName] = descriptors;
    }
}


//public valueBlockDescriptors : Array<IBlockDescriptor> = [{
//    blockIndex : 0,
//    usage : TemplateUsage.Content,
//    elementIndex : 0
//}, {
//    blockIndex : 1,
//    usage : TemplateUsage.Block,
//    elementIndex : null
//}];