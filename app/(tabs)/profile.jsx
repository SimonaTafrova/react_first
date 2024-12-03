import { ScrollView, Text, View, TouchableOpacity, Image, Modal, TextInput, Alert, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from '../../components/CustomButton'; // Assuming you have a CustomButton component
import { setInsulinTypes, getCurrentUser, updatePassword, setUsername, updateEmail, signOut } from '../../lib/appwrite';
import { icons } from "../../constants";
import { router } from "expo-router";

const StaticQuickActionButton = ({ onPress, imageSource, label }) => (
  <View className="w-[48%] mb-5">
    <TouchableOpacity className="bg-[#FF8E01] justify-center items-center rounded-lg py-5" onPress={onPress}>
      <Image source={imageSource} className="w-20 h-20 mb-3" />
      <Text className="text-[#161622] text-center text-lg">{label}</Text>
    </TouchableOpacity>
  </View>
);

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [modals, setModals] = useState({
    insulinModal: false,
    emailModal: false,
    passwordModal: false,
    usernameModal: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    rapidInsulin: '',
    slowInsulin: '',
    email: '',
    password: '',
    confirmPassword: '',
    currentPassword: '', // Add this field for verification
    username: '',
  });
  
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in", { reset: true });
  };

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
    // Add password verification for sensitive changes
    if(type == 'email' || type == 'password'){
      if (!formData.currentPassword ) {
        Alert.alert('Error', 'Please enter your current password to verify.');
        return;
      }
    }
  

    // Handle submit logic for each modal
    switch (type) {
      case 'insulin':
        Alert.alert('Success', `Insulin Type: ${formData.rapidInsulin}, Units: ${formData.slowInsulin}`);
        submitInsulinTypes(formData.rapidInsulin, formData.slowInsulin)
        break;
      case 'email':
        Alert.alert('Success', `Email Changed to: ${formData.email}`);
        submitEmailUpdate(formData.email, formData.currentPassword);
        break;
      case 'password':
        if (formData.password === formData.confirmPassword) {
          Alert.alert('Success', `Password changed`);
          submitPasswordUpdate(formData.password, formData.currentPassword);
        } else {
          Alert.alert('Error', 'Passwords do not match');
        }
        break;
      case 'username':
        Alert.alert('Success', `Username Changed to: ${formData.username}`);
        submitUsernameUpdate(formData.username)
        break;
      default:
        break;
    }
    toggleModal(type + 'Modal');
  };

  const submitInsulinTypes = async(rapid, slow) => {
    setIsSubmitting(true);

    try {
      await setInsulinTypes(rapid, slow);
       const result = await getCurrentUser();
       setUser(result);
     
    } catch (error) {
      Alert.alert('Error', error.message)
      
    } finally {
      setFormData({ rapidInsulin : '' }, {slowInsulin : ''});
      setIsSubmitting(false);
    }

  }

  const submitPasswordUpdate = async(newPassword, oldPassword) => {
    try {
      await updatePassword(newPassword,oldPassword);
       const result = await getCurrentUser();
       setUser(result);
     
    } catch (error) {
      Alert.alert('Error', error.message)
      
    } finally {
      setFormData({ password : '' }, {currentPassword : ''}, {confirmPassword : ''});
      setIsSubmitting(false);
    }
  }

  const submitEmailUpdate = async(email, password) => {
    try {
      await updateEmail(email,password);
       const result = await getCurrentUser();
       setUser(result);
     
    } catch (error) {
      Alert.alert('Error', error.message)
      
    } finally {
      setFormData({ email : '' }, {currentPassword : ''});
      setIsSubmitting(false);
    }
  }

   const submitUsernameUpdate = async(username) => {
    try {
      await setUsername(username);
       const result = await getCurrentUser();
       setUser(result);
     
    } catch (error) {
      Alert.alert('Error', error.message)
      
    } finally {
      setFormData({ username : '' });
      setIsSubmitting(false);
    }
  }



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

        <View className="mt-1.5">
              <TouchableOpacity
              onPress= {logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
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
                  <TextInput
                    className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
                    placeholder="Rapid Insulin"
                    placeholderTextColor="#FFFFFF" 
                    value={formData.rapidInsulin}
                    onChangeText={(text) => handleInputChange('rapidInsulin', text)}
                  />
                  <TextInput
                    className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
                    placeholder="Slow-acting Insulin"
                    placeholderTextColor="#FFFFFF" 
                    value={formData.slowInsulin}
                    onChangeText={(text) => handleInputChange('slowInsulin', text)}
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
                  <Text className="text-lg font-bold mb-4 text-center text-secondary-200">Change Email</Text>
                  <TextInput
                    className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
                    placeholder="New Email"
                    placeholderTextColor="#FFFFFF" 
                    value={formData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                  />
                  <TextInput
                    className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
                    placeholder="Current Password"
                    placeholderTextColor="#FFFFFF" 
                    secureTextEntry={true}
                    value={formData.currentPassword}
                    onChangeText={(text) => handleInputChange('currentPassword', text)}
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
                <View className="bg-primary p-6 rounded-lg w-[90%] border-4 border-secondary-200">
                  <Text className="text-lg font-bold mb-4 text-center text-secondary-200">Change Password</Text>
                  <TextInput
                    className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
                    placeholder="New Password"
                    placeholderTextColor="#FFFFFF" 
                    secureTextEntry={true}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                  />
                  <TextInput
                    className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
                    placeholder="Confirm New Password"
                    placeholderTextColor="#FFFFFF" 
                    secureTextEntry={true}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  />
                  <TextInput
                    className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
                    placeholder="Current Password"
                    placeholderTextColor="#FFFFFF" 
                    secureTextEntry={true}
                    value={formData.currentPassword}
                    onChangeText={(text) => handleInputChange('currentPassword', text)}
                  />
                  <CustomButton title="Submit" handlePress={() => handleSubmit('password')} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Username Modal */}
{/* Username Modal */}
<Modal
  animationType="fade"
  transparent={true}
  visible={modals.usernameModal}
  onRequestClose={() => toggleModal('usernameModal')}
>
  <TouchableWithoutFeedback onPress={() => toggleModal('usernameModal')}>
    {/* Wrap everything inside a single parent View */}
    <View className="flex-1 justify-center items-center bg-black bg-opacity-60">
      <TouchableWithoutFeedback>
        <View className="bg-primary p-6 rounded-lg w-[90%] border-4 border-secondary-200">
          <Text className="text-lg font-bold mb-4 text-center text-secondary-200">Change Username</Text>
          <TextInput
            className="border bg-primary border-secondary-200 rounded p-3 mb-3 text-white"
            placeholder="New Username"
            placeholderTextColor="#FFFFFF" 
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
  )
}
export default Profile;