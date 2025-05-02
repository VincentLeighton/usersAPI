import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const port = 3006;

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

// Middleware to validate incoming JSON
app.use((err: any, req: Request, res: Response, next: Function) => {
    if (err instanceof SyntaxError && "body" in err) {
        res.status(400).send({ error: "Invalid JSON format." });
        return 
    }
    next();
});

const loadMonstersFromFile = (): Monster[] => {
  const data = fs.readFileSync("monsters.json", "utf-8");
try {
    return JSON.parse(data);
} catch (error) {
    console.error("Failed to parse monsters.json:", error);
    return [];
}
};

const monsters = loadMonstersFromFile();

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
try {
    JSON.stringify(updatedAttributes); // Check if the JSON is valid
} catch (error) {
    res.status(400).send("Invalid JSON format.");
    return;
}

if (
    updatedAttributes.hp &&
    (typeof updatedAttributes.hp !== "number" || updatedAttributes.hp < 0 || !Number.isInteger(updatedAttributes.hp))
) {
    res.status(400).send('Invalid value for attribute "hp". It must be a whole number.');
    return;
}
if (updatedAttributes.hp && updatedAttributes.hp > 1000000) {
    res.status(400).send('Health points (hp) cannot exceed 1,000,000.');
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
  Object.assign(monster.attributes, updatedAttributes);

  // Save the updated monsters to the file
  fs.writeFileSync('monsters.json', JSON.stringify(monsters, null, 2));

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

app.get('/export', (req: Request, res: Response) => {
    try {
        const data = fs.readFileSync('monsters.json', 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="monsters.json"');
        res.send(data);
    } catch (error) {
        res.status(500).send('Failed to read the monsters file.');
    }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
