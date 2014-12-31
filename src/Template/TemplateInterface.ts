//todo templates should access the underscore prefixed variables in template interfaces to save a getter perf hit
//template interfaces must exactly match the signature of template for them to be compatible. This means that at runtime
//in order to swap out a template component's template, the new template and the old template must have the same signature

//template interfaces are generated from the interface declared in the template by the user.
class TemplateInterface {
    "@bind(templateInterface.value)";
    private subscriptions : Object = {};
    private propertyNameMapping : {[s : string] : string} = {};
    private bindCalled = true;
    private template : Template;

    //todo the getter for templateProperty will need to first reset the bindings to ensure we have the right order
    //todo handle case where object context exists but is not a derivative of our base object;
    public bind(templateVarPath : string) : TemplateInterface {
        //if (this.bindCalled) {
        //    throw new Error("You must call bind and then to in sequence");
        //}
        //if(Bindings.objectBinding[objectProperty] !== input) {
        //    barf
        //}
        ////t.bind(path).to(obj, path);
        ////var fn = function() {
        ////    this.fred;
        ////    this.george;
        ////    return 'name';
        ////};
        ////t.bind<string>('song').to = fn();
        ////
        ////var path = templateVarPath.split('.');
        ////var value = followPropertyChain(this, path);
        ////Bindings.clear();
        //template.song = bind<Song>(object.song);
        //this.bindCalled = true;
        return this;
    }

    public to(objectProperty) : void {
        if(!this.bindCalled) {
            throw new Error("Bind must be called before to");
        }
        this.bindCalled = false;

        //assert Bindings has two properties in it
    }
    //}, objectProperty : T) : void {
        //var templatePropertyName = Bindings.templateBinding.property;
        //var objectPropertyName = Bindings.objectBinding.property;
        //var objectContext = Bindings.objectBinding.context;
        ////ensure the object binding is coming from an application object
        //if(objectContext == null) {
        //    throw new Error("Bindings are only allowed from the context of an ApplicationObject");
        //}
        //if(!(objectPropertyName in Bindings.objectBinding.context)) {
        //    throw new Error("Object binding property is invalid");
        //}
        //if(Bindings.templateBinding.context !== this) {
        //    throw  new Error("Template binding property must originate from context of template from which bind is called");
        //}
        //if(!(templatePropertyName in this)) {
        //    throw new Error("Template binding property is invalid");
        //}
        //this.unsubscribe(templatePropertyName);
        //this.subscribe(objectContext, objectPropertyName, templatePropertyName);


    public setTemplate(template : Template) {
        this.template = template;
    }

    public propertyChanged(propertyName : string, propertyValue : any) {
        var selfPropertyName = this.propertyNameMapping[propertyName];
        this[selfPropertyName] = propertyValue;
        console.log('changed', selfPropertyName);
        this.template.propertyChanged(selfPropertyName);
    }

    private subscribe(context, property, selfProperty) {
        //for now assume that object is always there
        this.propertyNameMapping[property] = selfProperty;
        this.subscriptions[selfProperty] = context.__gen_observers.subscribe(this, property);
    }

    private unsubscribe(propertyName : string) : void {
        var subscription = this.subscriptions[propertyName];
        if(subscription) {
            delete this.propertyNameMapping[propertyName];
            subscription.unsubscribe(this, propertyName);
        }
    }

    public dispose() : void {
        this.template = null;
        for(var key in this.subscriptions) {
            if(this.subscriptions.hasOwnProperty(key)) {
                this.unsubscribe(key);
            }
        }
        this.subscriptions = null;
    }
}


class TemplateInterface0 extends TemplateInterface {
    public _value : number;
    public _someFlag : boolean;

    public get value() : number {
        Bindings.reset(this, 'value');
        return this._value;
    }

    public get someFlag() : boolean {
        Bindings.reset(this, 'someFlag');
        return this._someFlag;
    }
}