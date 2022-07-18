function DetectJoystickCommands () {
    leftx = joystick.Gamepad_Wiggly(Stick.JOYSTICK_left_wi, Axis.JOYSTICK_X_Axis)
}
function sendRadioMessage (message: string) {
    radio.sendString(message)
    lastCommandSend = control.millis()
}
let leftx = 0
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
