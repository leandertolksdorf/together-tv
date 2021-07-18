const express = require("express")
const path = require("path")
const wsServer = require("./websocket")

const app = express()

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"))
})

const port = process.env.PORT || 4000

const server = app.listen(port)

server.on("upgrade", (req, sock, head) => {
  wsServer.handleUpgrade(req, sock, head, sock => {
    console.log("Upgraded connection to websocket.")
    wsServer.emit("connection", sock, req)
  })
})
