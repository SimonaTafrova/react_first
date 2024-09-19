import { getLastPrescription, createAlert } from "./appwrite";
import useAppwrite from "./useAppwrite";
import { useGlobalContext } from "../context/GlobalProvider";

export const  run =  () => {

    const { user } = useGlobalContext();
    const lastPrescription = useAppwrite(getLastPrescription);
    

    console.log(lastPrescription.data[0].time)
    let currentDate = new Date();
    console.log(currentDate)

   


}