import type {Coordinate, Game, Move} from "~/services/game-service"
import type {FC} from "react"

import styles from "./board.module.scss"

enum Symbol {
  Circle = "O",
  Cross = "X",
}

const createGrid = (size: number): (Symbol | undefined)[][] => {
  const grid: (Symbol | undefined)[][] = []

  for (let y = 0; y < size; y++) {
    grid[y] = []

    for (let x = 0; x < size; x++) {
      grid[y][x] = undefined
    }
  }

  return grid
}

type BoardProps = {
  readonly game: Game
  readonly onCellClick: (coordinate: Coordinate) => void
}

const Board: FC<BoardProps> = props => {
  const grid: (Symbol | undefined)[][] = createGrid(3)

  const applicableMoves: Move[] = props.game.moves.slice(Math.max(0, props.game.moves.length - 6), props.game.moves.length)

  applicableMoves.forEach(move => {
    grid[move.coordinate.y][move.coordinate.x] = move.playerId === props.game.playerOneId ? Symbol.Circle : Symbol.Cross
  })

  return (
    <div className={styles.board}>
      {
        grid.map((row, y) =>
          <div key={y} className={styles.row}>
            {
              row.map((cell, x) =>
                <div key={x} className={styles.cell} onClick={() => props.onCellClick({x, y})}>
                  {cell}
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default Board