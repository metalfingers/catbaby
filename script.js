var	dom = {
		get: function(elem){
			return document.querySelectorAll(elem);
		}
	},
	output = dom.get('#output')[0],
	frameString = "",
	hand,
	handPositionOnScreen,
	leftBox = dom.get('.active-cat')[0],
	rightBox = dom.get('.active-baby')[0],
	catBaby = {
		util: {
			addListeners: function(){
				dom.get('.action-item.start')
					.addEventListener('click', function(){
						dom.get('.action-item.start')
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
			makeCatBaby: function(elem1, elem2) {
				var catBabyFrag = document.createDocumentFragment(),
					catBabyPart1 = elem1.cloneNode(),
					catBabyPart2 = elem2.cloneNode();

				catBabyFrag.appendChild(catBabyPart1);
				catBabyFrag.appendChild(catBabyPart2);

				return catBabyElem;
			}
		},
		init: function(){

		}
	};

(window.controller = new Leap.Controller)
    .use('riggedHand')
    .connect();







controller.on('frame', function(frame){
	frameString = catBaby.util.concatData('frame_id', frame.id);

	// hands
	for(var i = 0, len = frame.hands.length; i < len; i++) {
		hand = frame.hands[i];
		handPositionOnScreen = hand.data('riggedHand.mesh').screenPosition(hand.fingers[1].tipPosition); //{x: [int], y: [int], z: [int]}

		frameString += catBaby.util.concatData('hand type', hand.type);
		frameString += catBaby.util.concatData('grab strength', hand.grabStrength);

		
		switch (hand.type){
			case 'right': 
				rightBox.style.left = handPositionOnScreen.x + 'px'; 
				rightBox.style.bottom = handPositionOnScreen.y + 'px';
				rightBox.style.zIndex = Math.floor(handPositionOnScreen.z);
				hand.grabStrength > 0.7 ? rightBox.classList.add('gripped') : rightBox.classList.remove('gripped');

				frameString += catBaby.util.concatData('right hand left', handPositionOnScreen.x + 'px');
				frameString += catBaby.util.concatData('right hand bottom', handPositionOnScreen.y + 'px');

				break;
			case 'left':
				leftBox.style.left = handPositionOnScreen.x + 'px'; 
				leftBox.style.bottom = handPositionOnScreen.y + 'px';
				leftBox.style.zIndex = Math.floor(handPositionOnScreen.z);
				hand.grabStrength > 0.7 ? leftBox.classList.add('gripped') : leftBox.classList.remove('gripped');

				frameString += catBaby.util.concatData('left hand left', handPositionOnScreen.x + 'px');
				frameString += catBaby.util.concatData('left hand bottom', handPositionOnScreen.y + 'px');
				break;
		}

	}

	// console.log('collision: ' + catBaby.util.isColliding(leftBox, rightBox));

	if(catBaby.util.isColliding(leftBox, rightBox) === true) {

	}

	output.innerHTML = frameString;

});