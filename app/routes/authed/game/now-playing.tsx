import {type FC, useEffect, useState} from "react"
import {
  type Coordinate,
  Game,
  getGameById,
  Move,
  type onMessageCallback,
  placeCoordinate,
  subscribeToGameUpdatesViaSse,
  subscribeToGameUpdatesViaWebSocket,
  Winner
} from "~/services/game-service"
import {useUser} from "~/contexts/user-context"
import Board from "~/routes/authed/game/board"
import {ArrowBackIosNewOutlined as LeftArrow} from "@mui/icons-material"

import waitingUrl from "~/images/waiting.svg"
import styles from "./now-playing.module.scss"
import {Button} from "@mui/material"
import {Link} from "react-router"

type NowPlayingProps = {
  readonly game: Game
}

const NowPlaying: FC<NowPlayingProps> = props => {
  const [game, setGame] = useState(props.game)
  const user = useUser()

  useEffect(() => {
    let websocket: WebSocket | null = null
    let eventSource: EventSource | null = null

    try {
      websocket = subscribeToGameUpdatesViaWebSocket(game.id, onMessageCallback)
    } catch (error) {
      console.error("Unable to connect to game updates via WebSockets. Attempting to connect via SSE...")
      eventSource = subscribeToGameUpdatesViaSse(game.id, onMessageCallback)
    }

    const intervalId = setInterval(async () => {
      let refresh = false

      if (websocket !== null && websocket.readyState === websocket.CLOSED) {
        websocket = subscribeToGameUpdatesViaWebSocket(game.id, onMessageCallback)
        refresh = true
      }

      if (eventSource !== null && eventSource.readyState === eventSource.CLOSED) {
        eventSource = subscribeToGameUpdatesViaSse(game.id, onMessageCallback)
        refresh = true
      }

      if (refresh) {
        const updatedGame: Game | null = await getGameById(game.id)

        if (updatedGame) {
          setGame(updatedGame)
        }
      }

    }, 1000)

    return () => {
      clearInterval(intervalId)

      try {
        websocket?.close()
        eventSource?.close()
      } catch (e) {
        console.debug(e)
      }
    }
  }, [game.id]
  )

  const onMessageCallback: onMessageCallback = (move: Move | null, winner: Winner | null) => {
    if (move !== null) {
      if (move.playerId !== user.id) {
        setGame(game => ({...game, moves: game.moves.concat(move)}))
      }
    } else if (winner !== null) {
      setGame(game => ({...game, winner}))
    }
  }

  const isTurn =
      game.winner == null &&
      (game.moves.length === 0 ?
        game.playerOneId === user.id : game.moves[game.moves.length - 1].playerId !== user.id)

  const onCellClick = async (coordinate: Coordinate) => {
    if (isTurn) {
      setGame(game => ({
            ...game,
            moves: game.moves.concat({playerId: user.id, coordinate: coordinate, performedAt: new Date()})
          }
        )
      )

      await placeCoordinate(game.id, coordinate)
    }
  }

  return (
    <div className={styles.nowPlaying}>
      { isTurn && <YourTurnBanner/>}
      <Board game={game} isTurn={isTurn} onCellClick={onCellClick}/>
      <Button variant="contained" className={styles.backButton}>
        <Link to="/home"><LeftArrow/>Main Menu</Link>
      </Button>
    </div>
  )
}

const YourTurnBanner = () =>
  <div className={styles.yourTurn}>
    <div>Your Turn</div>
    <img src={waitingUrl} alt="Your turn" className={styles.yourTurnImage}/>
  </div>

export default NowPlaying