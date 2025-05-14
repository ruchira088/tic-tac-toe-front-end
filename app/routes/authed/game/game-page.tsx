import {useEffect, useState} from "react"
import {type Game, getGameById, getPendingGameById, joinGame, type PendingGame} from "~/services/game-service"
import {useUser} from "~/contexts/user-context"
import type {Route} from "./+types/game-page"
import NowPlaying from "~/routes/authed/game/now-playing"
import {Button, CircularProgress, LinearProgress} from "@mui/material"
import classNames from "classnames"

import styles from "./game-page.module.scss"

enum GameStatus {
  ACTIVE,
  LOADING,
  WAITING_FOR_ANOTHER_PLAYER,
  NOT_FOUND,
  ENDED
}

const GamePage = ({params}: Route.ComponentProps) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.LOADING)
  const [game, setGame] = useState<Game | undefined>(undefined)
  const user = useUser()

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
      setGameStatus(GameStatus.WAITING_FOR_ANOTHER_PLAYER)
      await sleep(1000)
      await loadGame()
    } else {
      const game: Game = await joinGame(params.gameId)
      setGame(game)
      setGameStatus(GameStatus.ACTIVE)
    }
  }

  useEffect(() => {
    loadGame()
  }, [params.gameId])

  const Content = () => {
    if (game !== undefined) {
      return <NowPlaying game={game} onGameChanged={setGame}/>
    } else if (gameStatus === GameStatus.NOT_FOUND) {
      return <div>Loading</div>
    } else if (gameStatus === GameStatus.WAITING_FOR_ANOTHER_PLAYER) {
      return <WaitingForAnotherPlayer/>
    } else {
      return <CircularProgress color="inherit" size="5em"/>
    }
  }

  return (
    <div className={styles.gamePage}>
      <Content/>
    </div>
  )

}

const WaitingForAnotherPlayer = () => {
  const [showCopySuccess, setShowCopySuccess] = useState(false)

  const onCopyShareLink = async () => {
    setShowCopySuccess(true)
    await navigator.clipboard.writeText(window.location.href)
    await sleep(1000)
    setShowCopySuccess(false)
  }

  return (
    <div className={classNames(styles.waitingForAnotherPlayer, styles.center)}>
      <div className={styles.waitingProgress}>
        <div className={styles.waitingProgressTitle}>Waiting for somebody to join the game</div>
        <div className={styles.waitingProgressBar}><LinearProgress color="inherit"/></div>
      </div>
      <div className={styles.shareLink}>
        <Button variant="contained" onClick={onCopyShareLink}>Copy Share Link</Button>
        { showCopySuccess && <div className={styles.shareLinkCopy}>Copied</div> }
      </div>
    </div>
  )
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default GamePage