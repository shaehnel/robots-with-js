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
var shapes = [];
shapes.push(heart);
shapes.push(heart2);
shapes.push(blank);

var board = new five.Board({
  port: new EtherPortClient({
    host: "192.168.1.119",
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
        leftSpeed = 0;
        rightSpeed = 0;
        console.log('Stopping');
        this.setSpeed();   
        this.matrix.on();
    },
    setSpeed : function() {
      console.log('Set speed '+leftSpeed + ' '+ rightSpeed);

      this.leftWheel.setPWM(15, leftSpeed * 300);
      this.leftWheel.setPin(13, (leftSpeed >= 0)?0:1);

      this.rightWheel.setPWM(14, rightSpeed * 300);
      this.rightWheel.setPin(12, (rightSpeed >= 0)?0:1);
    },
    incLeftSpeed : function() {
      leftSpeed++;
      this.setSpeed();
    },
    incRightSpeed : function() {
      rightSpeed++;
      this.setSpeed();
    },

    decLeftSpeed : function() {
      leftSpeed--;
      this.setSpeed();
    },
    decRightSpeed : function() {
      rightSpeed--;
      this.setSpeed();
    },
    blinkShape : function() {
      robot.shape++;
      if (robot.shape > shapes.length) {
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
    } else if ( key.name === 's') {
      robot.decLeftSpeed();
      robot.decRightSpeed();
    } else if ( key.name === 'a') {
      robot.incLeftSpeed();
      robot.decRightSpeed();
    } else if ( key.name === 'd') {
      robot.decLeftSpeed();
      robot.incRightSpeed();
    } else if ( key.name === 'space' ) {
      robot.stop();
    }

  });

});
