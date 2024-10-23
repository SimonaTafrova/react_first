import { StyleSheet, Text, View , Image} from 'react-native'
import {Tabs, Redirect} from 'expo-router'
import { icons } from "../../constants";
import { getAllAlerts } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import {useState, useEffect} from 'react';
import { alertTemplates } from '../../lib/tools';





const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View className="items-center justify-center gap-2">
            <Image
            source={icon}
            resizeMode="contain"
            tintColor={color}
            className="w-6 h-6"
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{color: color}}>
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
   
   
        const { sensorAlerts, setSensorAlerts, prescriptionAlerts, setPrescriptionAlerts  } = useGlobalContext();
       
        const checkAlerts = async () => {
            try {
              const posts = await getAllAlerts();
             
              
              if (posts.length > 0) {
                for(let i=0; i < posts.length; i++){
                    if(posts[i].type == alertTemplates.sensorAlert){
                        setSensorAlerts(true);
                    } else {
                        setPrescriptionAlerts(true);
                    }
                }
                setSensorAlerts(true);   
              } else {
                setSensorAlerts(false); 
              }
            } catch (error) {
             
            }
          };
        
        
          useEffect(() => {
              checkAlerts(); 
          
             
              const interval = setInterval(() => {
                checkAlerts(); 
              }, 3000); 
          
            
              return () => clearInterval(interval);
            }, []);
        



  return (
    <>
    <Tabs
    screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFA001',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
            backgroundColor: '#161622',
            borderTopWidth: 1,
            borderTopColor: '#232533',
            height: 100,
        }
    }}>
        <Tabs.Screen
        name="home"
        options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
                <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
                />

            )
        }}
            />
            <Tabs.Screen
        name="insulin"
        options={{
            title: 'Insulin',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
                <TabIcon
                icon={icons.bookmark}
                color={color}
                name="Insulin"
                focused={focused}
                />

            )
        }}
            />
            <Tabs.Screen
        name="sensors"
        options={{
            title: 'Sensors',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
                <TabIcon
                icon={icons.plus}
                color={color}
                name="Sensors"
                focused={focused}
                />

            )
        }}
            />
             <Tabs.Screen
        name="alerts"
        options={{
            title: 'Alerts',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
                <TabIcon
                icon={icons.plus}
                color={sensorAlerts ? 'red' : prescriptionAlerts? 'red' : color}
                name="Alerts"
                focused={focused}
                />

            )
        }}
            />
               <Tabs.Screen
        name="prescriptions"
        options={{
            title: 'Prescriptionss',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
                <TabIcon
                icon={icons.plus}
                color={color}
                name="Rx"
                focused={focused}
                />

            )
        }}
            />
            <Tabs.Screen
        name="profile"
        options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
                <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
                />

            )
        }}
            />
            </Tabs>
            </>
  )
}

export default TabsLayout

