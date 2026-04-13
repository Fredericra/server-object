import { defineConfig } from "sanity";
import { config } from "dotenv";
import { shemaTypes } from "../Shema";

config();

export default defineConfig({
        projectId: process.env.PROJECT_ID!,
        dataset: process.env.DATASET!,
        apiVersion: process.env.API_VERSION!,
        token: process.env.TOKEN!,
        useCdn: false,
        schema:{types:[...shemaTypes]},
})


