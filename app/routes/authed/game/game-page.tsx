import {useEffect, useState} from "react"
import {
  type Coordinate,
  type Game,
  Game as GameSchema,
  getGameById,
  getPendingGameById,
  joinGame,
  type Message,
  Move,
  move,
  type PendingGame,
  subscribeToGameUpdates,
  Winner
} from "~/services/game-service"
import {useUser} from "~/contexts/user-context"
import type {Route} from "./+types/game-page"
import Board from "~/routes/authed/game/board"
import {z, type ZodTypeAny} from "zod"

enum GameStatus {
  ACTIVE,
  LOADING,
  WAITING,
  NOT_FOUND,
  ENDED
}

function check<T extends ZodTypeAny>(schema: T, value: unknown): value is z.infer<T> {
  return schema.safeParse(value).success
}

const GamePage = ({params}: Route.ComponentProps) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.LOADING)
  const [game, setGame] = useState<Game | undefined>(undefined)
  const user = useUser()

  const onMessage = (message: Message) => {
    if (check(Move, message)) {
      const move: Move = message
      if (move.playerId !== user.id) {
        setGame(game => GameSchema.parse({...game, moves: game!.moves.concat(move)}))
      }
    } else if (check(Winner, message)) {
      const winner: Winner = message
      setGame(game => GameSchema.parse({...game, winner}))
    }
  }

  const loadGame = async () => {
    const pendingGame: PendingGame | null = await getPendingGameById(params.gameId)
    if (pendingGame === null) {
      setGameStatus(GameStatus.NOT_FOUND)
    } else if (pendingGame.gameStartedAt) {
      const game: Game | null = await getGameById(params.gameId)
      if (game === null) {
        setGameStatus(GameStatus.NOT_FOUND)
      } else if (game.winner != null) {
        setGame(game)
        setGameStatus(GameStatus.ENDED)
      } else {
        setGame(game)
        setGameStatus(GameStatus.ACTIVE)
      }
    } else if (pendingGame.createdBy === user.id) {
      // Waiting for somebody to join the game
      setGameStatus(GameStatus.WAITING)
      await sleep(1000)
      await loadGame()
    } else {
      const game: Game = await joinGame(params.gameId)
      setGame(game)
      setGameStatus(GameStatus.ACTIVE)
    }
  }

  const isTurn =
    game !== undefined && (
      game.moves.length === 0 ? game.playerOneId === user.id :
        game.moves[game.moves.length - 1].playerId !== user.id
    )

  const onCellClick = async (coordinate: Coordinate) => {
    if (isTurn) {
      setGame(game => GameSchema.parse({
            ...game,
            moves: game!.moves.concat({playerId: user.id, coordinate: coordinate, performedAt: new Date()})
          }
        )
      )

      await move(params.gameId, coordinate)
    }
  }

  useEffect(() => {
    loadGame()
  }, [params.gameId])

  useEffect(() => {
    if (game !== undefined) {
      return subscribeToGameUpdates(game.id, onMessage)
    }
  }, [game?.id])

  if (game !== undefined) {
    return (
      <div>
        <Board game={game} onCellClick={onCellClick}/>
      </div>
    )
  }

  return <div>Game</div>
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default GamePage