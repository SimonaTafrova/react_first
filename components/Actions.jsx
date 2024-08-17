import React, { useState, useRef } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions, Modal,Alert, Pressable, TouchableWithoutFeedback } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';
import { createInsulinInsertion, createPrescriptionLog } from '../lib/appwrite';
import { router } from 'expo-router';

import moment from 'moment';

const { width: screenWidth } = Dimensions.get('window');

const typeData = [
  { key: '1', value: 'NovoRapid' },
  { key: '2', value: 'Levemir' },
];

const unitData = [
  { key: '1', value: 1 },
  { key: '2', value: 2 },
  { key: '3', value: 3 },
  { key: '4', value: 4 },
  { key: '5', value: 5 },
];

// Generate the last 30 days for the dropdown
const generatePastDates = (numDays) => {
  const dates = [];
  for (let i = 0; i < numDays; i++) {
    const date = moment().subtract(i, 'days').format('MMMM D, YYYY'); // Format date
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
  const { user } = useGlobalContext();
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

  });
  const [selectedDate, setSelectedDate] = useState(''); // Track selected date

  const quickActions = [
    { id: 'action1', label: 'Log Insulin', imageSource: require('../assets/images/insulin.png'), onPress: () => setInsulinModalVisible(true) },
    { id: 'action2', label: 'Start Sensor', imageSource: require('../assets/images/sensor.png'), onPress: () => console.log('Start Sensor') },
    { id: 'action3', label: 'Log Prescription', imageSource: require('../assets/images/prescription.png'), onPress: () => setPrescriptionModalVisible(true) },
    { id: 'action4', label: 'Insulin Insertions', imageSource: require('../assets/images/insulin.png'), onPress: () => console.log('Insulin Insertions') },
  ];

  const data = [...quickActions, ...posts];

  const submitInsulin = async () => {
    if ((form.type === "") | (form.units === null)) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createInsulinInsertion({
        ...form,
        userId: user.$id,
        time: new Date(),
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        type: "",
        units: null,
      });

      setUploading(false);
    }
  };

  const submitPrescription = async () => {
    if ((form.time === "")) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createPrescriptionLog({
        ...prescriptionForm,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        time : null
      });

      setUploading(false);
    }
  };


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
              {/* Close (X) button */}
              <TouchableOpacity onPress={() => setInsulinModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={styles.modalText}>Record Insulin Intake</Text>

              {/* Type Dropdown */}
              <SelectList
                setSelected={(value) => setForm({ ...form, type: value })}
                data={typeData}
                boxStyles={{ backgroundColor: '#161622', borderColor: '#FF8E01', width: '100%' }}
                inputStyles={{ color: 'white' }}
                dropdownTextStyles={{ color: 'white' }}
              />

              {/* Units Dropdown */}
              <SelectList
                setSelected={(value) => setForm({ ...form, units: parseInt(value) })}
                data={unitData}
                boxStyles={{ backgroundColor: '#161622', borderColor: '#FF8E01', marginTop: 20, width: '100%' }}
                inputStyles={{ color: 'white' }}
                dropdownTextStyles={{ color: 'white' }}
              />

              {/* Submit Button */}
              <CustomButton
                title="Submit"
                handlePress={submitInsulin}
                containerStyles={[styles.submitButton]}
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
              {/* Close (X) button */}
              <TouchableOpacity onPress={() => setPrescriptionModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>

              <Text style={styles.modalText}>Log Prescription</Text>

              {/* Dropdown for past dates */}
              <SelectList
                setSelected={(value) =>  setPrescriptionForm({ ...form, time: value })}
                data={pastDatesData}
                boxStyles={{ backgroundColor: '#161622', borderColor: '#FF8E01', width: '100%' }}
                inputStyles={{ color: 'white' }}
                dropdownTextStyles={{ color: 'white' }}
              />

              <CustomButton
                title="Submit"
                handlePress={submitPrescription}
                containerStyles={[styles.submitButton]}
              />
             
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

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
      renderItem={({ item, index }) => {
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
      }}
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
  submitButton: {
    backgroundColor: '#FF8E01',
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedDateText: {
    color: 'white',
    marginTop: 10,
  },
});