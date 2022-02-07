let lastCommandSend = control.millis();
radio.setTransmitPower(7)
radio.setFrequencyBand(76)
radio.setGroup(76)
radio.setTransmitSerialNumber(true)
sendRadioMessage("MICROBIT_ID_START", IconNames.Heart);

input.onButtonPressed(Button.A, function () {
    sendRadioMessage("MICROBIT_ID_BUTTON_A", IconNames.Rollerskate);
})

input.onButtonPressed(Button.B, function () {
    sendRadioMessage("MICROBIT_ID_BUTTON_B", IconNames.Happy);
})

input.onButtonPressed(Button.AB, function () {
    sendRadioMessage("MICROBIT_ID_BUTTON_AB", IconNames.Duck);
})

input.onGesture(Gesture.Shake, function () {
    sendRadioMessage("MICROBIT_ID_GESTURE_SHAKE", IconNames.Diamond);
})

input.onGesture(Gesture.LogoUp, function () {
    sendRadioMessage("MICROBIT_ID_GESTURE_LOGOUP", IconNames.SmallSquare);
})

input.onGesture(Gesture.LogoDown, function () {
    sendRadioMessage("MICROBIT_ID_GESTURE_LOGODOWN", IconNames.Scissors);
})

input.onGesture(Gesture.ScreenUp, function () {
    sendRadioMessage("MICROBIT_ID_GESTURE_SCREENUP", IconNames.Pitchfork);
})

input.onGesture(Gesture.ScreenDown, function () {
    sendRadioMessage("MICROBIT_ID_GESTURE_SCREENDOWN", IconNames.Triangle);
})

input.onGesture(Gesture.TiltLeft, function () {
    sendRadioMessage("MICROBIT_ID_GESTURE_TILTLEFT", IconNames.Cow);
})

input.onGesture(Gesture.TiltRight, function () {
    sendRadioMessage("MICROBIT_ID_GESTURE_TILTRIGHT", IconNames.Target);
})

function sendRadioMessage(message: string, icon: IconNames) {
    radio.sendString(message)
    lastCommandSend = control.millis();
    basic.showIcon(icon)
}

loops.everyInterval(100, function() {
    if (control.millis() - lastCommandSend >= 1000){
        basic.clearScreen();
    }
})