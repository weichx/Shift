var followPropertyChain = function(templateInterface : TemplateInterface, properties) : any {
    var retn = templateInterface[properties[0]];
    for(var i = 1, il = properties.length; i < il; i++) {
        retn = retn[properties[i]];
    }
    return retn;
};