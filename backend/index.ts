import { settings } from "@/common/config/settings"
import { HttpError } from "@/common/errors"
import { errResponse } from "@/common/response/helpers"
import { serpRouter } from "@/routers/serp"
import { themesRouter } from "@/routers/themes"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { requestId } from "hono/request-id"

const app = new Hono()

app.use(requestId())

app.use(
  cors({
    origin: settings.server.corsOrigin,
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

app.onError((err, c) => {
  console.error("[Error]", err)
  if (err instanceof HttpError) {
    return errResponse(c, { message: err.message }, err.status)
  }
  return errResponse(c, { message: "Internal server error" }, 500)
})

// Health check
app.get("/health", (c) => c.json({ status: "ok" }))

// Routes
app.route("/themes", themesRouter)
app.route("/serp", serpRouter)

export default {
  port: settings.server.port,
  fetch: app.fetch,
}

console.log(`🚀 IntentScout API running on port ${settings.server.port}`)
