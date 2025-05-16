import axios, {type AxiosInstance} from "axios"
import {AuthenticationToken} from "~/services/kv-store"
import {BASE_URL} from "~/config/config"

const axiosClient: AxiosInstance =
  axios.create({
    baseURL: BASE_URL
  })

axiosClient.interceptors.request.use(config => {
  const userAuth: string | undefined = AuthenticationToken.get()

  if (userAuth !== undefined) {
    config.headers.Authorization = `Bearer ${userAuth}`
  }

  return config
})

export default axiosClient