const WebSocket = require("ws")
const Group = require("./util/Group")

const wsServer = new WebSocket.Server({ noServer: true })

const groups = {}

wsServer.on("connection", function onConnection(connection) {
  connection.on("close", function onClose() {
    const groupId = connection.groupId
    if (groupId == undefined) {
      return
    }

    groups[groupId].leave(connection)

    if (groups[groupId].isEmpty()) {
      delete groups[groupId]
    }
  })

  connection.on("message", function onMessage(message) {
    console.log("IN  |", message)
    const decoded = JSON.parse(message)
    const groupId = decoded.groupId
    switch (decoded.command) {
      case "connected":
        connection.groupId = decoded.groupId
        if (groups[groupId] === undefined) {
          groups[groupId] = new Group(groupId, connection)
        } else {
          groups[groupId].join(connection)
        }
        break
      case "progress":
        groups[groupId].setProgress(decoded.time)
        break
      case "media":
        groups[groupId].setMediaUrl(decoded.url)
        break
      default:
        groups[decoded.groupId].send(message)
    }
  })
})

module.exports = wsServer
