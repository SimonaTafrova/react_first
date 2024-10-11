import React, { useState, useRef, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';
import { createInsulinInsertion, createPrescriptionLog, updateSensorsCount, getCurrentUser,createAlert, searchAlerts, deleteAlert } from '../lib/appwrite';
import { router } from 'expo-router';
import moment from 'moment';
import { alertTemplates } from '../lib/tools';

const { width: screenWidth } = Dimensions.get('window');

const typeData = [
  { key: '1', value: 'NovoRapid' },
  { key: '2', value: 'Levemir' },
];

const prescriptionType = [
  { key: '1', value :'Monthly'},
  { key: '2', value :'Quarterly'},
  { key: '3', value :'Protocol'},

]



const generateUnits = () =>{
  const unitlist = [];
  let currentAmount = 0;
  for(let i=0; i<=40; i++){
    currentAmount = currentAmount + 0.5;
    unitlist.push({key: i.toString(), value: currentAmount})
    
  }
  return unitlist;
}

const unitData = generateUnits();


// Generate the last 30 days for the dropdown
const generatePastDates = (numDays) => {
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const date = moment().subtract(i, 'days').format('MMMM D, YYYY');
  
    dates.push({ key: i.toString(), value: date });
  }
  return dates;
};

const pastDatesData = generatePastDates(30);

const QuickActionButton = ({ onPress, imageSource, label, scale }) => (
  <Animated.View style={[styles.buttonContainer, { transform: [{ scale }] }]}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={imageSource} style={styles.buttonImage} />
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  </Animated.View>
);

