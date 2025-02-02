import { Hono } from 'hono';
import { handle } from 'hono/vercel';
//import categories from "./categories";

import accounts from "./accounts";

export const runtime = 'edge';

const app = new Hono().basePath('/api')

const routes = app
  .route("/account", accounts)
//  .route("/categories", categories);

/*.get(
    "/hello/:test",
    (c) => {
    return c.json({
      message: "Hellow World",
    })
  })
  .post(
    "/create/:postId",
    zValidator("json", z.object({
      name: z.string(),
      userId: z.number(),
    })),
    zValidator("param", z.object({
      postId: z.number(),
    })),
    (c) => {
      const {name, userId} = c.req.valid("json");
      const {postId} = c.req.valid("param");

      return c.json({});
  })
*/
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;