import {AuthenticationToken} from "~/services/kv-store"
import {Outlet, useNavigate} from "react-router"
import {AuthContext} from "~/contexts/auth-context"
import {useEffect} from "react"

const AuthedLayout = () => {
  const authToken = AuthenticationToken.get()
  const navigate = useNavigate()

  useEffect(() => {
    if (authToken === undefined) {
      navigate("/sign-in")
    }
  }, [authToken])

  return (
    <AuthContext.Provider value={authToken}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export default AuthedLayout
