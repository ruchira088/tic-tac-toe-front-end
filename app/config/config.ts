const API_URL_QUERY_PARAMETER = "API_URL"
const DEFAULT_API_DOMAIN = "home.ruchij.com"

const baseUrl = () => {
  const location = window.location
  const queryParams: URLSearchParams = new URLSearchParams(location.search)
  const apiUrlViaQueryParams = queryParams.get(API_URL_QUERY_PARAMETER)

  if (apiUrlViaQueryParams) {
    const url = new URL(location.href)
    url.searchParams.delete(API_URL_QUERY_PARAMETER)
    window.history.replaceState({}, "", url.toString())

    return apiUrlViaQueryParams
  } else {
    const apiUrlViaEnv = import.meta.env.VITE_API_URL

    if (apiUrlViaEnv) {
      return apiUrlViaEnv
    } else {
      if (location.host.endsWith(DEFAULT_API_DOMAIN)) {
        const apiUrl = `${location.protocol}//api.${location.host}`

        return apiUrl
      } else {
        let i

        for (i = 0; i < Math.min(DEFAULT_API_DOMAIN.length, location.host.length); i++) {
          const domainChar = DEFAULT_API_DOMAIN.charAt(DEFAULT_API_DOMAIN.length - 1 - i)
          const hostChar = location.host.charAt(location.host.length - 1 - i)

          if (domainChar !== hostChar) {
            break;
          }
        }
      }
    }
  }
}

export const inferApiUrl = (apiDomain: string, frontendHost: string): string => {
  let boundary: number = 0

  for (let i = 0; i < Math.min(apiDomain.length, frontendHost.length); i++) {
    const domainChar = apiDomain.charAt(apiDomain.length - 1 - i)
    const hostChar = frontendHost.charAt(frontendHost.length - 1 - i)

    if (domainChar !== hostChar) {
      break;
    }

    boundary = i
  }

  const apiUrl = frontendHost.substring(0, frontendHost.length - boundary) + apiDomain

  return apiUrl
}

export const BASE_URL = baseUrl()

const getWsBaseUrl = (baseUrl: string) => {
  const url = new URL(baseUrl)

  const protocol = url.protocol === "https:" ? "wss" : "ws"
  const host = url.host
  const path = url.pathname === "/" ? "" : url.pathname

  return `${protocol}://${host}${path}`
}

export const wsBaseUrl = () => getWsBaseUrl(BASE_URL)