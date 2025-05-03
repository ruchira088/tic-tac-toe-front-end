import { z } from "zod"
import axiosClient from "~/services/http-client"

const PendingGame = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  gameStartedAt: z.string().or(z.null()).optional(),
})

export type PendingGame = z.infer<typeof PendingGame>

export const createGame = async (gameTitle: string): Promise<PendingGame> => {
  const response = await axiosClient.post<unknown>("/game/pending", {gameTitle})
  const pendingGame: PendingGame = PendingGame.parse(response.data)

  return pendingGame
}