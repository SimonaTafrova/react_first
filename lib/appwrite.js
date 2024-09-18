
import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: "com.jsm.mymedical",
    projectId: "66ab6899000313c9fe0a",
    databaseId: '66ab6cbd000a83f6d5ed',
    userCollectionId: '66ab6ce6003ddc149a87',
    gpcallsCollectionId: '66ab6f69001dae622ebb',
    endocrinologistcallsCollectionId: '66ab703b003c1b546983',
    cgmsensorsCollectionId: '66ab707f0008c1ecd993',
    insertionsCollectionId: '66ab7127000ffa1e9f6c',
    videosCollectionId: '66bcf355003d36b52d98',
    prescriptionsCollectionId: '66bf6f2100090898b329',
    alertsCollectionId: '66e9654a00144c562cc8',
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
const storage = new Storage(client);

const testConnection = async () => {
  try {
     
      const ok = await account.get();
      console.log('Connection successful:', ok);
      console.log(ok)
      
  } catch (error) {
      console.error('Failed to connect:', error.code);
  }
};

testConnection();


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

export const signIn = async(email, password) => {
try {
    const session = await account.createEmailPasswordSession(email,password)
    return session;
    
} catch (error) {
    throw new Error(error)
}
};

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

export const getCurrentUser = async() => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error);
    }
}

export async function signOut() {
    try {
      const session = await account.deleteSession("current");
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

export async function getAllPosts() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videosCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(3)]
      );
  
      
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function searchPosts(query) {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.videosCollectionId,
        [Query.search("title", query)]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function createInsulinInsertion(form) {
    try {
      const newInsulinInsertion= await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.insertionsCollectionId,
        ID.unique(),
        {
          type: form.type,
          units: form.units,
          time: form.time,
          creator: form.userId,
        }
      );
  
      return newInsulinInsertion;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function createPrescriptionLog(form) {
    try {
      const newPrescriptionLog= await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.prescriptionsCollectionId,
        ID.unique(),
        {
          time: form.time,
          creator: form.userId,
        }
      );
  
      return newPrescriptionLog;
    } catch (error) {
      throw new Error(error);
    }
  }


  export async function getAllPrescriptions() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.prescriptionsCollectionId
      );
  
      console.log(posts.documents)
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getLastTenInsulinLogs() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.insertionsCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(10)]
      );
  
      
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  

  export async function getLastFivePrescriptions() {
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.prescriptionsCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(5)]
      );
   
      return posts.documents;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function setSensorsCount(form) {
    try {
      const userInfo = await getCurrentUser();
      console.log(userInfo)
      
         const result = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.userCollectionId, // collectionId
        userInfo.$id, // documentId
        {sensors: parseInt(form.sensors)}, // data (optional)
       
    )
    return result;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function updateSensorsCount() {
    try {
      const userInfo = await getCurrentUser();
      let sensorsCount = parseInt(userInfo.sensors) - 1;
      
         const result = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.userCollectionId, // collectionId
        userInfo.$id, // documentId
        {sensors: sensorsCount}, // data (optional)
       
    )
    return result;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  
export async function getAllAlerts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.alertsCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLastPrescription() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.prescriptionsCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(1)]
    );
 
    return posts.documents;
    
  } catch (error) {
    throw new Error(error);
  }
}
