import {Button, TextField} from "@mui/material"
import {useState} from "react"
import {Link, useNavigate} from "react-router"
import {signUp, signUpAsGuest} from "~/services/user-service"

import styles from "./sign-up.module.scss"

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigate = useNavigate()

  const onSignUp = async () => {
    await signUp(email, username, password)
    navigate("/home")
  }

  const playAsGuest = async () => {
    await signUpAsGuest()
    navigate("/home")
  }

  return (
    <div className={styles.signUpPage}>
      <div className={styles.signUpForm}>
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
      </div>
      <div className={styles.otherOptions}>
        <Link to="/sign-in">Already have an account</Link>
        <Button onClick={playAsGuest}>Play As Guest</Button>
      </div>
    </div>
  )
}

export default SignUp