class SmartArrayBase {
}
SmartArrayBase.prototype = [];

interface IArrayObserverElementGet<T> {
    onElementGet : (number, T) => void;
}

interface IArrayObserverElementSet<T> {
    onElementSet : (number, T) => void;
}

interface IArrayObserverElementRemoved<T> {
    onElementRemoved : (number, T) => void;
}

interface IArrayObserverElementAdded<T> {
    onElementAdded : (number, T) => void;
}

interface IArrayObserverElementIndexChanged<T> {
    onElementIndexChanged : (number, T) => void;
}

interface IArrayObserverArraySizeChanged<T> {
    onArraySizeChanged(oldSize : number, newSize : number);
}


interface IArrayObserver<T> {
    onElementGet? : (number, T) => void;
    onElementSet? : (number, oldValue : T, newValue : T) => void;
    onElementRemoved? : (T) => void;
    onElementAdded? : (number, T) => void;
    onElementIndexChanged?: (number, T) => void;
    onArraySizeChanged? : (oldSize : number, newSize : number) => void;
}

//ISSUES: When smartArray.length is set, there is a strong chance we cannot figure this out. Always clear with splice or clear()
class SmartArray<T> extends SmartArrayBase implements Array<T> {
[index : number] : T;

    public length;
    private backingStore : Array<T>;
    private ignoreEvents = false;
    private observersByElement : {[index : number] : IArrayObserver<T> };
    private static totalGrowth : number = 0;
    private listeners = {
        onElementGet : [],
        onElementSet : [],
        onElementAdded : [],
        onElementRemoved : [],
        onElementIndexChanged : [],
        onArraySizeChanged : []
    };

    constructor(...args : Array<T>) {
        super();
        var instanceArray = new Array<T>(0);
        instanceArray['backingStore'] = args;
        instanceArray['__proto__'] = SmartArray.prototype;
        return <SmartArray<T>>instanceArray;
    }

    public registerElementGet<U extends IArrayObserverElementGet<T>>(listener : U) : void {
        this.listeners.onElementGet.push(listener);
    }

    public registerElementSet<U extends IArrayObserverElementSet<T>>(listener : U) : void {

    }

    public registerElementRemoved<U extends IArrayObserverElementRemoved<T>>(listener : U) : void {

    }

    public registerElementAdded<U extends IArrayObserverElementAdded<T>>(listener : U) : void {

    }

    public registerElementIndexChanged<U extends IArrayObserverElementIndexChanged<T>>(listener : U) : void {

    }

    public registerArraySizeChanged<U extends IArrayObserverArraySizeChanged<T>>(listener : U) : void {

    }

    public unregisterElementGet<U extends IArrayObserverElementGet<T>>(listener : U) : void {
        //remove listener
        //this.listeners.onElementGet.splice(listener);
    }

    public unregisterElementSet<U extends IArrayObserverElementSet<T>>(listener : U) : void {

    }

    public unregisterElementRemoved<U extends IArrayObserverElementRemoved<T>>(listener : U) : void {

    }

    public unregisterElementAdded<U extends IArrayObserverElementAdded<T>>(listener : U) : void {

    }

    public unregisterElementIndexChanged<U extends IArrayObserverElementIndexChanged<T>>(listener : U) : void {

    }

    public unregisterArraySizeChanged<U extends IArrayObserverArraySizeChanged<T>>(listener : U) : void {

    }

    private grow(size : number) : void {
        if (SmartArray.totalGrowth >= this.length + size) return;
        var props : PropertyDescriptorMap = {};
        for (var i = this.length; i < this.length + size; i++) {
            props['' + i] = this.createGetterSetter('' + i);
        }
        Object.defineProperties(SmartArray.prototype, props);
    }

    private createGetterSetter(iString : string) : PropertyDescriptor {
        return {
            get : function () {
                if(!this.ignoreEvents) {
                    this.elementGet(+iString, this.backingStore[iString]);
                }
                return this.backingStore[iString];
            },
            set : function (value) {
                var oldValue = this.backingStore[iString];
                if (!this.ignoreEvents && (oldValue !== value)) {
                    this.elementSet(+iString | 0, oldValue, value);
                }
                this.backingStore[iString] = value;
            },
            enumerable : true,
            configurable : true
        }
    }

    private elementGet(index : number, value : T) {
        console.log('Got element ' + index);
        var listeners = this.listeners.onElementGet;
        for (var i = 0, il = listeners.length; i < il; i++) {
            listeners[i].onElementGet(index, value);
        }
    }

    private elementSet(index : number, oldValue : T, newValue : T) {
        console.log('Set element ' + index);
        var listeners = this.listeners.onElementSet;
        for (var i = 0, il = listeners.length; i < il; i++) {
            listeners[i].onElementSet(index, oldValue, newValue);
        }
    }

