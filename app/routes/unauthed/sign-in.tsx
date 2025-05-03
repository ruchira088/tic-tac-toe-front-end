import {useState} from "react"
import {Button, TextField} from "@mui/material"
import {Link, useNavigate} from "react-router"

import styles from "./sign-in.module.scss"
import {signIn, signUpAsGuest} from "~/services/user-service"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const onSignIn = async () => {
    await signIn(email, password)
    navigate("/home")
  }

  const playAsGuest = async () => {
    await signUpAsGuest()
    navigate("/home")
  }

  return (
    <div className={styles.signInPage}>
      <div className={styles.signInForm}>
        <TextField
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}/>

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}/>

        <Button variant="contained" onClick={onSignIn}>Sign in</Button>
      </div>
      <div className={styles.otherOptions}>
        <Link to="/sign-up">Register for an account</Link>
        <Button variant="text" onClick={playAsGuest}>Play as guest</Button>
      </div>
    </div>
  )
}

export default SignIn