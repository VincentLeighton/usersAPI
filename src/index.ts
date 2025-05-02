import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const port = 3006;

const monsters: Monster[] = [
  {
    id: 1,
    name: "Blazefang",
    attributes: {
      type: "Fire",
      hp: 100,
      traits: {
        canCatch: true,
        canEvolve: false,
        isBoss: false,
      },
    },
  },
  {
    id: 2,
    name: "Aqualash",
    attributes: {
      type: "Water",
      hp: 150,
      traits: {
        canCatch: true,
        canEvolve: true,
        isBoss: true,
      },
    },
  },
  {
    id: 3,
    name: "Terraclaw",
    attributes: {
      type: "Earth",
      hp: 120,
      traits: {
        canCatch: false,
        canEvolve: true,
        isBoss: false,
      },
    },
  },
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

app.get("/", (req: Request, res: Response) => {
  res.send("Monsters API is running!");
});

app.options("/monster/:id/attribues", (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "*");
  res.send();
});

app.patch("/monster/:id/attributes", (req: Request, res: Response) => {
  const monsterId = parseInt(req.params.id);
  const updatedAttributes = req.body;

  const monster = monsters.find((m) => m.id === monsterId);

  if (!monster) {
    res.status(404).send(`Monster with ID ${monsterId} not found.`);
    return;
  }

  // Validate the updated attributes
  if (updatedAttributes.type && typeof updatedAttributes.type !== "string") {
    res.status(400).send('Invalid type for attribute "type".');
    return;
  }
  if (
    updatedAttributes.hp &&
    (typeof updatedAttributes.hp !== "number" || updatedAttributes.hp < 0)
  ) {
    res.status(400).send('Invalid value for attribute "hp".');
    return;
  }
  if (updatedAttributes.traits) {
    const traits = updatedAttributes.traits;
    if (
      typeof traits.canCatch !== "undefined" &&
      typeof traits.canCatch !== "boolean"
    ) {
      res.status(400).send('Invalid value for trait "canCatch".');
      return;
    }
    if (
      typeof traits.canEvolve !== "undefined" &&
      typeof traits.canEvolve !== "boolean"
    ) {
      res.status(400).send('Invalid value for trait "canEvolve".');
      return;
    }
    if (
      typeof traits.isBoss !== "undefined" &&
      typeof traits.isBoss !== "boolean"
    ) {
      res.status(400).send('Invalid value for trait "isBoss".');
      return;
    }
  }
  // Update the monster's attributes
  const updatedMonster = {
    ...monster,
    attributes: { ...monster.attributes, ...updatedAttributes },
  };
  monsters.forEach((m, index) => {
    if (m.id === monsterId) {
      monsters[index] = updatedMonster;
    }
  });

  res.send(`Attributes for monster ${monsterId} updated successfully!`);
});

app.get("/monsters", (req: Request, res: Response) => {
  res.json(monsters);
});

app.get("/monster/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const monster = monsters.find((monster) => monster.id === parseInt(id));

  if (monster) {
    res.json(monster);
  } else {
    res.status(404).json({ message: "Monster not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
