const { NearScanner } = require('@toio/scanner')

//func of move to target
function goTarget(targetX, targetY, toioX, toioY, toioAngle) {
    const diffX = targetX - toioX
    const diffY = targetY - toioY
    const distance = Math.sqrt(diffX * diffX + diffY * diffY)

    if (distance < 50) {
        return [0, 0] // stop
    }

    let relAngle = (Math.atan2(diffY, diffX) * 180) / Math.PI - toioAngle
    relAngle = relAngle % 360
    if (relAngle < -180) {
        relAngle += 360
    } else if (relAngle > 180) {
        relAngle -= 360
    }

    const ratio = 1 - Math.abs(relAngle) / 90
    let speed = 80
    if (relAngle > 0) {
        return [speed, speed * ratio]
    } else {
        return [speed * ratio, speed]
    }
}

async function main() {
    const cubes = await new NearScanner(1).start()
    const toio = await cubes[0].connect()

    let targetX = 108 //targetX
    let targetY = 152 //targetY

    let toioX = 0 //X of toio
    let toioY = 0 //Y of toio
    let toioAngle = 0 //Angle of toio

    toio.turnOnLight({ durationMs: 0, red: 0, green: 0, blue: 255 })
    toio.on('id:position-id', data => {
        toioX = data.x
        toioY = data.y
        toioAngle = data.angle
    })

    // loop
    setInterval(() => {
        toio.move(...goTarget(targetX, targetY, toioX, toioY, toioAngle), 100)
    }, 50)
    
}

main()
