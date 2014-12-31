class Parser {
    public blocks : Array<TemplateBlockStructure> = [];
    public currentBlock : TemplateBlockStructure;

    private lastNodeWasContent : boolean = false;

    public parse(ast) {
        console.log(ast);
        this.visit(ast);
        console.log(this.blocks[0].htmlString);
        console.log(this.blocks[0]);
    }

    public visit(ast) {
        console.log(ast.type);
        switch (ast.type) {
            case 'content':
                this.visitContent(ast);
                break;
            case 'comment':
                break;
            case 'mustache':
                this.visitMustache(ast);
                break;
            case 'partial':
                break;
            case 'block':
                break;
            case 'program':
                this.visitProgram(ast);
                break;
        }

    }

    private visitContent(ast) {
        var str = ast.string.replace(/\n|\r/g, "").replace(/\t/g, "").trim();
        var openIndex = str.indexOf('<');
        var closeIndex = str.lastIndexOf('>');
        if(closeIndex !== -1) {
            this.currentBlock.htmlString += str.substr(0, closeIndex + 1);
            str = str.substr(closeIndex + 1, str.length);
            console.log(str);
            this.lastNodeWasContent = true;
        }
        
        //get tail end of node
        //see if next element is a mustache and a variable
        //if it is, put self in content array
        //this.currentBlock.htmlString += '';
    }

    private visitComment() {

    }

    private visitMustache(ast) {
        //assume variable for now
        if(this.lastNodeWasContent) {

        }
        var variableName = ast.id.string;
        console.log('mustache: ' + variableName);
        this.currentBlock.pushVariable(variableName);
    }

    private visitPartial() {

    }

    private visitBlock() {

    }

    private visitProgram(ast) {
        this.currentBlock = new TemplateBlockStructure();
        var statements = ast.statements;
        console.log(statements.length);
        for (var i = 0, il = statements.length; i < il; i++) {
           this.visit(statements[i]);
        }
        this.blocks.push(this.currentBlock);
    }
}