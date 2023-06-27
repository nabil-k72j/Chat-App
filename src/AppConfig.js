import { Client, Databases, Account } from 'appwrite';



export const PROJECT_ID = '649a102887eec05c9c33';
export const DATABASE_ID = '649a114428c9de9b4912';
export const COLLECTION_ID = '649a114bd9ec5dcd835a';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('649a102887eec05c9c33');


export const databases = new Databases(client);
export const account = new Account(client);

export default client;