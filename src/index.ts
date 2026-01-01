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
  const queries = c.req.queries();
  let url = new URL(`https://${repo}.vercel.app${path}`);

  const searchParams = new URLSearchParams();
  for (const [key, values] of Object.entries(queries)) {
    for (const value of values) {
      searchParams.append(key, value);
    }
  }
  url.search = searchParams.toString();

  try {
    return await fetch(url.href, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body,
    });
  } catch (error) {
    return c.json({
      url: url.href,
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body,
      error: error,
    });
  }
});

export default app;
