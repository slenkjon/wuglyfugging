window.addEventListener('load', loadResources, false);

function loadResources() {
    help.akihabaraInit('8by5');
    gbox.addImage('font', 'font.png');
    gbox.addImage('logo', 'logo.jpg');
    gbox.addFont({ id: 'small', image: 'font', firstletter: ' ', tileh: 8, tilew: 8, tilerow: 255, gapx: 0, gapy: 0 });
    gbox.setCallback(main);
    gbox.loadAll();
}

function main() {
    gbox.setGroups(['game']);
    maingame = gamecycle.createMaingame('game', 'game');

    maingame.gameTitleIntroAnimation=function(reset) { 
	if (reset) {
	    toys.resetToy(this, 'rising');
	}

	gbox.blitFade(gbox.getBufferContext(),{ alpha: 1 }); 

	toys.logos.linear(this, 'rising', {
	    image: 'logo',
	    sx:    gbox.getScreenW()/2-gbox.getImage('logo').width/2,
	    sy:    gbox.getScreenH(),
	    x:     gbox.getScreenW()/2-gbox.getImage('logo').width/2,
	    y:     20,
	    speed: 1
	});
    };

    gbox.go();
}
