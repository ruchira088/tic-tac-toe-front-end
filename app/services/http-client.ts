import axios, {type AxiosInstance} from "axios"
import Cookies from "js-cookie"

const AUTH_COOKIE_NAME = "user_id"

export const setUserToken = (token: string) => Cookies.set(AUTH_COOKIE_NAME, token)
export const getUserToken = (): string | undefined => Cookies.get(AUTH_COOKIE_NAME)

const axiosClient: AxiosInstance =
  axios.create({
    baseURL: "https://api.github.com"
  })

axiosClient.interceptors.request.use(config => {
  const userAuth: string | undefined = getUserToken()

  if (userAuth !== undefined) {
    config.headers.Authorization = `Bearer ${userAuth}`
  }

  return config
})

export default axiosClient