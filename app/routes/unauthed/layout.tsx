import {AuthenticationToken} from "~/services/kv-store"
import {Outlet, useNavigate, useSearchParams} from "react-router"
import {useEffect} from "react"

const UnauthedLayout = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const authToken = AuthenticationToken.get()

  useEffect(() => {
    if (authToken !== undefined) {
      const redirect: string | null = searchParams.get("redirect")

      if (redirect !== null) {
        navigate(redirect)
      } else {
        navigate("/home")
      }
    }
  }, [authToken])

  return <Outlet/>
}

export default UnauthedLayout
