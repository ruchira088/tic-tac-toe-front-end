import {type FC, useEffect, useState} from "react"
import {
  type Coordinate,
  Game as GameSchema,
  type Game,
  getGameById,
  type Message,
  move,
  Move,
  subscribeToGameUpdatesViaSse,
  subscribeToGameUpdatesViaWebSocket,
  Winner
} from "~/services/game-service"
import {useUser} from "~/contexts/user-context"
import {z, type ZodTypeAny} from "zod"
import Board from "~/routes/authed/game/board"

import waitingUrl from "~/images/waiting.svg"
import styles from "./now-playing.module.scss"
import {Button} from "@mui/material"

type NowPlayingProps = {
  readonly game: Game
}

function check<T extends ZodTypeAny>(schema: T, value: unknown): value is z.infer<T> {
  return schema.safeParse(value).success
}

const NowPlaying: FC<NowPlayingProps> = props => {
  const [game, setGame] = useState(props.game)
  const user = useUser()

  useEffect(() => {
    let websocket: WebSocket | null = null
    let eventSource: EventSource | null = null

    try {
      websocket = subscribeToGameUpdatesViaWebSocket(game.id, onMessage)
    } catch (error) {
      console.error("Unable to connect to game updates via WebSockets. Attempting to connect via SSE...")
      eventSource = subscribeToGameUpdatesViaSse(game.id, onMessage)
    }

    const intervalId = setInterval(async () => {
      let refresh = false

      if (websocket !== null && websocket.readyState === websocket.CLOSED) {
        websocket = subscribeToGameUpdatesViaWebSocket(game.id, onMessage)
        refresh = true
      }

      if (eventSource !== null && eventSource.readyState === eventSource.CLOSED) {
        eventSource = subscribeToGameUpdatesViaSse(game.id, onMessage)
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
      websocket?.close()
      eventSource?.close()
      clearInterval(intervalId)
    }
  }, [game.id]
  )

  const onMessage = (message: Message) => {
    if (check(Move, message)) {
      const move: Move = message
      if (move.playerId !== user.id) {
        setGame(game => GameSchema.parse({...game, moves: game.moves.concat(move)}))
      }
    } else if (check(Winner, message)) {
      const winner: Winner = message
      setGame(game => GameSchema.parse({...game, winner}))
    }
  }

  const isTurn =
      game.winner == null &&
      (game.moves.length === 0 ?
        game.playerOneId === user.id : game.moves[game.moves.length - 1].playerId !== user.id)

  const onCellClick = async (coordinate: Coordinate) => {
    if (isTurn) {
      setGame(game => GameSchema.parse({
            ...game,
            moves: game.moves.concat({playerId: user.id, coordinate: coordinate, performedAt: new Date()})
          }
        )
      )

      await move(game.id, coordinate)
    }
  }

  return (
    <div className={styles.nowPlaying}>
      { isTurn && <YourTurnBanner/>}
      <Board game={game} isTurn={isTurn} onCellClick={onCellClick}/>
      <Button>Main Menu</Button>
    </div>
  )
}

const YourTurnBanner = () =>
  <div className={styles.yourTurn}>
    <div>Your Turn</div>
    <img src={waitingUrl} alt="Your turn" className={styles.yourTurnImage}/>
  </div>

export default NowPlaying