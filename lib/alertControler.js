import { getLastPrescription } from "./appwrite";
import useAppwrite from "./useAppwrite";

export const run = () => {

    const lastPrescription = useAppwrite(getLastPrescription);
    let dateOfPrescription = new Date(lastPrescription.data[0].time)

    console.log(dateOfPrescription.getMonth()+1)
    console.log(dateOfPrescription.getDate())
    let currentDate = new Date();
    console.log(currentDate)

    console.log(  Math.floor((currentDate-dateOfPrescription)/(24*3600*1000)))
}