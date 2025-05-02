import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const port = 3006;

const monsters: Monster[] = [
    {
      id: 1,
      name: 'Monster A',
      attributes: {
        type: 'Fire',
        hp: 100,
        traits: {
          canCatch: true,
          canEvolve: false,
          isBoss: false
        }
      }
    },
    {
      id: 2,
      name: 'Monster B',
      attributes: {
        type: 'Water',
        hp: 150,
        traits: {
          canCatch: true,
          canEvolve: true,
          isBoss: true
        }
      }
    },
    {
      id: 3,
      name: 'Monster C',
      attributes: {
        type: 'Earth',
        hp: 120,
        traits: {
          canCatch: false,
          canEvolve: true,
          isBoss: false
        }
      }
    }
  ];

interface Monster {
    id: number;
    name: string;
    attributes: Attributes;
    }

interface Attributes {
    type: string;
    hp: number;
    traits: Traits;
}

interface Traits {
    canCatch: boolean;
    canEvolve: boolean;
    isBoss: boolean;
}

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

app.options("/users/:id/preferences", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "*");
    res.send();
  });

app.patch('/users/:id/preferences', (req: Request, res: Response) => {
    const monsterId = req.params.id;


    res.send(`Preferences for user ${monsterId} updated successfully!`);
  });

app.get('/monsters', (req: Request, res: Response) => {
  
  res.json(monsters);
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});