var g6anim = {

    clearFn: function() {
    },

    /** stops at the last frame; does not repeat. */
    updateFrameFn: function( th, framePause, maxIndex ) {

	if( th.frameWithPauses === undefined ) {
	    if( th.frameOffset !== undefined ) {
		th.frameWithPauses = th.frameOffset * framePause;
	    }
	    else {
		th.frameWithPauses = 0;
	    }
	}
	else if( th.frameWithPauses <= framePause * maxIndex ) {
	    th.frameWithPauses++;
	}
	
	var localFrame = th.frameWithPauses / framePause;
	if( localFrame < 0 ) {
	    th.frame = Math.ceil( localFrame );
	}
	else {
	    th.frame = Math.floor( localFrame );
	}
    },
}
