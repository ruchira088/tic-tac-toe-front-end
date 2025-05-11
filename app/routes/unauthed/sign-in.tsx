import {useState} from "react"
import {Button, TextField} from "@mui/material"
import {Link, useNavigate, useSearchParams} from "react-router"
import {signIn, signUpAsGuest} from "~/services/user-service"
import logo from "~/images/logo.svg"

import styles from "./sign-in.module.scss"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const redirect: string | null = searchParams.get("redirect")
  const nextUrl = redirect || "/home"

  const onSignIn = async () => {
    await signIn(email, password)
    navigate(nextUrl)
  }

  const playAsGuest = async () => {
    await signUpAsGuest()
    navigate(nextUrl)
  }

  const signUpUrl = "/sign-up" + (redirect ? `?redirect=${redirect}` : "")

  return (
    <div className={styles.signInPage}>
      <div className={styles.signInDialog}>
        <div className={styles.signInHeader}>
          <img src={logo} alt="logo"/>
          <div>Tic Tac Toe</div>
          <div>Please login to your account</div>
        </div>
        <div className={styles.signInForm}>
          <TextField
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.field}/>

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.field}/>

          <Button variant="contained" onClick={onSignIn}>Sign in</Button>
        </div>
        <div className={styles.otherOptions}>
          <div>Don't have an account? <Link to={signUpUrl}>Sign Up</Link></div>
          <Button variant="text" onClick={playAsGuest}>Play as guest</Button>
        </div>
      </div>
    </div>
  )
}

export default SignIn