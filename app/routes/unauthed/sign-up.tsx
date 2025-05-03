import {Button, TextField} from "@mui/material"
import {useState} from "react"
import {Link} from "react-router"
import {signUp} from "~/services/user-service"

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onSignUp = async () => {
    await signUp(email, username, password)
  }

  return (
    <div>
      <TextField
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}/>
      <TextField
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm password"
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
      />
      <Button onClick={onSignUp}>Sign Up</Button>
      <Button>Play As Guest</Button>
      <Link to="/sign-in">Already have an account</Link>
    </div>
  )
}

export default SignUp