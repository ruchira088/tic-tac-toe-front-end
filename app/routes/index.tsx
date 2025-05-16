import {Link, useNavigate} from "react-router"
import {Button} from "@mui/material"
import {signUpAsGuest} from "~/services/user-service"

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
    <div>
      <div>Play Tic Tac Toe</div>
      <div>
        <Button variant="contained" onClick={onNewGame}>New Game</Button>
        <Button variant="contained" onClick={onJoinGame}>Join Game</Button>
        <Link to="/sign-in"><Button variant="contained">Sign In</Button></Link>
      </div>
    </div>
  )
}

export default Index