import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3006;

const corsOptions = {
    origin: "*", // Allow all origins (not recommended for production)
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies and authorization headers
  };
  
  app.use(cors(corsOptions));
  app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Monsters API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});