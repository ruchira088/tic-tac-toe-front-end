import {useState} from "react"
import {Button, TextField} from "@mui/material"
import {Link} from "react-router"

const SignIn = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const onSignIn = async () => {
  }

  return (
    <div>
      <TextField
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}/>

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}/>

      <Button variant="contained" onClick={onSignIn}>Sign in</Button>
      <Link to="/sign-up">
        <Button variant="outlined">Sign up</Button>
      </Link>
      <Button variant="text">Play as guest</Button>
    </div>
  )
}

export default SignIn