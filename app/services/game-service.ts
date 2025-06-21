import {z} from "zod/v4"
import axiosClient from "~/services/http-client"
import {API_BASE_URL, wsBaseUrl} from "~/config/config"
import {ZodDate} from "~/types/ZodTypes"

const PendingGame = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  createdBy: z.string(),
  gameStartedAt: ZodDate.nullish()
})

export type PendingGame = z.infer<typeof PendingGame>

const Coordinate = z.object({
  x: z.number(),
  y: z.number()
})

export type Coordinate = z.infer<typeof Coordinate>

export const Move = z.object({
  id: z.string().nullish(),
  playerId: z.string(),
  performedAt: ZodDate.nullish(),
  coordinate: Coordinate
})

export type Move = z.infer<typeof Move>

export enum WinningRule {
  ForwardDiagonal = "ForwardDiagonal",
  BackwardDiagonal = "BackwardDiagonal",
  Horizontal = "Horizontal",
  Vertical = "Vertical"
}

export const Winner = z.object({
  playerId: z.string(),
  winningRule: z.enum(WinningRule),
  coordinates: z.array(Coordinate)
})

export type Winner = z.infer<typeof Winner>

export const Game = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: ZodDate.nullish(),
  createdBy: z.string(),
  startedAt: ZodDate.nullish(),
  playerOneId: z.string(),
  playerTwoId: z.string(),
  moves: z.array(Move),
  winner: Winner.nullish()
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

enum SseMessageType {
  MoveUpdate = "MOVE_UPDATE",
  Winner = "WINNER"
}

enum WsMessageType {
  Ping = "PING",
  MoveUpdate = "MOVE_UPDATE",
  Winner = "WINNER"
}

const PingMessage = z.object({
  userId: z.string(),
  timestamp: ZodDate.nullish()
})

const WsMessage = z.discriminatedUnion("type", [
  z.object({type: z.literal(WsMessageType.Ping), data: PingMessage}),
  z.object({type: z.literal(WsMessageType.MoveUpdate), data: Move}),
  z.object({type: z.literal(WsMessageType.Winner), data: Winner})
])

export type WsMessage = z.infer<typeof WsMessage>

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

export const placeCoordinate = async (gameId: string, coordinate: Coordinate): Promise<Game> => {
  const response = await axiosClient.post<unknown>(`/game/id/${gameId}/move`, coordinate)
  const game: Game = Game.parse(response.data)

  return game
}

export type onMessageCallback = (move: Move | null, winner: Winner | null) => void

export const subscribeToGameUpdatesViaWebSocket = (gameId: string, onMessage: onMessageCallback): WebSocket => {
  const webSocket = new WebSocket(`${wsBaseUrl()}/game/id/${gameId}/updates`)

  webSocket.onopen = () => {
    console.log("WebSocket opened")
  }

  webSocket.onmessage = (event) => {
    const message: WsMessage = WsMessage.parse(JSON.parse(event.data))

    if (message.type === WsMessageType.MoveUpdate) {
      onMessage(message.data, null)
    } else if (message.type === WsMessageType.Winner) {
      onMessage(null, message.data)
    }
  }

  webSocket.onclose = () => {
    console.log("WebSocket closed")
  }

  return webSocket
}

export const subscribeToGameUpdatesViaSse = (gameId: string, onMessage: onMessageCallback): EventSource => {
  const eventSource: EventSource = new EventSource(`${API_BASE_URL}/game/id/${gameId}/updates`, {withCredentials: true})

  eventSource.addEventListener(SseMessageType.MoveUpdate, event => {
    const move: Move = Move.parse(event.data)
    onMessage(move, null)
  })

  eventSource.addEventListener(SseMessageType.Winner, event => {
    const winner: Winner = Winner.parse(event.data)
    onMessage(null, winner)
  })

  eventSource.onopen = () => {
    console.log("SSE opened")
  }

  eventSource.onerror = error => {
    console.log(`SSE error: ${JSON.stringify(error)}`)
  }

  return eventSource
}