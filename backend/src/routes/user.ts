import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}>();

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
            },
        });

        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);

        return c.json({
            message: 'you signed up successfully!',
            jwt: jwt,
        });
    } catch (error) {
        console.error(error);
        c.status(411);
        return c.text('Invalid');
    }
});
