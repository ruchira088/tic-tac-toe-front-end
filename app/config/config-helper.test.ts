import {describe, expect, test} from "vitest"
import {inferApiHostname} from "~/config/config-helper"

describe("inferApiUrl", () => {
  test("frontendUrl ends with apiDomain", () => {
    const apiUrl = inferApiHostname("tic-tac-toe.home.ruchij.com")
    expect(apiUrl).toBe("api.tic-tac-toe.home.ruchij.com")
  })

  test("frontendUrl partially ends with apiDomain", () => {
    const apiUrl = inferApiHostname("tic-tac-toe.ruchij.com")
    expect(apiUrl).toBe("api.tic-tac-toe.home.ruchij.com")
  })

  test("frontendUrl only matches one term in apiDomain", () => {
    const apiUrl = inferApiHostname("tic-tac-toe.google.com")
    expect(apiUrl).toBe("api.tic-tac-toe.google.com")
  })

  test("frontendUrl doesn't end with apiDomain", () => {
    const apiUrl = inferApiHostname("tic-tac-toe.google.au")
    expect(apiUrl).toBe("api.tic-tac-toe.google.au")
  })
})
