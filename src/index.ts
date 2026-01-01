import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(cors());

app.get(
  "/",
  async (c) => c.redirect("https://github.com/Roy-Jin/Vercel-Proxy"),
);

app.use("/:repo/*", async (c) => {
  const repo = c.req.param().repo;
  const path = c.req.path.replace(`/${repo}`, "");

  return await fetch(`https://${repo}.vercel.app${path}`);
});

export default app;
