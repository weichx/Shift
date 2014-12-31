interface IBlockDescriptor {
    blockIndex : number;
    usage : TemplateUsage;
    elementIndex : number;
}

interface IElementContent {
    content: Array<string>;
    variables: any[]; //todo replace with union string|Array<string> when typescript 1.4 comes out
}
