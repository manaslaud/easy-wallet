import 'dotenv/config';
import express, { type Request, type Response, type Express } from 'express';
import { createUserAccount } from './controllers/createUserAccountController';
import { listUserAccounts } from './controllers/listUserAccountsController';
import { getSolanaBalance } from './controllers/getSolanaBalanceController';
import { getEthereumBalance } from './controllers/getEthereumBalanceController';
import { createContact } from './controllers/createContactController';
import { listContacts } from './controllers/listContactsController';

const app: Express = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
// Minimal CORS to allow the web app to call the API from a different origin
app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN || "http://localhost:3000";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// Router
const router = express.Router();
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "All good here"
  });
});

router.post("/createUserAccount", createUserAccount);
router.get("/accounts", listUserAccounts);
router.get("/balances/solana", getSolanaBalance);
router.get("/balances/ethereum", getEthereumBalance);
router.post("/contacts", createContact);
router.get("/contacts", listContacts);

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
