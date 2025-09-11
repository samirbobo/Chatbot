import { Account, Avatars, Client, Storage, TablesDB } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Your API Endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const tablesDB = new TablesDB(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

const APPWRITE_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const DATABASE_ID = "todoApp"; 
const TABLE_ID = "tasks";

export {
  client,
  tablesDB,
  account,
  avatars,
  storage,
  APPWRITE_BUCKET_ID,
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  DATABASE_ID,
  TABLE_ID,
};
