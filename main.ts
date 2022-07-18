let leftx = 0
function DetectJoystickCommands () {
    leftx = 0
}


function sendRadioMessage(message: string) {
    radio.sendString(message)
    lastCommandSend = control.millis()
}

let lastCommandSend = 0
lastCommandSend = control.millis()
radio.setTransmitPower(7)
radio.setFrequencyBand(76)
radio.setGroup(76)
radio.setTransmitSerialNumber(true)
sendRadioMessage("JOYSTICK_START")

basic.forever(function () {
    DetectJoystickCommands()
    basic.pause(100)
})