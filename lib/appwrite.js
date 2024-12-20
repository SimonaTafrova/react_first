
import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: "com.jsm.mymedical",
    projectId: "66ab6899000313c9fe0a",
    databaseId: '66ab6cbd000a83f6d5ed',
    userCollectionId: '66ab6ce6003ddc149a87',
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

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log('User logged in successfully:', session);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}


export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getCurrentUser() {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
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
          type: form.type,
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
      const userInfo = await getCurrentUser();
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.prescriptionsCollectionId
        [Query.equal("creator", userInfo.$id)]
      );
  
      console.log(posts.documents)
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getLastFifteenInsulinLogs() {
    try {
      const userInfo = await getCurrentUser();
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.insertionsCollectionId,
        [Query.equal("creator", userInfo.$id),Query.orderDesc("$createdAt"), Query.limit(15)]
      );
  
      
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }

  

  export async function getLastSixPrescriptions() {
    try {
      const userInfo = await getCurrentUser();
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.prescriptionsCollectionId,
        [Query.equal("creator", userInfo.$id),Query.orderDesc("$createdAt"), Query.limit(6)]
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

  export async function setInsulinTypes(rapid, slow) {
    try {
      const userInfo = await getCurrentUser();
      console.log(userInfo)
      
         const result = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.userCollectionId, // collectionId
        userInfo.$id, // documentId
      {rapidInsulin : rapid,slowInsulin: slow}, // data (optional)
       
    )
    return result;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function setUsername(username) {
    try {
      const userInfo = await getCurrentUser();
      console.log(userInfo)
      
         const result = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.userCollectionId, // collectionId
        userInfo.$id, // documentId
      {username : username} // data (optional)
       
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
    const userInfo = await getCurrentUser();
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.alertsCollectionId,
      [Query.equal("creator", userInfo.$id),Query.orderDesc("$createdAt")]
    );

    
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getLastPrescription() {
  try {
    const userInfo = await getCurrentUser();
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.prescriptionsCollectionId,
      [Query.equal("creator", userInfo.$id),Query.orderDesc("$createdAt"), Query.limit(1)]
    );
 
    return posts.documents;
    
  } catch (error) {
    throw new Error(error);
  }
}


export async function getTypeOfPrescription(type) {
  try {
    const userInfo = await getCurrentUser();
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.prescriptionsCollectionId,
      [Query.equal("creator", userInfo.$id),Query.equal("type", type), Query.orderDesc("time"), Query.limit(1)]
     
    );
 
    return posts.documents;
    
  } catch (error) {
    throw new Error(error);
  }
}
export async function createAlert(type,message,creator,time) {
  try {
   
 
    const newAlert= await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.alertsCollectionId,
      ID.unique(),
      {
        type: type,
        message: message,
        creator: creator,
        time: time

     
      }
    );

    console.log("OK")

    return newAlert;
  } catch (error) {
    console.log(error.message)
    throw new Error(error);
  }
}

export async function updateAlert(isValid, id) {
  try {
    
    
       const result = await databases.updateDocument(
      appwriteConfig.databaseId, // databaseId
      appwriteConfig.alertsCollectionId, // collectionId
      id, // documentId
      {isValid: isValid}, // data (optional)
     
  )
  return result;
    
  } catch (error) {
    throw new Error(error);
  }
}

export async function searchAlerts(type) {
  try {
    const userInfo = await getCurrentUser();
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.alertsCollectionId,
      [Query.equal("creator", userInfo.$id),Query.equal("type", type)]
    );


   
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteAlert(id){
  try {
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.alertsCollectionId,
      id
    );

   console.log(result);
  } catch (error) {
    throw new Error(error);
  }
}

export async function updatePassword(newPassword, currentPassword) {
  try{

    const result = await account.updatePassword(newPassword,currentPassword);
    console.log(result);
  } catch (error){
    throw new Error(error);
  }
  
}

export async function updateEmail(email,password) {
  try{

    const update = await account.updateEmail(email, password)
    const userInfo = await getCurrentUser();
 
      
       const result = await databases.updateDocument(
        appwriteConfig.databaseId, // databaseId
        appwriteConfig.userCollectionId, // collectionId
        userInfo.$id, // documentId
      {email : email})

  } catch (error){
    throw new Error(error);
  }
  
}