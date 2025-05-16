import type {Coordinate, Game, Move} from "~/services/game-service"
import type {FC} from "react"

import styles from "./board.module.scss"
import classNames from "classnames"

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
  readonly isTurn: boolean
  readonly onCellClick: (coordinate: Coordinate) => void
}

const Board: FC<BoardProps> = props => {
  const grid: (Symbol | undefined)[][] = createGrid(3)

  const applicableMoves: Move[] = props.game.moves.slice(Math.max(0, props.game.moves.length - 6), props.game.moves.length)

  applicableMoves.forEach(move => {
    grid[move.coordinate.y][move.coordinate.x] = move.playerId === props.game.playerOneId ? Symbol.Circle : Symbol.Cross
  })

  const isNextRemoval = (x: number, y: number) => {
    if (props.game.winner === null && applicableMoves.length === 6) {
      const first = applicableMoves[0].coordinate

      return first.x === x && first.y === y
    } else {
      return false
    }
  }

  const isWinningCoordinate =
    (x: number, y: number) =>
      props.game.winner?.coordinates.some(coordinate => coordinate.x === x && coordinate.y === y)

  const winningRuleStyle = firstLetterLower(props.game.winner?.winningRule || "NoWinner")

  return (
    <div className={styles.board}>
      {
        grid.map((row, y) =>
          <div key={y} className={styles.row}>
            {
              row.map((cell, x) =>
                <div
                  key={x}
                  className={
                    classNames(
                      styles.cell,
                      {[styles[winningRuleStyle]]: props.game.winner != null},
                      {[styles.nextRemoval]: isNextRemoval(x, y)},
                      {[styles.winningCoordinate]: isWinningCoordinate(x, y)}
                    )
                  }
                  onClick={() => props.onCellClick({x, y})}>
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

const firstLetterLower = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)

export default Board