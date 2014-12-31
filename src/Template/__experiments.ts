//if i really need to i can collapse this into 1 array per variable and use the size of the BlockDescriptor to extract boundries or store in 1 int w/ bitwise fn to extract
var structure = {
    someFlag : [{
        blockIndex : 0,
        elementIndex : 2,
        usage : TemplateUsage.Content
    }],
    value : [{
        blockIndex : 0,
        elementIndex : 2,
        usage : TemplateUsage.Content
    }, {
        blockIndex : 0,
        elementIndex : 4,
        usage : TemplateUsage.Content
    }]
};

//var templateStructure = new TemplateStructure();
//var template = new Template(templateStructure, blockStructure);
//template.promoteToRoot();

//class AppObject {
//    public template : Template;
//    public templateInterface : TemplateInterface0;
//    public someFlag : boolean = true;
//
//    constructor() {
//        this.templateInterface = <TemplateInterface0>this.template.getInterface(TemplateInterface0);
//        this.templateInterface.bind<boolean>(this.templateInterface.someFlag, this.someFlag);
//    }
//}

//todo as part of building the template, convert dot notation access to bracket access
//the value is: {{value}}, isn't that nice?\
//the flag is: {{someFlag}}, nice!\
var rootBlockFn = function () {
    return true;
};
var block0 = {
    //note: any spaces between elements will fuck you up with text node placement
    contentString : "<div>content1<ul><li>content2</li><li>Song name: </li><li>Song playtime: </li></ul></div>",
    contentElementIndices : [1, 4, 6, 8],
    //for this to work will need to include empty strings to handle start and end of variable array
    //content array must always be variables.length + 1 in size
    content : [{
        content : ["the value is: ", " isn't that nice? the flag is: ", ", nice!"],
        variables : ['value', 'someFlag']
    }, {
        content : ["content: ", ""],
        variables : ['value']
    }, {
        content : ["Song name: ", ""],
        variables : [['song', 'name']]
    }, {
        content : ["Song playtime: ", ""],
        variables : [['song', 'playTime']]
    }],
    blockFn : rootBlockFn,
    parentBlock : null
};
var block_0 = new TemplateBlockStructure();
block_0.htmlString = block0.contentString;
block_0.blockFunction = block0.blockFn;
block_0.parentBlockIndex = null;
block_0.interpolatedContentElementIndices = [1, 4, 6, 8];
block_0.interpolatedContent = block0.content;

class Album {
    public name : string;
    constructor(title : string) {
        this.name = title;
    }
}

class Song {
    public _name : string;
    public playTime : number;
    public __gen_observers : TemplateObserver;
    public album : Album;
    constructor(name : string, playTime : number) {
        this.__gen_observers = new TemplateObserver(this);
        this._name = name;
        this.playTime = playTime;
        this.album = new Album('Title');
    }

    public set name(value : string) {
        this.__gen_observers.mark('name');
        this._name = value;
    }

    public get name() : string {
        Bindings.set(this, 'name');
        console.log('set binding');
        return this._name;
    }
}

class TemplateInterface1 extends TemplateInterface {
    public _value : string;
    public _someFlag : boolean;
    public _song : Song;

    public get value() : string {
        Bindings.reset(this, 'value');
        return this._value;
    }

    public set value(v : string) {
        this._value = v;
    }

    public get someFlag() : boolean {
        Bindings.reset(this, 'someFlag');
        return this._someFlag;
    }

    public get song() : Song {
        Bindings.reset(this, 'song');
        return this._song;
    }
}

var templateInterface : TemplateInterface1 = new TemplateInterface1();
var templateStructure : TemplateStructure = new TemplateStructure();
var valueDescriptors : Array<IBlockDescriptor> = [
    {
        blockIndex : 0,
        elementIndex : 1,
        usage : TemplateUsage.Content
    },
    {
        blockIndex : 0,
        elementIndex : 4,
        usage : TemplateUsage.Content
    }
];

var someFlagDescriptors : Array<IBlockDescriptor> = [
    {
        blockIndex : 0,
        elementIndex : 1,
        usage : TemplateUsage.Content
    }
];

/*
* There are two possible approaches for bindings. One is totally manual where you are forced to call .bind
* the other is via annotations where bind is called for you, which works great when there is only 1 controlling script
* but fails when two scripts both want to bind to the same value. Though that's kinda true with manual binding too*
* */
var s;
window.onload = function () {
    s = new Song("In My Life", 3000);
    templateInterface._value = "FUCKIN AWESOME";
    templateInterface._someFlag = true;
    templateInterface._song = new Song('For You', 3.14);
    templateStructure.setBlockDescriptors('value', valueDescriptors);
    templateStructure.setBlockDescriptors('someFlag', someFlagDescriptors);
    var template : Template = new Template(templateStructure, templateInterface, [block_0]);
    var album = s.album; // in theory we can tell from template that s.album must be observed
    templateInterface.bind('songs.0.name').to(s.name);//.to<string>(album.name);
    //templateInterface.bind('song.name').to(album.name);
    //templateInterface.bind.property().to();
    template.promoteToRoot();
    template.render();
    //var start = window.performance.now();
    //s.name = "What did I do";
    //s.__gen_observers.sweep();
    //template.render();
    //console.log(window.performance.now() - start);
};