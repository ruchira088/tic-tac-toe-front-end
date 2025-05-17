import {Link, useNavigate} from "react-router"
import {Button} from "@mui/material"
import {signUpAsGuest} from "~/services/user-service"

import logoUrl from "~/images/logo.svg"
import styles from "./index.module.scss"

const Index = () => {
  const navigate = useNavigate()

  const onNewGame = async () => {
    await signUpAsGuest()
    navigate("/home/new-game")
  }

  const onJoinGame = async () => {
    await signUpAsGuest()
    navigate("/home/join-game")
  }

  return (
    <div className={styles.indexPage}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={logoUrl} alt="logo" />
        </div>
        <div className={styles.title}>
          <div className={styles.mainTitle}>Tic Tac Toe</div>
          <div className={styles.subTitle}>Play with your friends</div>
        </div>
      </div>
      <div className={styles.actions}>
        <Button className={styles.button} variant="contained" onClick={onNewGame}>New Game</Button>
        <Button className={styles.button} variant="contained" onClick={onJoinGame}>Join Game</Button>
        <Button className={styles.button} variant="contained"><Link to="/sign-in">Sign In</Link></Button>
      </div>
    </div>
  )
}

export default Index