    private elementAdded(index : number, element : T) {
        console.log('Added element ' + index);
        var listeners = this.listeners.onElementAdded;
        for (var i = 0, il = listeners.length; i < il; i++) {
            listeners[i].onElementAdded(index, element);
        }
    }

    private elementRemoved(element : T) {
        console.log('removed element');
        var listeners = this.listeners.onElementRemoved;
        for (var i = 0, il = listeners.length; i < il; i++) {
            listeners[i].onElementRemoved(element);
        }
    }

    private elementChangedIndex(element : T, oldIndex : number, newIndex : number) {
        console.log('changed index ', oldIndex, newIndex);
        var listeners = this.listeners.onElementIndexChanged;
        for (var i = 0, il = listeners.length; i < il; i++) {
            listeners[i].onElementIndexChanged(element);
        }
    }

    private arraySizeChanged(oldSize : number, newSize : number) {
        console.log('array size changed', oldSize, newSize);
        var listeners = this.listeners.onArraySizeChanged;
        for (var i = 0, il = listeners.length; i < il; i++) {
            listeners[i].onArraySizeChanged(oldSize, newSize);
        }
    }

    public push(...items : T[]) : number {
        return Array.prototype.push.apply(this.backingStore, items);
    }

    public concat<U extends T>(...items : T[]) : T[] {
        //todo grow to length
        return Array.prototype.concat.apply(this.backingStore, items);
    }

    public every(callbackfn : (value : T, index : number, array : T[]) => boolean, thisArg? : any) : boolean {
        return Array.prototype.every.call(this.backingStore, callbackfn, thisArg);
    }

    public filter(callbackfn : (value : T, index : number, array : T[]) => boolean, thisArg? : any) : T[] {
        return Array.prototype.filter.call(this.backingStore, callbackfn, thisArg);
    }

    public forEach(callbackfn : (value : T, index : number, array : T[]) => void, thisArg? : any) : void {
        Array.prototype.forEach.call(this.backingStore, callbackfn, thisArg);
    }

    public indexOf(searchElement : T, fromIndex? : number) : number {
        return Array.prototype.indexOf.call(this.backingStore, searchElement, fromIndex);
    }

    public lastIndexOf(searchElement : T, fromIndex? : number) : number {
        return Array.prototype.lastIndexOf.call(this.backingStore, searchElement, fromIndex);
    }

    public join(separator? : string) : string {
        return Array.prototype.join.call(this.backingStore, separator);
    }

    public map<U>(callbackfn : (value : T, index : number, array : T[]) => U, thisArg? : any) : U[] {
        return Array.prototype.map.call(this.backingStore, callbackfn, thisArg);
    }

    public pop() : T {
        this.length = this.length - 1;
        return Array.prototype.pop.call(this.backingStore);
    }

    public reduce<U>(callbackfn : (previousValue : U, currentValue : T, currentIndex : number, array : T[]) => U, initialValue : U) : U;
    public reduce(callbackfn : (previousValue : T, currentValue : T, currentIndex : number, array : T[]) => T, initialValue? : T) : T {
        return Array.prototype.reduce.call(this.backingStore, callbackfn, initialValue);
    }

    public reduceRight<U>(callbackfn : (previousValue : U, currentValue : T, currentIndex : number, array : T[]) => U, initialValue : U) : U;
    public reduceRight(callbackfn : (previousValue : T, currentValue : T, currentIndex : number, array : T[]) => T, initialValue? : T) : T {
        return Array.prototype.reduceRight.call(this.backingStore, callbackfn, initialValue);
    }


    public reverse() : T[] {
        return Array.prototype.reverse.call(this.backingStore);
    }

    public shift() : T {
        //remove first element
        //change length
        //fire index changed() once for each element
        return Array.prototype.shift.call(this.backingStore);
    }

    public splice(start : number) : T[] {
        return Array.prototype.splice.call(this.backingStore, start);
    }

    public unshift(...items : T[]) : number {
        this.grow(1);
        return Array.prototype.unshift.call(this.backingStore, items);
    }

    public slice(start? : number, end? : number) : T[] {
        return Array.prototype.slice.call(this, start, end);
    }

    public sort(compareFn? : (a : T, b : T) => number) : T[] {
        return Array.prototype.sort.call(this, compareFn);
    }

    public some(callbackfn : (value : T, index : number, array : T[]) => boolean, thisArg? : any) : boolean {
        return Array.prototype.some.call(this, callbackfn, thisArg);
    }

    public toString() : string {
        return this.backingStore.toString();
    }

    public toLocaleString() : string {
        return this.backingStore.toLocaleString();
    }
}
