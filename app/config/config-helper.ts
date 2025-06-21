export const DEFAULT_DOMAIN = "ruchij.com"
export const DEFAULT_API_DOMAIN = `home.${DEFAULT_DOMAIN}`
export const API_PREFIX = "api"

export const inferApiHostname = (frontendHost: string): string => {
  const hostname = (() => {
    if (frontendHost.endsWith(DEFAULT_API_DOMAIN)) {
      return frontendHost
    } else if (frontendHost.endsWith(DEFAULT_DOMAIN)) {
      return frontendHost.replace(DEFAULT_DOMAIN, DEFAULT_API_DOMAIN)
    } else {
      return frontendHost
    }
  })()

  const apiHostname = API_PREFIX + "." + hostname

  return apiHostname
}