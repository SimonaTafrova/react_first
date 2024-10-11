import { ScrollView, Text, View, TouchableOpacity, Image, Modal, TextInput, Alert, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from '../../components/CustomButton'; // Assuming you have a CustomButton component

// Reusable quick action button component without animation
const StaticQuickActionButton = ({ onPress, imageSource, label }) => (
  <View className="w-[48%] mb-5">
    <TouchableOpacity className="bg-[#FF8E01] justify-center items-center rounded-lg py-5" onPress={onPress}>
      <Image source={imageSource} className="w-20 h-20 mb-3" />
      <Text className="text-[#161622] text-center text-lg">{label}</Text>
    </TouchableOpacity>
  </View>
);

const Profile = () => {
  const { user } = useGlobalContext();
  const [modals, setModals] = useState({
    insulinModal: false,
    emailModal: false,
    passwordModal: false,
    usernameModal: false,
  });
  const [formData, setFormData] = useState({
    insulinType: '',
    units: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  const toggleModal = (modal) => {
    setModals((prevState) => ({
      ...prevState,
      [modal]: !prevState[modal],
    }));
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (type) => {
    // Handle submit logic for each modal
    switch (type) {
      case 'insulin':
        Alert.alert('Success', `Insulin Type: ${formData.insulinType}, Units: ${formData.units}`);
        break;
      case 'email':
        Alert.alert('Success', `Email Changed to: ${formData.email}`);
        break;
      case 'password':
        if (formData.password === formData.confirmPassword) {
          Alert.alert('Success', `Password changed`);
        } else {
          Alert.alert('Error', 'Passwords do not match');
        }
        break;
      case 'username':
        Alert.alert('Success', `Username Changed to: ${formData.username}`);
        break;
      default:
        break;
    }
    toggleModal(type + 'Modal');
  };

  const quickActions = [
    { id: 'action1', label: 'Set Insulin Types', imageSource: require('../../assets/images/insulin.png'), modal: 'insulinModal' },
    { id: 'action2', label: 'Change Email', imageSource: require('../../assets/images/sensor.png'), modal: 'emailModal' },
    { id: 'action3', label: 'Change Password', imageSource: require('../../assets/images/prescription.png'), modal: 'passwordModal' },
    { id: 'action4', label: 'Change Username', imageSource: require('../../assets/images/prescription.png'), modal: 'usernameModal' },
  ];

  return (
    <SafeAreaView className="bg-black flex-1">
      <ScrollView className="px-4 my-6">
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold">
            {user?.username}
          </Text>
          <Text className="text-gray-400 text-lg mt-2">
            What would you like to do?
          </Text>
        </View>

        {/* Quick Actions in 2 rows */}
        <View className="flex-row flex-wrap justify-between">
          {quickActions.map((action) => (
            <StaticQuickActionButton
              key={action.id}
              onPress={() => toggleModal(action.modal)}
              imageSource={action.imageSource}
              label={action.label}
            />
          ))}
        </View>

        {/* Insulin Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modals.insulinModal}
          onRequestClose={() => toggleModal('insulinModal')}
        >
          <TouchableWithoutFeedback onPress={() => toggleModal('insulinModal')}>
            <View className="flex-1 justify-center items-center bg-black bg-opacity-60">
              <TouchableWithoutFeedback>
                <View className="bg-primary p-6 rounded-lg w-[90%] border-4 border-secondary-200">
                  <Text className="text-lg font-bold mb-4 text-center text-secondary-200">Set Insulin Types</Text>
                  <Text className="text-md mb-4 text-left text-white">Rapid Insulin</Text>
                  <TextInput
                    className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
                    value={formData.insulinType}
                    onChangeText={(text) => handleInputChange('insulinType', text)}
                  />
                   <Text className="text-md mb-4 text-left text-white">Rapid Insulin</Text>
                  <TextInput
                   className="border border-gray-300 rounded p-3 mb-3"
                    value={formData.units}
                    onChangeText={(text) => handleInputChange('units', text)}
                  />
                  <CustomButton title="Submit" handlePress={() => handleSubmit('insulin')} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Email Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modals.emailModal}
          onRequestClose={() => toggleModal('emailModal')}
        >
          <TouchableWithoutFeedback onPress={() => toggleModal('emailModal')}>
            <View className="flex-1 justify-center items-center bg-black bg-opacity-60">
              <TouchableWithoutFeedback>
              <View className="bg-primary p-6 rounded-lg w-[90%] border-4 border-secondary-200">
                  <Text className="text-lg font-bold mb-4 text-center text-secondary-200">Change e-mail</Text>
                  <Text className="text-md mb-4 text-left text-white">Please enter your new e-mail</Text>
                  <TextInput
                    className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
              
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                  />
                  <CustomButton title="Submit" handlePress={() => handleSubmit('email')} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Password Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modals.passwordModal}
          onRequestClose={() => toggleModal('passwordModal')}
        >
          <TouchableWithoutFeedback onPress={() => toggleModal('passwordModal')}>
            <View className="flex-1 justify-center items-center bg-black bg-opacity-60">
              <TouchableWithoutFeedback>
                <View className="bg-white p-6 rounded-lg w-[90%]">
                  <Text className="text-lg font-bold mb-4 text-center">Change Password</Text>
                  <TextInput
                    placeholder="New Password"
                    className="border border-gray-300 rounded p-3 mb-3"
                    value={formData.password}
                    secureTextEntry={true}
                    onChangeText={(text) => handleInputChange('password', text)}
                  />
                  <TextInput
                    placeholder="Confirm Password"
                    className="border border-gray-300 rounded p-3 mb-3"
                    value={formData.confirmPassword}
                    secureTextEntry={true}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  />
                  <CustomButton title="Submit" handlePress={() => handleSubmit('password')} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Username Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modals.usernameModal}
          onRequestClose={() => toggleModal('usernameModal')}
        >
          <TouchableWithoutFeedback onPress={() => toggleModal('usernameModal')}>
            <View className="flex-1 justify-center items-center bg-black bg-opacity-60">
              <TouchableWithoutFeedback>
                <View className="bg-white p-6 rounded-lg w-[90%]">
                  <Text className="text-lg font-bold mb-4 text-center">Change Username</Text>
                  <TextInput
                    placeholder="New Username"
                    className="border border-gray-300 rounded p-3 mb-3"
                    value={formData.username}
                    onChangeText={(text) => handleInputChange('username', text)}
                  />
                  <CustomButton title="Submit" handlePress={() => handleSubmit('username')} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
