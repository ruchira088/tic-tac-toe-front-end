import {z} from "zod"
import axiosClient, {getUserToken, setUserToken} from "~/services/http-client"

const RegisteredUser = z.object({
  userId: z.string(),
  name: z.string(),
  createdAt: z.string().datetime()
})

type RegisteredUser = z.infer<typeof RegisteredUser>

const registerUser = async (): Promise<RegisteredUser> => {
  const response = await axiosClient.post<unknown>("/user")

  const registeredUser: RegisteredUser = RegisteredUser.parse(response.data)

  return registeredUser
}

const getUser = async () => {
  const response = await axiosClient.get<unknown>("/user")
}

const signIn = async () => {
  const userToken: string | undefined = getUserToken()

  if (userToken !== undefined) {
    return getUser()
  } else {
    const registeredUser = await registerUser()
    setUserToken(registeredUser.userId)
    return getUser()
  }
}