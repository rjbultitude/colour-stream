let myCanvas;
let streamArr = [];
let streamNum = 20;
let noiseStart = 0.1;
let boundary = 10;
let stemLength;
let bodyLength;
let footLength;
const initScrollPos = document.documentElement.scrollTop || document.body.scrollTop;

function between(x, min, max) {
  return x >= min && x <= max;
}

class Stream {
  constructor (_leftPos, _rightPos, _noiseSeed, _alpha) {
    this.leftPos = _leftPos;
    this.rightPos = _rightPos;
    this.prevLeftPos;
    this.yPos = 0;
    this.noiseSeedNum = _noiseSeed;
    this.noiseSeedInc = random(0.001, 0.005);
    this.fillColor = color(random(100,255),random(100,255),random(0,255), _alpha);
  }
  paint() {
    noStroke();
    fill(this.fillColor);
    rect(this.leftPos, this.yPos, this.rightPos, 1);
  };

  update() {
    //vars
    let offset;

    this.noiseSeedNum += this.noiseSeedInc;
    const noiseStart = noise(this.noiseSeedNum);

    //draw if within canvas
    if (this.yPos < height) {
      this.yPos += 1;

      document.documentElement.scrollTop = document.body.scrollTop = initScrollPos - 240 + this.yPos;
    }

    //store previous position
    this.prevLeftPos = this.leftPos;

    const fc1 = frameCount/78;
    const fc2 = frameCount/76;
    const fc3 = frameCount/74;
    const fc4 = frameCount/72;

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
}


function setup() {
	myCanvas = createCanvas(600,1400);
	myCanvas.parent('canvas-container');
	background(0,0,0);
	stemLength = random(0,height/4);
	bodyLength = random(height/4, height/2);
	footLength = random(height/2, height);

	for (let i = 0; i < streamNum; i++) {
		const noiseSeedRandom = random(0.1, 1);
		const alphaAmt = 255/streamNum;
		const newStream = new Stream(i * 30, i * 30 + random(1,50), noiseSeedRandom, 255 - i * alphaAmt);
		streamArr.push(newStream);
	}

	const saveBtn = document.getElementById('save');
	saveBtn.addEventListener('click', function() {
		saveCanvas(myCanvas, 'waterfall', 'png');
	});
}

function draw() {
	for (let i = 0; i < streamArr.length; i++) {
		streamArr[i].update();
		streamArr[i].paint();
	}
}
