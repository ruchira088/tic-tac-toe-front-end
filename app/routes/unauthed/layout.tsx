import {AuthToken} from "~/services/kv-store"
import {Outlet, useNavigate} from "react-router"
import {useEffect} from "react"

const UnauthedLayout = () => {
  const navigate = useNavigate()
  const authToken = AuthToken.get()

  useEffect(() => {
    if (authToken !== undefined) {
      navigate("/home")
    }
  }, [authToken])

  return <Outlet/>
}

export default UnauthedLayout
