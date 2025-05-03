import axios, {type AxiosInstance} from "axios"
import {AuthenticationToken} from "~/services/kv-store"

const axiosClient: AxiosInstance =
  axios.create({
    baseURL: "http://localhost:8080"
  })

axiosClient.interceptors.request.use(config => {
  const userAuth: string | undefined = AuthenticationToken.get()

  if (userAuth !== undefined) {
    config.headers.Authorization = `Bearer ${userAuth}`
  }

  return config
})

export default axiosClient