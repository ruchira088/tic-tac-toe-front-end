export const BASE_URL = "http://localhost:8080"

const getWsBaseUrl = (baseUrl: string) => {
  const url = new URL(baseUrl)

  const protocol = url.protocol === "https:" ? "wss" : "ws"
  const host = url.host
  const path = url.pathname === "/" ? "" : url.pathname

  return `${protocol}://${host}${path}`
}

export const WS_BASE_URL = getWsBaseUrl(BASE_URL)