import Cookies from "js-cookie"
import {API_BASE_URL} from "~/config/config"

interface KvStore<T> {
  get(key: string): T | undefined

  set(key: string, value: T): void

  delete(key: string): T | undefined
}

class LocalStorage implements KvStore<string> {
  delete(key: string): string | undefined {
    const existingValue = this.get(key)
    localStorage.removeItem(key)
    return existingValue
  }

  get(key: string): string | undefined {
    const value: string | null = localStorage.getItem(key)

    if (value === null) {
      return undefined
    } else {
      return value
    }
  }

  set(key: string, value: string): void {
    localStorage.setItem(key, value)
  }
}

class CookieStore implements KvStore<string> {
  constructor(private domain: string, private expires: number) {
  }

  delete(key: string): string | undefined {
    const existingValue = this.get(key)
    Cookies.remove(key, {domain: this.domain, expires: this.expires})

    return existingValue
  }

  get(key: string): string | undefined {
    return Cookies.get(key)
  }

  set(key: string, value: string): void {
    Cookies.set(key, value, {domain: this.domain, expires: this.expires})
  }
}

class AuthVault {
  AUTH_KEY = "auth_token"

  constructor(private kvStore: KvStore<string>) {
  }

  get(): string | undefined {
    return this.kvStore.get(this.AUTH_KEY)
  }

  set(token: string): void {
    this.kvStore.set(this.AUTH_KEY, token)
  }

  delete(): string | undefined {
    return this.kvStore.delete(this.AUTH_KEY)
  }
}

const cookieStoreDomain = (apiUrl: string, frontendUrl: string) => {
  const api = new URL(apiUrl).hostname.split(".")
  const frontend = new URL(frontendUrl).hostname.split(".")

  const limit = Math.min(frontend.length, api.length)
  let matchCount = 0

  for (let i = 1; i <= limit; i++) {
    const frontendPart = frontend[frontend.length - i]
    const apiPart = api[api.length - i]

    if (apiPart !== frontendPart) {
      break
    } else {
      matchCount++
    }
  }

  const subdomain = frontend.slice(frontend.length - matchCount).join(".")

  return subdomain
}

export const AuthenticationToken =
  new AuthVault(new CookieStore("." + cookieStoreDomain(API_BASE_URL, window.location.href), 30))