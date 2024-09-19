import { getLastPrescription, createAlert } from "./appwrite";
import useAppwrite from "./useAppwrite";
import { useGlobalContext } from "../context/GlobalProvider";

export const  run =  () => {

    const { user } = useGlobalContext();
    const lastPrescription = useAppwrite(getLastPrescription);
    let dateOfPrescription = new Date(lastPrescription.data[0].time)

    console.log(dateOfPrescription.getMonth()+1)
    console.log(dateOfPrescription.getDate())
    let currentDate = new Date();
    console.log(currentDate)

    let daysPassedSincePrescripton =  Math.floor((currentDate-dateOfPrescription)/(24*3600*1000))

    console.log(  Math.floor((currentDate-dateOfPrescription)/(24*3600*1000)))

    if(daysPassedSincePrescripton >= 4){
        createPrescriptionAlert;
        console.log('HI')

      

    }

    const createPrescriptionAlert = async() => {
        try {
            console.log("Creating alert");
            await createAlert("You need to collect your new prescription", user.$id);
      
            Alert.alert("Success", "Alert recorded");
            
          } catch (error) {
            Alert.alert("Error", error.message);
          } 

    }
}