var keypress = require('keypress');
var five = require("johnny-five");

var EtherPortClient = require("etherport-client").EtherPortClient;

var heart = [
  "01100110",
  "10011001",
  "10000001",
  "10000001",
  "01000010",
  "00100100",
  "00011000",
  "00000000"
];
var heart2 = [
  "01100110",
  "11111111",
  "11111111",
  "11111111",
  "01111110",
  "00111100",
  "00011000",
  "00000000"
];
var blank = [
  "00000000",
  "00000000",
  "00000000",
  "00000000",
  "00000000",
  "00000000",
  "00000000",
  "00000000"
];

var smile = [
  "00111100",
  "01111110",
  "11011011",
  "11111111",
  "11011011",
  "11000011",
  "01111110",
  "00111100"
];

var smile2 = [
  "00111100",
  "01111110",
  "10110111",
  "11111111",
  "10110111",
  "10000111",
  "01111110",
  "00111100"
];
var smile3 = [
  "00111100",
  "01111110",
  "11101101",
  "11111111",
  "11101101",
  "11100001",
  "01111110",
  "00111100"
];
var eye1 = [
  "00111100",
  "01000010",
  "10011001",
  "10111101",
  "10111101",
  "10011001",
  "01000010",
  "00111100"
];
var eye2 = [
  "00111100",
  "01000010",
  "10110001",
  "11111001",
  "11111001",
  "10110001",
  "01000010",
  "00111100"
];
var eye3 = [
  "00111100",
  "01000010",
  "10001101",
  "10011111",
  "10011111",
  "10001101",
  "01000010",
  "00111100"
];
var shapes = [];
shapes.push(eye1);
shapes.push(eye2);
shapes.push(eye1);
shapes.push(eye3);

var board = new five.Board({
  port: new EtherPortClient({
    host: "192.168.1.35",
    port: 3030
  }),
  timeout: 1e5,
  repl: false
});

board.on("ready", function() {
  console.log("READY!");


  //leftWheel.setPWM(15,0);
  //leftWheel.setPin(13,0);

  //rightWheel.setPWM(14,0);
  //rightWheel.setPin(12,0);

  keypress(process.stdin);

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  console.log("press a key");

  var robot = {
    leftSpeed: 0,
    rightSpeed: 0,
    shape: 0,
    stop : function() {
        this.leftSpeed = 0;
        this.rightSpeed = 0;
        console.log('Stopping');
        this.setSpeed();   
        this.matrix.on();
    },
    setSpeed : function() {
      console.log('Set speed '+this.leftSpeed + ' '+ this.rightSpeed);

      this.leftWheel.setPWM(15, this.leftSpeed * 250);
      this.leftWheel.setPin(13, (this.leftSpeed >= 0)?0:1);

      this.rightWheel.setPWM(14, this.rightSpeed * 250);
      this.rightWheel.setPin(12, (this.rightSpeed >= 0)?0:1);
    },
    incLeftSpeed : function() {
      this.leftSpeed++;
      this.setSpeed();
    },
    incRightSpeed : function() {
      this.rightSpeed++;
      this.setSpeed();
    },
    decLeftSpeed : function() {
      this.leftSpeed--;
      this.setSpeed();
    },
    decRightSpeed : function() {
      this.rightSpeed--;
      this.setSpeed();
    },
    blinkShape : function() {
      robot.shape++;
      if (robot.shape == shapes.length) {
        robot.shape = 0;
      }
      robot.matrix.draw(shapes[robot.shape]);
      setTimeout(robot.blinkShape, 500);
    },
    leftWheel: new five.Motor({ pins: { pwm: 15, dir: 13}}),
    rightWheel: new five.Motor({ pins: { pwm: 14, dir: 12}}),
    matrix: new five.Led.Matrix({
      addresses: [0x70],
      controller: "HT16K33",
      rotation: 3
    })
  };

  robot.stop();
  robot.blinkShape();

  process.stdin.on('keypress', function (ch, key) {

    if ( !key ) { return; }

    if ( key.name === 'q' ) {
      console.log('Quitting');
      process.exit();
    } else if ( key.name === 'w') {
      robot.incLeftSpeed();
      robot.incRightSpeed();
      process.stdin.pause();
    } else if ( key.name === 's') {
      robot.decLeftSpeed();
      robot.decRightSpeed();
      process.stdin.pause();
    } else if ( key.name === 'a') {
      robot.incLeftSpeed();
      robot.decRightSpeed();
      process.stdin.pause();
    } else if ( key.name === 'd') {
      robot.decLeftSpeed();
      robot.incRightSpeed();
      process.stdin.pause();
    } else if ( key.name === 't') {
      robot.rightSpeed = 4;
      robot.leftSpeed = 4;
      robot.setSpeed();
      process.stdin.pause();
    } else if ( key.name === 'g') {
      robot.rightSpeed = -4;
      robot.leftSpeed = -4;
      robot.setSpeed();
      process.stdin.pause();
    } else if ( key.name === 'space' ) {
      robot.stop();
      process.stdin.pause();
    }
    process.stdin.resume();

  });

});
