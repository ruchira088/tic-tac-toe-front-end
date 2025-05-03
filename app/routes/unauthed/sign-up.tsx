import {Button, TextField} from "@mui/material"
import {useState} from "react"
import {Link, useNavigate, useSearchParams} from "react-router"
import {signUp, signUpAsGuest} from "~/services/user-service"

import styles from "./sign-up.module.scss"

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const navigate = useNavigate()
  const [searchParams]= useSearchParams()

  const redirect: string | null = searchParams.get("redirect")
  const nextUrl = redirect || "/home"

  const onSignUp = async () => {
    await signUp(email, username, password)
    navigate(nextUrl)
  }

  const playAsGuest = async () => {
    await signUpAsGuest()
    navigate(nextUrl)
  }

  const signInUrl = "/sign-in" + (redirect ? `?redirect=${redirect}` : "")

  return (
    <div className={styles.signUpPage}>
      <div className={styles.signUpForm}>
        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.field}/>
        <TextField
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className={styles.field}/>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.field}/>
        <TextField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className={styles.field}/>
        <Button onClick={onSignUp}>Sign Up</Button>
      </div>
      <div className={styles.otherOptions}>
        <Link to={signInUrl}>Already have an account</Link>
        <Button onClick={playAsGuest}>Play As Guest</Button>
      </div>
    </div>
  )
}

export default SignUp