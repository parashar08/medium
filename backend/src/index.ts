import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

interface EnvBindings {
    Bindings: {
        DATABASE_URL: string;
    };
}

const app = new Hono<EnvBindings>();

app.post('api/v1/signup', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    return c.json({
        message: 'you created account successfully!',
    });
});

app.post('api/v1/signin', (c) => {
    return c.json({
        message: 'you logged in successfully!',
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
