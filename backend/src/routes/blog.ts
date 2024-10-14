import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify, decode } from 'hono/jwt';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string;
    }
}>();

blogRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header('Authorization') || '';
    const user = await verify(authHeader, c.env.JWT_SECRET);

    if (user && typeof user.id === 'string') {
        c.set('userId', user.id);
        await next();
    } else {
        c.status(403);
        c.json({
            message: "you are not logged in"
        })
    }
});

blogRouter.post('/create', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const body = await c.req.json();
        const authorId = c.get('userId');

        const blog = await prisma.post.create({
            data: {
                titile: body.titile,
                content: body.content,
                authorId: authorId,
            },
        });

        return c.json({
            id: blog.id,
        });
    } catch (error) {
        console.error(error);
    }
});

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const body = await c.req.json();

        const blog = await prisma.post.update({
            where: {
                id: body.id,
            },
            data: {
                titile: body.titile,
                content: body.content,
            },
        });

        return c.json({
            id: blog.id,
        });
    } catch (error) {
        console.error(error);
    }
});

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try {
        const id = c.req.param('id');

        const blog = await prisma.post.findFirst({
            where: {
                id,
            },
        });

        return c.json({
            blog
        })
    } catch (error) {
        console.error(error);
    }
});

blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blogs = prisma.post.findMany();

    return c.json(blogs);
})
