import {z} from "zod"
import axiosClient from "~/services/http-client"

const PendingGame = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  gameStartedAt: z.null().optional().or(z.date({coerce: true}))
})

export type PendingGame = z.infer<typeof PendingGame>

const Coordinate = z.object({
  x: z.number(),
  y: z.number()
})

export type Coordinate = z.infer<typeof Coordinate>

const Move = z.object({
  playerId: z.string(),
  performedAt: z.date({coerce: true}),
  coordinate: Coordinate
})

export type Move = z.infer<typeof Move>

enum WinningRule {
  Diagonal = "Diagonal",
  Horizontal = "Horizontal",
  Vertical = "Vertical"
}

const Winner = z.object({
  playerId: z.string(),
  winningRule: z.nativeEnum(WinningRule)
})

const Game = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.date({coerce: true}),
  createdBy: z.string(),
  startedAt: z.date({coerce: true}),
  playerOneId: z.string(),
  playerTwoId: z.string(),
  moves: z.array(Move),
  winner: Winner.or(z.null()).optional()
})

export type Game = z.infer<typeof Game>

function ListResponse<T>(type: z.ZodType<T>) {
  return z.object({
    data: z.array(type),
    limit: z.number(),
    offset: z.number()
  })
}

export type ListResponse<T> = z.infer<ReturnType<typeof ListResponse<T>>>

export const createGame = async (gameTitle: string): Promise<PendingGame> => {
  const response = await axiosClient.post<unknown>("/game/pending", {gameTitle})
  const pendingGame: PendingGame = PendingGame.parse(response.data)
  return pendingGame
}

export const getPendingGames = async (): Promise<PendingGame[]> => {
  const response = await axiosClient.get<unknown>("/game/pending")
  const pendingGamesResponse: ListResponse<PendingGame> = ListResponse(PendingGame).parse(response.data)
  return pendingGamesResponse.data
}

export const getPendingGameById = async (gameId: string): Promise<PendingGame | null> => {
  const response = await axiosClient.get<unknown>(`/game/pending/id/${gameId}`)

  if (response.status === 404) {
    return null
  }

  const pendingGame: PendingGame = PendingGame.parse(response.data)
  return pendingGame
}

export const joinGame = async (gameId: string): Promise<Game> => {
  const response = await axiosClient.post<unknown>(`/game/pending/id/${gameId}/join`)
  const game: Game = Game.parse(response.data)
  return game
}

export const getGameById = async (gameId: string): Promise<Game | null> => {
  const response = await axiosClient.get<unknown>(`/game/id/${gameId}`)

  if (response.status === 404) {
    return null
  }

  const game: Game = Game.parse(response.data)
  return game
}