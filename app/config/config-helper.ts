
export const DEFAULT_API_DOMAIN = ".home.ruchij.com"
export const API_PREFIX = "api."

export const inferApiUrl = (frontendHost: string, apiDomain: string = DEFAULT_API_DOMAIN): string => {
  let boundary: number = 0
  let matchCount: number = 0
  const max = Math.min(apiDomain.length, frontendHost.length)

  for (let i = 1; i <= max; i++) {
    const domainChar = apiDomain.charAt(apiDomain.length - i)
    const hostChar = frontendHost.charAt(frontendHost.length - i)

    if (domainChar !== hostChar) {
      break;
    }

    if (domainChar === ".") {
      matchCount++
      boundary = i
    }
  }

  if (matchCount >= 2) {
    const apiUrl = API_PREFIX + frontendHost.substring(0, frontendHost.length - boundary) + apiDomain
    return apiUrl
  } else {
    return API_PREFIX + frontendHost
  }
}