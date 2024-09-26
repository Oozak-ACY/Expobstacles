import { StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {

  const insets = useSafeAreaInsets()
  const navigation: any = useNavigation()

  const styles = StyleSheet.create({
    safeView: {
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginRight: insets.right,
      marginLeft: insets.left,
      backgroundColor: "white",
      height: "100%",
    },
    boutonSupprimer: {
      height: 20,
      width: 100,
      backgroundColor: 'red',
      display:"flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 15
    },
    textBoutonSupprimer: {
      fontSize: 15,
      fontWeight: "bold"
    },
    obstacleList: {
      display: "flex",
      marginTop: 20,
      padding: 10
    },
    obstacleLine: {
      padding: 7,
      height: 200,
      backgroundColor: "grey",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      marginBottom: 4
    }
  });

  const [obstacles, setObstacles] = useState<any>([])
  

  const fetchObstacles = async () => {
    try {
      const storedObstacles = await AsyncStorage.getItem('obstacles');
      const updatedObstacles = storedObstacles ? JSON.parse(storedObstacles) : [];
      setObstacles(updatedObstacles);
      console.log(updatedObstacles);
    } catch (error) {
      console.log("Erreur lors du chargement des obstacles : ", error);
    }
  };


  useFocusEffect(
    React.useCallback(() => {
      fetchObstacles();
    }, [])
  );

  const onSupprimer = async (id: string) => {
    const actualObstacles = obstacles.filter((obstacle: any) => obstacle.obstacleId !== id);
    
    try {
      await AsyncStorage.setItem('obstacles', JSON.stringify(actualObstacles));
      setObstacles(actualObstacles);
      Alert.alert('Succès', 'Suppression de l\'obstacle');
    } catch (error) {
      console.log("Erreur lors de la suppression de l'obstacle :", error);
    }
  };

  const onNavigateModify = async (id: string) => {
    navigation.navigate('modify_obstacle', { id });
  }

  return (
    <View style={styles.safeView}>
      <Link push={true} href="./add_obstacle" asChild>
        <TouchableOpacity style={{ height: 30, width: 60, backgroundColor: 'green', marginTop: 25, marginLeft: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50}}>
          <Text>Ajouter</Text>
        </TouchableOpacity>
      </Link>
      <FlatList
        style={styles.obstacleList}
        data={obstacles}
        renderItem={({ item }) => <View style={styles.obstacleLine} >
            <TouchableOpacity onPress={() => onNavigateModify(item.obstacleId)}>
              <Text >{item.nom}</Text>
              <View style={{overflow:'hidden', maxHeight: "80%"}}>
                <Image source={{ uri: item.photoUri }}
                style={{ width: "100%", height: "100%"}}/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSupprimer(item.obstacleId)} style={styles.boutonSupprimer}>
              <Text style={styles.textBoutonSupprimer}>Supprimer</Text>
            </TouchableOpacity>
            
        </View>}
        keyExtractor={item => item.obstacleId}
      />

    </View>
  );
}