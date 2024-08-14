import { StyleSheet, Text, View , Image} from 'react-native'
import {Tabs, Redirect} from 'expo-router'
import { icons } from "../../constants";

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
                name="Insulin log"
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
                color={color}
                name="Alerts"
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

