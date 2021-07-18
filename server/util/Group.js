const WebSocket = require("ws")

class Group {
  constructor(groupId, connection) {
    this.groupId = groupId
    this.connections = new Set([connection])
    console.log(`LOG | New Group ${this.groupId}`)
  }

  setMediaUrl(url) {
    this.mediaUrl = url
    this.connections.forEach(connection => {
      connection.send(
        JSON.stringify({
          command: "media",
          url: url
        })
      )
    })
  }

  setProgress(progress) {
    this.progress = progress
  }

  join(connection) {
    this.connections.add(connection)
    connection.send(JSON.stringify({ command: "media", url: this.mediaUrl }))
    connection.send(JSON.stringify({ command: "seek", time: this.progress }))

    console.log(
      `LOG | New Connection on ${this.groupId} - ${this.connections.size} clients.`
    )
  }

  leave(connection) {
    this.connections.delete(connection)

    console.log(
      `LOG | Connection closed on ${this.groupId} - ${this.connections.size} clients.`
    )
  }

  send(message) {
    this.connections.forEach(connection => {
      if (connection.readyState === WebSocket.OPEN) {
        connection.send(message)
        console.log("OUT |", message)
      } else {
        this.leave(connection)
      }
    })
  }

  isEmpty() {
    return this.connections.size === 0
  }
}

module.exports = Group
