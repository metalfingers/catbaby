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
		util: {
			addListeners: function(){
				dom.on('click leapTap', dom.get('.action-item.start'), function(e){
							dom.get('.start-screen')[0].classList.add('is-hidden');
							dom.get('.start-screen')[0].classList.add('game-started');
						});


					window.addEventListener('leapTap', function(e){
						// console.log(e.target);
					});

				
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
			makeCatBaby: function(elem1, elem2) {
				var catBabyFrag = document.createDocumentFragment(),
					catBabyPart1 = elem1.cloneNode(),
					catBabyPart2 = elem2.cloneNode();
		setStartBackground: function(){
			dom.get('.start-screen')[0].style.backgroundImage = 'url(./img/start-screen-'+ (Math.floor(Math.random() * (4 - 1 + 1)) + 1) +'.gif)';
		},

				catBabyFrag.appendChild(catBabyPart1);
				catBabyFrag.appendChild(catBabyPart2);

				return catBabyElem;
			}
		},
		init: function(){
			this.util.addListeners();
			this.setStartBackground();
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

	// if(catBaby.util.isColliding(pointerLeft, pointerRight) === true) {

	// }

	output.innerHTML = frameString;

});


controller.on('gesture', function(gesture){
	if (gesture.type === 'screenTap') {
		var cachedSelectableElems = catBaby.util.selectableElements();
		for(var i=0, len = catBaby.util.selectableElements().length; i < len; i++) {
			if (catBaby.util.isColliding(pointerLeft, cachedSelectableElems[i])) {
				cachedSelectableElems[i].classList.add('is-selected');
			}
			if (catBaby.util.isColliding(pointerRight, cachedSelectableElems[i])) {
				cachedSelectableElems[i].classList.add('is-selected');
			}
		}
	}
});
