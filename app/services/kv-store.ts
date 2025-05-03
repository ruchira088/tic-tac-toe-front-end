import Cookies from "js-cookie"

interface KvStore<T> {
  get(key: string): T | undefined

  set(key: string, value: T): void

  delete(key: string): T | undefined
}

class CookieStore implements KvStore<string> {
  constructor(private expires: number) {
  }

  delete(key: string): string | undefined {
    const existingValue = this.get(key)
    Cookies.remove(key, {expires: this.expires})

    return existingValue
  }

  get(key: string): string | undefined {
    return Cookies.get(key)
  }

  set(key: string, value: string): void {
    Cookies.set(key, value, {expires: this.expires})
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

export const AuthenticationToken = new AuthVault(new CookieStore(30))