import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign, verify } from "hono/jwt"

interface EnvBindings {
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string
    };
}

const app = new Hono<EnvBindings>();

app.use('/api/v1/blog/*', async (c, next) => {
    const header = c.req.header("Authorization") || "";

    const token = header.split(" ")[1];

    const response = await verify(header, c.env.JWT_SECRET)
    if (response.id) {
        await next();
    } else {
        return c.json({ error: "unauthorizd" }, 401);
    }
});

app.post('/api/v1/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password
        }
    })

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
        jwt: token
    })
});

app.post('/api/v1/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    });

    if (!user) {
        c.status(403);
        return c.json({
            error: "user not found"
        })
    };

    const jwt = await sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({
        message: 'you logged in successfully!',
        jwt: jwt
    });
});

app.post('api/v1/blog', (c) => {
    return c.json({
        message: 'you create blog successfully!',
    });
});

app.put('api/v1/blod', (c) => {
    return c.json({
        message: 'blog updated successfully!',
    });
});

app.get('api/v1/blog:id', (c) => {
    return c.json({
        message: 'here is your required blog',
    });
});

export default app;
