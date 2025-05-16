import {index, layout, route, type RouteConfig} from "@react-router/dev/routes"

export default [
  index("routes/index.tsx"),

  layout("routes/authed/layout.tsx", [
    route("/home", "routes/authed/home.tsx", {id: "home"}),
    route("/home/new-game", "routes/authed/home.tsx", {id: "new-game"}),
    route("/home/join-game", "routes/authed/home.tsx", {id: "join-game"}),
    route("/game/id/:gameId", "routes/authed/game/game-page.tsx")
  ]),

  layout("routes/unauthed/layout.tsx", [
    route("/sign-in", "routes/unauthed/sign-in.tsx"),
    route("/sign-up", "routes/unauthed/sign-up.tsx")
  ])
] satisfies RouteConfig
