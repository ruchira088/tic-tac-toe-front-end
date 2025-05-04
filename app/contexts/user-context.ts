import {createContext, useContext} from "react"
import type {User} from "~/services/user-service"

export const UserContext = createContext<User | undefined>(undefined)

export const useUser = () => {
  const user = useContext(UserContext)

  if (user === undefined) {
    throw new Error("useUser must be inside a UserContext.Provider")
  } else {
    return user
  }
}