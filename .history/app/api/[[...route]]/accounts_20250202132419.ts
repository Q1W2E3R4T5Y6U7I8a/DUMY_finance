import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle";
import { accounts, insertAccountSchema } from "@/db/schema";
import { z } from "zod";

const app = new Hono();

// Auth Helper
const requireAuth = async (c: any) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
    return auth.userId;
};

// GET All Accounts
app.get("/", clerkMiddleware(), async (c) => {
    const userId = await requireAuth(c);
    if (!userId) return;

    const data = await db
        .select({ id: accounts.id, name: accounts.name })
        .from(accounts)
        .where(eq(accounts.userId, userId));

    return c.json({ data });
});

// GET Account by ID
app.get("/:id",
    zValidator("param", z.object({ id: z.string() })),
    clerkMiddleware(),
    async (c) => {
        const userId = await requireAuth(c);
        if (!userId) return;

        const { id } = c.req.valid("param");

        const [data] = await db
            .select({ id: accounts.id, name: accounts.name })
            .from(accounts)
            .where(and(eq(accounts.userId, userId), eq(accounts.id, id)));

        if (!data) return c.json({ error: "Not found" }, 404);
        return c.json({ data });
    }
);

// Create Account
app.post("/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    async (c) => {
        const userId = await requireAuth(c);
        if (!userId) return;

        const values = c.req.valid("json");
        const [data] = await db
            .insert(accounts)
            .values({ id: createId(), userId, ...values })
            .returning();

        return c.json({ data });
    }
);

// Bulk Delete Accounts
app.post("/bulk-delete",
    clerkMiddleware(),
    zValidator("json", z.object({ ids: z.array(z.string()) })),
    async (c) => {
        const userId = await requireAuth(c);
        if (!userId) return;

        const { ids } = c.req.valid("json");
        if (ids.length === 0) return c.json({ error: "No IDs provided" }, 400);

        const data = await db
            .delete(accounts)
            .where(and(eq(accounts.userId, userId), inArray(accounts.id, ids)))
            .returning({ id: accounts.id });

        return c.json({ data });
    }
);

// Update Account
app.patch("/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", insertAccountSchema.pick({ name: true })),
    async (c) => {
        const userId = await requireAuth(c);
        if (!userId) return;

        const { id } = c.req.valid("param");
        const values = c.req.valid("json");

        const [data] = await db
            .update(accounts)
            .set(values)
            .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))
            .returning();

        if (!data) return c.json({ error: "Not found" }, 404);
        return c.json({ data });
    }
);

// Delete Account by ID
app.delete("/:id",
    clerkMiddleware(),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
        const userId = await requireAuth(c);
        if (!userId) return;

        const { id } = c.req.valid("param");
        const [data] = await db
            .delete(accounts)
            .where(and(eq(accounts.userId, userId), eq(accounts.id, id)))
            .returning({ id: accounts.id });

        if (!data) return c.json({ error: "Not found" }, 404);
        return c.json({ data });
    }
);

export default app;
