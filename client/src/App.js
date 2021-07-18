import { useState, useRef, useEffect } from "react"
import ReactPlayer from "react-player"
import { Link } from "wouter"
import style from "./App.module.css"
import Button from "./components/Button"

function App({ id }) {
  // Websocket
  const [ws, setWs] = useState(null)

  // Form and media source state
  const [inputUrl, setInputUrl] = useState("")
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false)

  // Player state
  const playerRef = useRef()
  const [mediaSource, setMediaSource] = useState()
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)

  const onSubmit = e => {
    if (e) {
      e.preventDefault()
    }
    const message = JSON.stringify({
      command: "media",
      url: inputUrl,
      groupId: id
    })
    ws.send(message)
  }

  // Player control handlers

  const toggleFullsreen = () => {
    if (!document.fullscreenElement) {
      document.getElementById(style.playerWrapper).requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const handleProgressBarClick = e => {
    const newProgress = e.nativeEvent.offsetX / e.target.offsetWidth
    const duration = playerRef.current.getDuration()
    const message = JSON.stringify({
      command: "seek",
      time: newProgress * duration,
      groupId: id
    })
    console.log(message, duration, newProgress)
    ws.send(message)
  }

  const handleReady = () => {}

  const handlePlay = () => {
    const message = JSON.stringify({
      command: "play",
      time: playerRef.current.getCurrentTime(),
      groupId: id
    })
    ws.send(message)
  }

  const handlePause = () => {
    const message = JSON.stringify({
      command: "pause",
      time: playerRef.current.getCurrentTime(),
      groupId: id
    })
    ws.send(message)
  }

  const handleProgress = ({ played }) => {
    setProgress(played)
    const message = JSON.stringify({
      command: "progress",
      time: played,
      groupId: id
    })
    ws.send(message)
  }

  // Other

  const handleInviteLinkCopy = () => {
    const element = document.getElementById("invite-link")
    element.select()
    element.setSelectionRange(0, 99999)

    document.execCommand("copy")
    setInviteLinkCopied(true)
  }

  const rickRoll = () => {
    var message = JSON.stringify({
      command: "media",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      groupId: id
    })
    ws.send(message)
    message = JSON.stringify({ command: "play", time: 0, groupId: id })
    ws.send(message)
  }

  useEffect(() => {
    const wsURL =
      process.env.NODE_ENV === "production"
        ? "wss://" + window.location.hostname + ":" + window.location.port
        : "ws://localhost:4000"

    const wsClient = new WebSocket(wsURL)

    window.onbeforeunload = function () {
      wsClient.onclose = function () {} // disable onclose handler first
      wsClient.close()
    }

    wsClient.onopen = () => {
      console.log("opened")
      wsClient.send(JSON.stringify({ command: "connected", groupId: id }))
    }

    wsClient.onmessage = message => {
      const payload = JSON.parse(message.data)
      // console.log("Received payload: ", payload)
      // setReceivedMessages([...receivedMessages, message.data])

      switch (payload.command) {
        case "media":
          setMediaSource(payload.url)
          break
        case "play":
          playerRef.current.seekTo(payload.time)
          setPlaying(true)
          break
        case "pause":
          setPlaying(false)
          playerRef.current.seekTo(payload.time)
          break
        case "seek":
          playerRef.current.seekTo(payload.time)
          break
        default:
          break
      }
    }
    setWs(wsClient)
  }, [id])

  return (
    <>
      <div
        className={style.app}
        style={{ animation: "fadeIn .5s ease-in-out" }}
      >
        <form id="media-source" className={style.form} onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter a source to play."
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
          ></input>
          <span className={style.sources}>
            YouTube | Vimeo | Dailymotion | Facebook | Mixcloud | Soundcloud |
            Twitch | Streamable | Video files | Audio files ...
          </span>
        </form>
        <div id={style.playerWrapper}>
          <div className={style.player}>
            <ReactPlayer
              className={style.reactPlayer}
              ref={playerRef}
              url={mediaSource}
              playing={playing}
              onReady={handleReady}
              onProgress={handleProgress}
              progressInterval={500}
              width="100%"
              height="100%"
            />
          </div>
          <div className={style.control}>
            <div
              className={style.progressBarWrapper}
              onClick={handleProgressBarClick}
            >
              <div
                className={style.progressBar}
                style={{
                  width: String(progress * 100) + "%"
                }}
              ></div>
            </div>
            <div className={style.playControl}>
              <img
                alt="play"
                className={style.playButton}
                onClick={() => (playing ? handlePause() : handlePlay())}
                src={playing ? "/pause.png" : "/play.png"}
              />
              <img
                alt="pause"
                className={style.fullscreenButton}
                onClick={toggleFullsreen}
                src="/fullscreen.png"
              />
            </div>
          </div>
        </div>
        <div className={style.buttons}>
          <Button onClick={handleInviteLinkCopy}>
            {inviteLinkCopied ? "✅" : "😃"}&nbsp; Copy invite link
          </Button>
          <Button href="/room/">🏠&nbsp;New room</Button>
        </div>
      </div>
      <input
        className={style.hidden}
        readOnly
        type="text"
        value={window.location}
        id="invite-link"
      />
      <div className={style.links}>
        <Link href="/imprint">Imprint</Link>
        <Link href="/about">About</Link>
        <Link href="#" onClick={rickRoll}>
          Free Bitcoin
        </Link>
      </div>
    </>
  )
}

export default App
