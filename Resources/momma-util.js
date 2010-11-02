var g6util = {

    clearFn: function() {
    },

    startsWith: function( fullString, prefix ) {
	var regexp = new RegExp( "^" + prefix );
	var found = fullString.match( regexp );
	return found !== null;
    },

    randomCentered: function( radius ) {
	return (Math.random() * radius*2) - radius;
    },
    
}
