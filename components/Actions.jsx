import { FlatList, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { images } from '../constants';

const QuickActionButton = ({ onPress, imageSource, label }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={imageSource} style={styles.buttonImage} />
      <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
  );
  

  const Actions = ({ posts }) => {
    const quickActions = [
      { id: 'action1', label: 'Insulin Insertions', imageSource: require('../assets/images/insulin.png'), onPress: () => console.log('Saved Insulin Insertion record') },
      { id: 'action2', label: 'Insulin Insertions', imageSource: require('../assets/images/insulin.png'), onPress: () => console.log('Saved Insulin Insertion record') },
      { id: 'action3', label: 'Insulin Insertions', imageSource: require('../assets/images/insulin.png'), onPress: () => console.log('Saved Insulin Insertion record') },
      { id: 'action4', label: 'Insulin Insertions', imageSource: require('../assets/images/insulin.png'), onPress: () => console.log('Saved Insulin Insertion record') },
      
    ];
  
    const data = [...quickActions, ...posts];
    return (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id ?? item.$id}
          renderItem={({ item }) =>
            item.label ? (
              <QuickActionButton
                onPress={item.onPress}
                imageSource={item.imageSource}
                label={item.label}
              />
            ) : (
              <Text className="text-3l text-white">{item.id}</Text>
            )
          }
          horizontal
        />
      );
    };
    
    export default Actions;
    
    const styles = StyleSheet.create({
      button: {
        width: 250,
        height: 250,
        margin: 10,
        backgroundColor: '#007BFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
      },
      buttonImage: {
        width: 80,
        height: 80,
        marginBottom: 10,
      },
      buttonLabel: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
      },
    });