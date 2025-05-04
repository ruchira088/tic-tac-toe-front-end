import type {Route} from "./+types/game"
import {useEffect, useState} from "react"
import {type Game, getGameById, getPendingGameById, joinGame, type PendingGame} from "~/services/game-service"
import {useUser} from "~/contexts/user-context"

const LOADING = "loading"
const WAITING = "waiting"
const NOT_FOUND = "not-found"

type GameState = Game | typeof LOADING | typeof WAITING | typeof NOT_FOUND

const GamePage = ({params}: Route.ComponentProps) => {
  const [game, setGame] = useState<GameState>(LOADING)
  const user = useUser()

  const loadGame = async () => {
    const pendingGame: PendingGame | null = await getPendingGameById(params.gameId)
    if (pendingGame === null) {
      setGame(NOT_FOUND)
    } else if (pendingGame.gameStartedAt) {
      const game: Game | null = await getGameById(params.gameId)
      if (game === null) {
        setGame(NOT_FOUND)
      } else {
        setGame(game)
      }
    } else if (pendingGame.createdBy === user.id) {
      setGame(WAITING)
      await sleep(1000)
      await loadGame()
    } else {
      const game: Game = await joinGame(params.gameId)
      setGame(game)
    }
  }

  useEffect(() => {
    loadGame()
  }, [params.gameId])

  return <div>Game</div>
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default GamePage