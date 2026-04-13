import { createClient } from "@sanity/client";
import { config } from "dotenv";

config();


const admin = createClient({
  projectId: process.env.PROJECT_ID!,
  dataset: process.env.DATASET!,
  apiVersion: process.env.API_VERSION!,
  token: process.env.TOKEN!,
  useCdn: false,
});


const database = { admin }

export default database;
