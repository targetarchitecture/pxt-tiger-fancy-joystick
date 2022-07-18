input.onButtonPressed(Button.A, function () {
    joystick.Gamepad_shock(1000)
    basic.pause(1000)
    joystick.Gamepad_shock(0)
})

let prev_thumbstick_left = -1
let prev_thumbstick_right = -1
let prev_button_left = -1
let prev_button_right = -1

function DetectJoystickCommands () {
    left_x = joystick.ReadStickAxis(Stick.LEFT, Axis.X_AXIS)
    left_y = joystick.ReadStickAxis(Stick.LEFT, Axis.Y_AXIS)
    right_x = joystick.ReadStickAxis(Stick.RIGHT, Axis.X_AXIS)
    right_y = joystick.ReadStickAxis(Stick.RIGHT, Axis.Y_AXIS)
    sendRadioMessage("" + left_x + ":" + left_y + ":" + right_x + ":" + right_y)
    led.toggle(2, 2)
    
    let thumbstick_left = joystick.buttonStatus(buttons.THUMBSTICK_LEFT)
    let thumbstick_right = joystick.buttonStatus(buttons.THUMBSTICK_RIGHT)
    let button_left = joystick.buttonStatus(buttons.BUTTON_LEFT)
    let button_right = joystick.buttonStatus(buttons.BUTTON_RIGHT)

    serial.writeValue("TL", thumbstick_left)
    serial.writeValue("TR", thumbstick_right)
    serial.writeValue("BL", button_left)
    serial.writeValue("BR", button_right )

    //check for button clicks
    if (prev_thumbstick_left == 0 && thumbstick_left == 1){
        led.toggle(0, 2)
    }
    prev_thumbstick_left = thumbstick_left

    if (prev_button_left == 0 && button_left == 1) {
        led.toggle(0, 2)
    }
    prev_button_left = button_left

    if (prev_thumbstick_right == 0 && thumbstick_right == 1) {
        led.toggle(4, 2)
    }
    prev_thumbstick_right = thumbstick_right

    if (prev_button_right == 0 && button_right == 1) {
        led.toggle(4, 2)
    }
    prev_button_right = button_right

    // if (joystick.buttonStatus(buttons.BUTTON_LEFT_L) == key_status.SINGLE_CLICK ) {
    //     sendRadioMessage("BUTTON_LEFT_L")
    //     led.toggle(0, 2)
    // }
    // if (joystick.isButtonPressed(buttons.BUTTON_RIGHT_R)) {
    //     sendRadioMessage("BUTTON_RIGHT_R")
    //     led.toggle(4, 2)
    // }
}
input.onButtonPressed(Button.B, function () {
    joystick.SetBuzzer(202)
    basic.pause(1000)
    joystick.SetBuzzer(0)
})
function sendRadioMessage (message: string) {
    radio.sendString(message)
    lastCommandSend = control.millis()
}
let right_y = 0
let right_x = 0
let left_y = 0
let left_x = 0
let lastCommandSend = 0
lastCommandSend = control.millis()
radio.setTransmitPower(7)
radio.setFrequencyBand(76)
radio.setGroup(76)
radio.setTransmitSerialNumber(true)
sendRadioMessage("START")
basic.showIcon(IconNames.Heart)
// basic.pause(100)
basic.forever(function () {
    DetectJoystickCommands()
})
