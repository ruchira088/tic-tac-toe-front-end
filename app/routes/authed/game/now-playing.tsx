import {type FC, useEffect} from "react"
import {
  type Coordinate,
  Game as GameSchema,
  type Game,
  type Message,
  move,
  Move,
  subscribeToGameUpdates,
  Winner
} from "~/services/game-service"
import {useUser} from "~/contexts/user-context"
import {z, type ZodTypeAny} from "zod"
import Board from "~/routes/authed/game/board"

type NowPlayingProps = {
  readonly game: Game
  readonly onGameChanged: (game: Game) => void
}

function check<T extends ZodTypeAny>(schema: T, value: unknown): value is z.infer<T> {
  return schema.safeParse(value).success
}

const NowPlaying: FC<NowPlayingProps> = props => {
  const {game, onGameChanged} = props
  const user = useUser()

  useEffect(() => subscribeToGameUpdates(game.id, onMessage), [game.id])

  const onMessage = (message: Message) => {
    if (check(Move, message)) {
      const move: Move = message
      if (move.playerId !== user.id) {
        onGameChanged(GameSchema.parse({...game, moves: game!.moves.concat(move)}))
      }
    } else if (check(Winner, message)) {
      const winner: Winner = message
      onGameChanged(GameSchema.parse({...game, winner}))
    }
  }

  const isTurn =
    game.moves.length === 0 ? game.playerOneId === user.id :
      game.moves[game.moves.length - 1].playerId !== user.id

  const onCellClick = async (coordinate: Coordinate) => {
    if (isTurn) {
      onGameChanged(GameSchema.parse({
            ...game,
            moves: game!.moves.concat({playerId: user.id, coordinate: coordinate, performedAt: new Date()})
          }
        )
      )

      await move(game.id, coordinate)
    }
  }

  return (
    <div>
      <Board game={game} isTurn={isTurn} onCellClick={onCellClick}/>
    </div>
  )
}

export default NowPlaying