import express, { type Request, type Response, type Express } from 'express';
import { createUserAccount } from './controllers/createUserAccountController';

const app: Express = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());

// Router
const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "All good here"
  });
});

router.post("/createUserAccount", createUserAccount);

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
