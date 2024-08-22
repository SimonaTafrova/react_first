import React, { useState, useRef, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions, Modal, Alert, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
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
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [networkError, setNetworkError] = useState(null); // Added state for network error
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

  const quickActions = [
    { id: 'action1', label: 'Log Insulin', imageSource: require('../assets/images/insulin.png'), onPress: () => setInsulinModalVisible(true) },
    { id: 'action2', label: 'Start Sensor', imageSource: require('../assets/images/sensor.png'), onPress: () => console.log('Start Sensor') },
    { id: 'action3', label: 'Log Prescription', imageSource: require('../assets/images/prescription.png'), onPress: () => setPrescriptionModalVisible(true) },
    { id: 'action4', label: 'Insulin Insertions', imageSource: require('../assets/images/insulin.png'), onPress: () => console.log('Insulin Insertions') },
  ];

  const data = [...quickActions, ...posts];

  // Enhanced submit function with better error handling and logging
  const submitInsulin = async () => {
    if (!form.type || !form.units) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    setNetworkError(null);  // Reset network error state before attempting submission
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
      console.log("[Network Error]", error);  // Improved logging
      setNetworkError(error.message);  // Capture network error
      Alert.alert("Network Error", "Failed to log insulin. Please try again.");
    } finally {
      setForm({ type: '', units: '' });
      setUploading(false);
      setInsulinModalVisible(false);
    }
  };

  const submitPrescription = async () => {
    if (!prescriptionForm.time) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    setNetworkError(null);  // Reset network error state before attempting submission
    try {
      console.log("Submitting prescription:", prescriptionForm);
      await createPrescriptionLog({
        ...prescriptionForm,
        userId: user.$id,
      });

      Alert.alert("Success", "Prescription log recorded successfully");
      router.push("/home");
    } catch (error) {
      console.log("[Network Error]", error);  // Improved logging
      setNetworkError(error.message);  // Capture network error
      Alert.alert("Network Error", "Failed to log prescription. Please try again.");
    } finally {
      setPrescriptionForm({ time: null });
      setUploading(false);
      setPrescriptionModalVisible(false);
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
                setSelected={(value) => setForm({ ...form, units: parseInt(value) })}
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
    <View style={{ flex: 1 }}>
      {uploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF8E01" />
          <Text style={styles.loadingText}>Submitting...</Text>
        </View>
      )}
      {networkError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Network Error: {networkError}</Text>
        </View>
      )}
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id || item.$id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  button: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#FF8E01',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  buttonImage: {
    width: 60,
    height: 60,
  },
  buttonLabel: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  closeButtonText: {
    color: '#FF8E01',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dropdownBox: {
    width: '100%',
    borderColor: '#FF8E01',
  },
  dropdownText: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#FF8E01',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FF8E01',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  errorText: {
    color: '#721C24',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Actions;
