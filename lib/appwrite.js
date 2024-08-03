
import { Account, Avatars, Client, Databases, ID } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.mymedical',
    projectId: '66ab6899000313c9fe0a',
    databaseId: '66ab6cbd000a83f6d5ed',
    userCollectionId: '66ab6ce6003ddc149a87',
    gpcallsCollectionId: '66ab6f69001dae622ebb',
    endocrinologistcallsCollectionId: '66ab703b003c1b546983',
    cgmsensorsCollectionId: '66ab707f0008c1ecd993',
    insertionsCollectionId: '66ab7127000ffa1e9f6c',
    storageId: '66ab71e70014f3cc44ce',

}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform)// Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(email, password, username) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);
        
        await signIn(email, password);

        const newUser = await databases.createDocument(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId, ID.unique(), {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }


}

export async function signIn(email, password){
try {
    const session = await account.createEmailPasswordSession(email,password)
    return session;
    
} catch (error) {
    throw new Error(error)
}
}

