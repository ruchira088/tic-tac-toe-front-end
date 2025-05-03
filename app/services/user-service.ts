import {z} from "zod"
import axiosClient from "~/services/http-client"
import {AuthenticationToken} from "~/services/kv-store"

const AuthToken = z.object({
  token: z.string(),
  userId: z.string(),
  issuedAt: z.string()
})

type AuthToken = z.infer<typeof AuthToken>

const User = z.object({
  id: z.string(),
  email: z.string().or(z.null()).optional(),
  username: z.string(),
  createdAt: z.string()
})

type User = z.infer<typeof User>

const UserSignUpResponse = z.object({
  user: User,
  authToken: AuthToken
})

type UserSignUpResponse = z.infer<typeof UserSignUpResponse>

export const signUp = async (email: string, username: string, password: string): Promise<User> => {
  const response = await axiosClient.post<unknown>("/user", {
    email,
    username,
    password
  })

  const userSignupResponse: UserSignUpResponse = UserSignUpResponse.parse(response.data)
  AuthenticationToken.set(userSignupResponse.authToken.token)

  return userSignupResponse.user
}

const getUser = async () => {
  const response = await axiosClient.get<unknown>("/user")
}
