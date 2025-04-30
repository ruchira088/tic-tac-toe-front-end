import {createContext, useContext} from "react"

export const AuthContext = createContext<string | undefined>(undefined);

export const useAuthToken = () => {
  const authToken = useContext(AuthContext)

  if (authToken === undefined) {
    throw new Error("Auth token is not set")
  } else {
    return authToken
  }
}