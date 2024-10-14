import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

interface EnvBindings {
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
}

const app = new Hono<EnvBindings>();

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);
