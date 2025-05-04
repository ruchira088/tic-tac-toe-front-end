import Cookies from "js-cookie"
import {BASE_URL} from "~/config/config"

interface KvStore<T> {
  get(key: string): T | undefined

  set(key: string, value: T): void

  delete(key: string): T | undefined
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

console.log(BASE_URL)

export const AuthenticationToken =
  new AuthVault(new CookieStore(new URL(BASE_URL).hostname, 30))