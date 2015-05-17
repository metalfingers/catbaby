var	dom = {
		get: function(elem){
			return document.querySelectorAll(elem);
		},
		on: function(events, elems, func){
			events.split(' ').forEach(function(e){
				for(var i = 0, len = elems.length; i < len; i++) {
					elems[i].addEventListener(e, func);
				}
			});
		}
	},
	output = dom.get('#output')[0],
	frameString = "",
	hand,
	handPositionOnScreen,
	pointerLeft = dom.get('.left-hand')[0],
	pointerRight = dom.get('.right-hand')[0],
	catBaby = {
		addListeners: function(){
			dom.on('click leapTap', dom.get('.action-item.start'), function(e){
						dom.get('.start-screen')[0].classList.add('is-hidden');
						dom.get('.start-screen')[0].classList.add('game-started');
					});

			window.addEventListener('leapTap', function(e){
				// console.log(e.target);
			});

			window.addEventListener('resize', function(){
				catBaby.setCanvasSize();
			});
			
		},
		randomRange: function(max, min){
			return Math.floor( Math.random() * (max - min + min) ) + min;
		},
		catTypes: ['grinning', 'joy', 'smiling', 'heart', 'wry', 'kissing', 'crying', 'weary'],
		babieTypes: [],
		cbCanvas: undefined,
		cbContext: undefined,
		getCBCanvas: function() {
			if (this.cbCanvas === undefined) {
				this.cbCanvas = dom.get('#cat-babies')[0];
				this.cbContext = this.cbCanvas.getContext('2d'); // probably shouldn't be setting this here
			}
			return this.cbCanvas;
		},
		setCanvasSize: function() {
			var canvas = this.getCBCanvas();
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			canvas.globalCompositeOperation = 'destination-over';
		},
		catPositions: [],
		babyPositions: [],
		catImageData: {},
		getCatImageData: function(){
			var canvas = this.getCBCanvas();
			for (var i in this.catTypes) {
				// draw the image
				this.cbContext.drawImage( dom.get( '.source-images .cat-' + this.catTypes[i] )[0], 0, 0, 100, 100);
				catBaby.cbContext.fillText(catBaby.catTypes[i], 0, 20);

				//cache the image
				catBaby.catImageData['cat-' + catBaby.catTypes[i] ] = catBaby.cbContext.getImageData(0, 0, 100, 100);

				//clear the canvas
				catBaby.cbContext.clearRect(0, 0, canvas.width, canvas.height );
	
			}
		},
		addCat: function() {
			var cat = {};

			cat.id = +(new Date()); // date to number in one easy step!
			cat.x =  0;
			cat.y = 0;
			cat.type = 'cat-' + this.catTypes[ this.randomRange( this.catTypes.length, 0) ];
			cat.imageData = this.catImageData[cat.type];
			this.catPositions.push(cat);
			// look at CRC.getImageData()
		},
		moveCats: function() {
			for (var cat in this.catPositions) {
				var thisCat = this.catPositions[cat];
				// update cat position
				thisCat.x = thisCat.x + 1;
				thisCat.y = thisCat.y;

				//draw cat
				this.moveThings(thisCat.imageData, thisCat.x, thisCat.y);
			}	
		},
		moveThings: function(elem, toX, toY) {
			this.cbContext.putImageData(elem, toX, toY);			
		},
		concatData: function (id, data){
			return id + ': ' + data + '<br>';
		},
	 	isColliding: function(elem1, elem2){
			var elem1Bounds = {
								x: elem1.getBoundingClientRect().left, 
								y: elem1.getBoundingClientRect().top, 
								width: elem1.getBoundingClientRect().width,
								height: elem1.getBoundingClientRect().height
							},
				elem2Bounds = {
								x: elem2.getBoundingClientRect().left, 
								y: elem2.getBoundingClientRect().top, 
								width: elem2.getBoundingClientRect().width,
								height: elem2.getBoundingClientRect().height
							};

			if (elem1Bounds.x < elem2Bounds.x + elem2Bounds.width &&
			   elem1Bounds.x + elem1Bounds.width > elem2Bounds.x &&
			   elem1Bounds.y < elem2Bounds.y + elem2Bounds.height &&
			   elem1Bounds.height + elem1Bounds.y > elem2Bounds.y) {
			    return true;
			} else {
				return false;
			}
		},
		touchPoints: function(){

		},
		selectableElements: function(){
			return dom.get('.box');
		},
		tapThrough: function(){

		},
		setStartBackground: function(){
			dom.get('.start-screen')[0].style.backgroundImage = 'url(./img/start-screen-'+ this.randomRange(4,1) +'.gif)';
		},
		makeCatBaby: function(elem1, elem2) {
			var catBabyFrag = document.createDocumentFragment(),
				catBabyPart1 = elem1.cloneNode(),
				catBabyPart2 = elem2.cloneNode();

			catBabyFrag.appendChild(catBabyPart1);
			catBabyFrag.appendChild(catBabyPart2);

			return catBabyElem;
		},
		onAnimationFrame: function() {
			window.requestAnimationFrame( catBaby.onAnimationFrame);
			// console.log('in anim');
			// catBaby.addCat();
			catBaby.moveCats();
		},
		init: function(){
			this.getCBCanvas();
			this.addListeners();
			this.getCatImageData();
			this.setStartBackground();
			this.setCanvasSize();
			this.onAnimationFrame();
		}
	};


	catBaby.init();

	(window.controller = new Leap.Controller)
	    .use('riggedHand', {
	    	materialOptions: {
		      wireframe: true
		    },
	    })
	    .connect();

    // adjust camera position so that we can touch most of the screen
    controller.plugins.riggedHand.camera.position.z = 200;





controller.on('frame', function(frame){

	// hands
	for(var i = 0, len = frame.hands.length; i < len; i++) {
		hand = frame.hands[i];
		handPositionOnScreen = hand.data('riggedHand.mesh').screenPosition(hand.fingers[1].tipPosition); //{x: [int], y: [int], z: [int]}
		
		switch (hand.type){
			case 'right': 
				pointerRight.style.left = handPositionOnScreen.x + 'px'; 
				pointerRight.style.bottom = handPositionOnScreen.y + 'px';
				pointerRight.style.zIndex = Math.floor(handPositionOnScreen.z);
				// hand.grabStrength > 0.7 ? pointerRight.classList.add('gripped') : pointerRight.classList.remove('gripped');
				break;
			case 'left':
				pointerLeft.style.left = handPositionOnScreen.x + 'px'; 
				pointerLeft.style.bottom = handPositionOnScreen.y + 'px';
				pointerLeft.style.zIndex = Math.floor(handPositionOnScreen.z);
				// hand.grabStrength > 0.7 ? pointerLeft.classList.add('gripped') : pointerLeft.classList.remove('gripped');
				break;
		}

	}

	// if(catBaby.isColliding(pointerLeft, pointerRight) === true) {

	// }

});


controller.on('gesture', function(gesture){
	if (gesture.type === 'screenTap') {
		var cachedSelectableElems = catBaby.selectableElements();
		for(var i=0, len = catBaby.selectableElements().length; i < len; i++) {
			if (catBaby.isColliding(pointerLeft, cachedSelectableElems[i])) {
				cachedSelectableElems[i].classList.add('is-selected');
			}
			if (catBaby.isColliding(pointerRight, cachedSelectableElems[i])) {
				cachedSelectableElems[i].classList.add('is-selected');
			}
		}
	}
});
