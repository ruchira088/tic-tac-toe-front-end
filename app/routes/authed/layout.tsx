import {AuthenticationToken} from "~/services/kv-store"
import {Outlet, useLocation, useNavigate} from "react-router"
import {AuthContext} from "~/contexts/auth-context"
import {useEffect} from "react"

const AuthedLayout = () => {
  const authToken = AuthenticationToken.get()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (authToken === undefined) {
      navigate("/sign-in?redirect=" + location.pathname)
    }
  }, [authToken])

  return (
    <AuthContext.Provider value={authToken}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export default AuthedLayout
