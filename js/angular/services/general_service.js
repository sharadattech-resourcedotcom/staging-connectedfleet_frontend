ngApp.factory('General', function () {  
 
     var containsElement = function(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id == obj.id) {
                return true;
            }
        }
        return false;
    };

    var removeElement = function(obj, list){
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id == obj.id) {
                list.splice(i,1);
                return true;
            }
        }
        return false;
    };

    return {
     containsElement: containsElement,
     removeElement: removeElement
    };
});