class TemplateBlockStructure {
    public htmlString : string = '';
    public blockFunction : () => boolean;
    public parentBlockIndex : number;
    public interpolatedContent : Array<any> = []; //todo change back to IElementContent when typescript 1.4 comes out
    public interpolatedContentElementIndices: Array<number>;

    public startContent() : void {
        this.interpolatedContent.push({
            content: [],
            variables: []
        })
    }


    public pushContent(content : string) : void {

    }

    public pushVariable(varName : string) : void {
       // this.interpolatedContent[this.interpolatedContent.length - 1].variables.push(varName);
    }
}