import {AuthenticationToken} from "~/services/kv-store"
import {Outlet, useLocation, useNavigate} from "react-router"
import {useEffect, useState} from "react"
import {getUser, type User} from "~/services/user-service"
import {UserContext} from "~/contexts/user-context"

const AuthedLayout = () => {
  const [user, setUser] = useState<User | undefined>(undefined)
  const navigate = useNavigate()
  const location = useLocation()

  const authToken = AuthenticationToken.get()

  useEffect(() => {
    if (authToken === undefined) {
      navigate("/sign-in?redirect=" + location.pathname)
    }
  }, [])

  useEffect(() => {
    if (authToken !== undefined) {
      getUser().then(setUser)
    }
  }, [])

  if (user === undefined) {
    return <div>Loading</div>
  } else {
    return (
      <UserContext.Provider value={user}>
        <Outlet/>
      </UserContext.Provider>
    )
  }
}

export default AuthedLayout
