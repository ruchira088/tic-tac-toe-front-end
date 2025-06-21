import {inferApiUrl} from "./config-helper"

const API_URL_QUERY_PARAMETER = "API_URL"

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
      return inferApiUrl(location.hostname)
    }
  }
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