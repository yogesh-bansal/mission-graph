import dotenv from "dotenv";
import { createApp } from "./server/app.mjs";

dotenv.config();

const port = Number(process.env.PORT || 8899);
const app = createApp();

app.listen(port, () => {
  console.log(`Mission Graph listening on port ${port}`);
});
