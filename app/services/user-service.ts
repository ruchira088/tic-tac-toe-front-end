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

export type User = z.infer<typeof User>

const UserSignUpResponse = z.object({
  user: User,
  authToken: AuthToken
})

type UserSignUpResponse = z.infer<typeof UserSignUpResponse>

const handleSignUp = (responseBody: unknown): User => {
  const userSignupResponse: UserSignUpResponse = UserSignUpResponse.parse(responseBody)
  AuthenticationToken.set(userSignupResponse.authToken.token)

  return userSignupResponse.user
}

export const signUp = async (email: string, username: string, password: string): Promise<User> => {
  const response = await axiosClient.post<unknown>("/user", {
    email,
    username,
    password
  })

  return handleSignUp(response.data)
}

export const signUpAsGuest = async (): Promise<User> => {
  const response = await axiosClient.post<unknown>("/user/guest")

  return handleSignUp(response.data)
}

export const signIn = async (email: string, password: string): Promise<AuthToken> => {
  const response = await axiosClient.post<unknown>("/auth", {
    email,
    password
  })

  const authToken: AuthToken = AuthToken.parse(response.data)
  AuthenticationToken.set(authToken.token)

  return authToken
}

export const getUser = async (): Promise<User> => {
  const response = await axiosClient.get<unknown>("/user")
  const user: User = User.parse(response.data)

  return user
}