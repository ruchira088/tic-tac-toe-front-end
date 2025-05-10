import {index, layout, route, type RouteConfig} from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),

  layout("routes/authed/layout.tsx", [
    route("/home", "routes/authed/home.tsx"),
    route("/game/id/:gameId", "routes/authed/game/game-page.tsx")
  ]),

  layout("routes/unauthed/layout.tsx", [
    route("/sign-in", "routes/unauthed/sign-in.tsx"),
    route("/sign-up", "routes/unauthed/sign-up.tsx")
  ])
] satisfies RouteConfig