const Actions = ({ posts }) => {
  const { user, setUser, setSensorAlerts, setPrescriptionAlerts } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const ITEM_SIZE = screenWidth * 0.6;
  const [insulinModalVisible, setInsulinModalVisible] = useState(false);
  const [prescriptionModalVisible, setPrescriptionModalVisible] = useState(false);
  const [form, setForm] = useState({
    type: '',
    units: '',
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    time: null,
    type: '',
  });

  const typeData = [
    { key: '1', value: user.rapidInsulin },
    { key: '2', value: user.slowInsulin },
  ];

  const quickActions = [
    { id: 'action1', label: 'Log Insulin', imageSource: require('../assets/images/insulin.png'), onPress: () => setInsulinModalVisible(true) },
    { id: 'action2', label: 'Start Sensor', imageSource: require('../assets/images/sensor.png'), onPress: () => {submitStartedSensor()} },
    { id: 'action3', label: 'Log Prescription', imageSource: require('../assets/images/prescription.png'), onPress: () => setPrescriptionModalVisible(true) },
   
  ];

  const data = [...quickActions, ...posts];

  // Debugging submit functions
  const submitInsulin = async () => {
    if (!form.type || !form.units) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      console.log("Submitting insulin:", form);
      await createInsulinInsertion({
        ...form,
        userId: user.$id,
        time: new Date(),
      });

      Alert.alert("Success", "Insulin log recorded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({ type: '', units: '' });
      setUploading(false);
      setInsulinModalVisible(false);
    }
  };

  const submitStartedSensor = async () => {
    try{
      await updateSensorsCount();
      const result = await getCurrentUser();
      if(result.sensors <= 2){
        await createAlert(alertTemplates.sensorAlert.type,alertTemplates.sensorAlert.message)
        setSensorAlerts(true)
      }else{
        setSensorAlerts(false)
      }
      setUser(result);
      Alert.alert("Success", "Sensors started successfully")
    }catch (error) {
      Alert.alert("Error", error.message);
    }
  }

  const submitPrescription = async () => {
    if (!prescriptionForm.time) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      console.log("Submitting prescription:", prescriptionForm.type);
      await createPrescriptionLog({
        ...prescriptionForm,
        userId: user.$id,
      });

      Alert.alert("Success", "Prescription log recorded successfully");
      handleAlert(prescriptionForm.type);
      setPrescriptionAlerts(false)
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setPrescriptionForm({ time: null });
      setUploading(false);
      setPrescriptionModalVisible(false);
    }
  };

  const handleAlert = async(typeOfPrescription) => {
    let existing;
    if(typeOfPrescription === '1'){
      existing = await searchAlerts(alertTemplates.monthlyPrescriptionAlert.type);
    } else if(typeOfPrescription === '2'){
      existing = await searchAlerts(alertTemplates.quarterlyPrescriptionAlert.type);
    } else {
      existing = await searchAlerts(alertTemplates.protocolAlert.type);
    }

    console.log(existing);
    console.log(typeOfPrescription);
    console.log(typeOfPrescription === 'Monthly')

    if(existing.length > 0){
      await deleteAlert(existing[0].$id);
    }
  }

  const insulinModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={insulinModalVisible}
      onRequestClose={() => setInsulinModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setInsulinModalVisible(false)}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setInsulinModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={styles.modalText}>Record Insulin Intake</Text>

              <SelectList
                setSelected={(value) => setForm({ ...form, type: value })}
                data={typeData}
                boxStyles={styles.dropdownBox}
                inputStyles={styles.dropdownText}
                dropdownTextStyles={styles.dropdownText}
              />

              <SelectList
                 setSelected={(value) => {
                 

                  let units = unitData.at(value).value
                
                  setForm({ ...form, units: units });
                }}
                data={unitData}
                boxStyles={[styles.dropdownBox, { marginTop: 20 }]}
                inputStyles={styles.dropdownText}
                dropdownTextStyles={styles.dropdownText}
              />

              <CustomButton
                title="Submit"
                handlePress={submitInsulin}
                containerStyles={styles.submitButton}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const prescriptionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={prescriptionModalVisible}
      onRequestClose={() => setPrescriptionModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setPrescriptionModalVisible(false)}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => setPrescriptionModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={styles.modalText}>Log Prescription</Text>

              <SelectList
                setSelected={(value) => setPrescriptionForm({ ...prescriptionForm, type: value })}
                data={prescriptionType}
                boxStyles={styles.dropdownBox}
                inputStyles={styles.dropdownText}
                dropdownTextStyles={styles.dropdownText}
              />

              <SelectList
                setSelected={(value) => {
                 

                  let date = pastDatesData.at(value).value
                
                  setPrescriptionForm({ ...prescriptionForm, time: date });
                }}
                data={pastDatesData}
                boxStyles={styles.dropdownBox}
                inputStyles={styles.dropdownText}
                dropdownTextStyles={styles.dropdownText}
              />

              <CustomButton
                title="Submit"
                handlePress={submitPrescription}
                containerStyles={styles.submitButton}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderItem = useCallback(({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
      (index + 1) * ITEM_SIZE,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <View>
        <QuickActionButton
          onPress={item.onPress}
          imageSource={item.imageSource}
          label={item.label}
          scale={scale}
        />
        {insulinModal()}
        {prescriptionModal()}
      </View>
    );
  }, [scrollX, insulinModalVisible, prescriptionModalVisible, form, prescriptionForm]);

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={(item) => item.id ?? item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment="center"
      snapToInterval={ITEM_SIZE}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: (screenWidth - ITEM_SIZE) / 2,
      }}
      renderItem={renderItem}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    />
  );
};

export default Actions;

const styles = StyleSheet.create({
  buttonContainer: {
    width: screenWidth * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 300,
    margin: 10,
    backgroundColor: '#FF8E01',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  buttonLabel: {
    color: '#161622',
    fontSize: 16,
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#161622',
    borderColor: '#FF8E01',
    borderWidth: 3,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8E01',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#FF8E01',
  },
  dropdownBox: {
    backgroundColor: '#161622',
    borderColor: '#FF8E01',
    width: '100%',
  },
  dropdownText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#FF8E01',
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
});