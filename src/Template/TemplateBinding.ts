class BindingHolder {
    public context : Object;
    public property : string;
}

//todo beware of memory leaks
class Bindings {
    static templateBinding : BindingHolder = new BindingHolder();
    static objectBinding : BindingHolder = new BindingHolder();
    static currentBinding : BindingHolder = Bindings.templateBinding;

    static set(context : Object, propertyName : string) {
        Bindings.currentBinding.context = context;
        Bindings.currentBinding.property = propertyName;
        Bindings.currentBinding = Bindings.objectBinding;
    }

    static reset(templateContext : Object, templatePropertyName : string) : void {
        Bindings.templateBinding.context = templateContext;
        Bindings.templateBinding.property = templatePropertyName;
        Bindings.objectBinding.context = null;
        Bindings.objectBinding.property = null;
        Bindings.currentBinding = Bindings.objectBinding;
    }

}