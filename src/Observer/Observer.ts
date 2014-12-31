class TemplateObserver {

    private markedPropertyNames : Array<string>;
    private context : Object;
    private observers : {[key : string] : Array<TemplateInterface>};

    constructor(ctx : Object) {
        this.context = ctx;
        this.markedPropertyNames = [];
        this.observers = {};
    }

    public subscribe(context : TemplateInterface, propertyToObserve : string) : TemplateObserver {
        //check for duplicate subscriptions
        var observers = this.observers[propertyToObserve] || [];
        if(observers.indexOf(context) === -1) {
            observers.push(context);
        }
        this.observers[propertyToObserve] = observers;
        return this;
    }

    public unsubscribe(context : TemplateInterface, property : string) {
        var propertyObservers = this.observers[property];
        for(var i = 0, il = propertyObservers && propertyObservers.length; i < il; i++) {
            if(propertyObservers[i] === context) {
                propertyObservers.splice(i, 1);
                return;
            }
        }
    }

    public mark(propertyName : string) {
        var markedPropertyNames = this.markedPropertyNames;
        if(markedPropertyNames.indexOf(propertyName) === -1) {
            markedPropertyNames.push(propertyName);
        }
    }

    public sweep() : void {
        for(var i = 0, il = this.markedPropertyNames.length; i < il; i++) {
            var propertyName = this.markedPropertyNames[i];
            var listeners = this.observers[propertyName];
            var value = this.context[propertyName];
            for(var j = 0, jl = listeners && listeners.length; j < jl; j++) {
                listeners[j].propertyChanged(propertyName, value);
            }
            console.log('swept', propertyName);
        }
        this.markedPropertyNames.splice(0, this.markedPropertyNames.length);
    }

    public dispose() : void {
        this.context = null;
        this.observers = null;
    }
}