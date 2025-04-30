import Cookies from "js-cookie"

interface KvStore<T> {
  get(key: string): T | undefined

  set(key: string, value: T): void

  delete(key: string): T | undefined
}

class CookieStore implements KvStore<string> {
  delete(key: string): string | undefined {
    const existingValue = this.get(key)
    Cookies.remove(key)

    return existingValue
  }

  get(key: string): string | undefined {
    return Cookies.get(key)
  }

  set(key: string, value: string): void {
    Cookies.set(key, value)
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

export const AuthToken = new AuthVault(new CookieStore())