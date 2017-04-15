let midiValue = 0;
let osc, envelope, fft, reverb, delay;
let instructions = 'the home row (asdf...) plays a synth! try it out'

setup = () => {
  createCanvas(displayWidth, .8*displayHeight);
  frameRate(30)
  osc = new p5.SinOsc();
  reverb = new p5.Reverb();
  delay = new p5.Delay();
  envelope = new p5.Env();
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);
  envelope.setRange(1, 0);
  reverb.process(osc,2,2,false); //source, seconds, decay, reverse
  delay.process(osc, .12, .4, 2300); //source, delay, feedback, lowpass
  osc.start();
  fft = new p5.FFT();
  noStroke();
};

draw = () => {
  clear()
  background(0)

  fill(255,255,255)
  textSize(50)
  text(instructions, 40, displayHeight/2.5)

  // map homerow to midi values ... b flat blues modded a bit
  if (keyIsDown(65)) {midiValue = 58, instructions = ''} //a
  else midiValue = 0;
  if (keyIsDown(83)) {midiValue = 61, instructions = ''} //s
  if (keyIsDown(68)) {midiValue = 63, instructions = ''} //d
  if (keyIsDown(70)) {midiValue = 64, instructions = ''} //f
  if (keyIsDown(71)) {midiValue = 65, instructions = ''} //g
  if (keyIsDown(72)) {midiValue = 68, instructions = ''} //h
  if (keyIsDown(74)) {midiValue = 70, instructions = ''} //j
  if (keyIsDown(75)) {midiValue = 73, instructions = ''} //k
  if (keyIsDown(76)) {midiValue = 75, instructions = ''} //l
  if (keyIsDown(186)) {midiValue = 76, instructions = ''} //;
  if (keyIsDown(222)) {midiValue = 77, instructions = ''} //'

  //Game of thrones melody first bar, right hand lower row
  if (keyIsDown(66)) {midiValue = 55} //B
  if (keyIsDown(78)) {midiValue = 60} //N
  if (keyIsDown(77)) {midiValue = 62} //M
  if (keyIsDown(188)) {midiValue = 63} //,
  if (keyIsDown(190)) {midiValue = 65} //.
  if (keyIsDown(191)) {midiValue = 67} ///
//
  let freqValue = midiToFreq(midiValue);
  osc.freq(freqValue);
  if (midiValue===0){osc.amp(0)}
  else osc.amp(1)
  if (keyIsDown()) {envelope.play(osc, 0, 0.1)}

  let spectrum = fft.analyze();

  for (let i = 0; i < spectrum.length*4; i++) {
    fill(spectrum[i], spectrum[i]/10, 140);//color,saturation,brightness

//p5 map takes (value,currentLow,currentHigh,targetLow,targetHigh) returns remapped num
    let x = map(i, 0, spectrum.length/18, 0, width);
    let h = map(spectrum[i], 0, 255, 0, height);

    rect(x, height/2, spectrum.length/100, -h/2);
    rect(x, height/2, -spectrum.length/100, h/2);
  }
}
