var myCanvas;
var streamArr = [];
var streamNum = 20;
var noiseStart = 0.1;
var boundary = 10;
var stemLength;
var bodyLength;
var footLength;
var initScrollPos = document.documentElement.scrollTop || document.body.scrollTop;

function between(x, min, max) {
  return x >= min && x <= max;
}

function Stream(_leftPos, _rightPos, _noiseSeed, _alpha) {
	this.leftPos = _leftPos;
	this.rightPos = _rightPos;
	this.prevLeftPos;
	this.yPos = 0;
	this.noiseSeedNum = _noiseSeed;
	this.noiseSeedInc = random(0.001, 0.005);
	this.fillColor = color(random(100,255),random(100,255),random(0,255), _alpha);
}

Stream.prototype.paint = function() {
	noStroke();
	fill(this.fillColor);
	rect(this.leftPos, this.yPos, this.rightPos, 1);
};

Stream.prototype.update = function() {
	//vars 
	var angle;
	var offset;

	this.noiseSeedNum += this.noiseSeedInc;
	var noiseStart = noise(this.noiseSeedNum);

	//draw if within canvas
	if (this.yPos < height) {
		this.yPos += 1;

		document.documentElement.scrollTop = document.body.scrollTop = initScrollPos - 240 + this.yPos;
	}
	
	//store previous position
	this.prevLeftPos = this.leftPos;
	
	var fc1 = frameCount/78;
	var fc2 = frameCount/76;
	var fc3 = frameCount/74;
	var fc4 = frameCount/72;

	if (between(this.yPos, 0, stemLength)) {
		offset = sin(fc1);
	}
	else if (between(this.yPos, stemLength, bodyLength)) {
		offset = sin(fc2);
	}
	else if (between(this.yPos, bodyLength, footLength)) {
		offset = sin(fc3);
	}
	else {
		offset = sin(fc4);
	}
	this.leftPos = this.prevLeftPos + offset;
	this.rightPos = 30 * noiseStart + offset;
};

function setup() {
	myCanvas = createCanvas(600,1400);
	myCanvas.parent('canvas-container');
	background(0,0,0);
	stemLength = random(0,height/4);
	bodyLength = random(height/4, height/2);
	footLength = random(height/2, height);

	for (var i = 0; i < streamNum; i++) {
		var noiseSeedRandom = random(0.1, 1);
		var alphaAmt = 255/streamNum;
		var newStream = new Stream(i * 30, i * 30 + random(1,50), noiseSeedRandom, 255 - i * alphaAmt);
		streamArr.push(newStream);
	}

	var saveBtn = document.getElementById('save');
	saveBtn.addEventListener('click', function() {
		saveCanvas(myCanvas, 'waterfall', 'png');
	});
}

function draw() {
	for (var i = 0; i < streamArr.length; i++) {
		streamArr[i].update();
		streamArr[i].paint();
	}
}