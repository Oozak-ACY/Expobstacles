import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity,TextInput, Button, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import { RouteProp, useRoute } from '@react-navigation/native';

type RootStackParamList = {
  modify_obstacle: { id: string };
};

// Utilisation de RouteProp pour typer le paramètre route
type ModifyObstacleRouteProp = RouteProp<RootStackParamList, 'modify_obstacle'>;

export default function ModifyScreen() {

  const [nom, setNom] = useState("")
  const [contacts, setContacts] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [photoUri, setPhotoUri] = useState<any>(null);

  const route = useRoute<ModifyObstacleRouteProp>();
  const { id } = route.params;
  
  const navigation: any = useNavigation()


  useEffect(() => {
    const fetchObstacle = async () => {
      try {
        const storedObstacles = await AsyncStorage.getItem('obstacles');
        const obstacles = storedObstacles ? JSON.parse(storedObstacles) : [];

        const obstacleData = obstacles.find((obstacle: any) => obstacle.obstacleId === id);

        if (obstacleData) {
          setNom(obstacleData.nom)
          setContacts(obstacleData.contacts)
          setLatitude(obstacleData.latitude)
          setLongitude(obstacleData.longitude)
          setPhotoUri(obstacleData.photoUri)
        } else {
          Alert.alert("Erreur", "Obstacle introuvable");
        }
      } catch (error) {
        console.log("Erreur lors du chargement des obstacles :", error);
      }
    };
    fetchObstacle();
  }, [id]);

  const selectPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const onDeletePhoto = () => {
    setPhotoUri(null);
  }

  const onSaveObject = async (id: string) => {
    try {
      const storedObstacles = await AsyncStorage.getItem('obstacles');
      let updatedObstacles = storedObstacles ? JSON.parse(storedObstacles) : [];

      const obstacleIndex = updatedObstacles.findIndex((obstacle: any) => obstacle.obstacleId === id);
  
      if (obstacleIndex !== -1) {
        updatedObstacles[obstacleIndex] = {
          ...updatedObstacles[obstacleIndex],
          nom,
          photoUri,
          contacts,
          latitude,
          longitude
        };
        await AsyncStorage.setItem('obstacles', JSON.stringify(updatedObstacles));
  
        Alert.alert('Succès', 'Les modifications ont été sauvegardées avec succès');
        navigation.navigate('index');
      } else {
        Alert.alert('Erreur', "L'obstacle n'a pas été trouvé");
      }
    } catch (error) {
      console.log('Erreur lors de la sauvegarde des modifications :', error);
      Alert.alert('Erreur', "Une erreur s'est produite lors de la sauvegarde");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Modifier l'obstacle</Text>
      <Text style={styles.label}>Nom : </Text>
      <TextInput 
        style={styles.input}
        placeholder="Nom de l'obstacle"
        value={nom}
        onChangeText={setNom}
      />
      <Text style={styles.label}>Contacts : </Text>
      <TextInput 
        style={styles.input}
        placeholder="A contacter"
        value={contacts}
        onChangeText={setContacts}
      />
      <View style={{display: "flex", flexDirection:"row", justifyContent: "space-between", marginBottom: 5}}>
        <View style={{display: "flex"}}>
          <Text style={styles.label}>Latitude : </Text>
          <TextInput 
            style={styles.input}
            placeholder="latitude de l'objet"
            value={latitude}
            onChangeText={setLatitude}
          />
        </View>
        <View>
          <Text style={styles.label}>Longitude : </Text>
          <TextInput 
            style={styles.input}
            placeholder="longitude de l'objet"
            value={longitude}
            onChangeText={setLongitude}
          />
        </View>

        
        
      </View>
      {photoUri ? (
            <View style={{ width: "100%", minHeight: "25%", marginBottom: 20 }}>
              <Image
                source={{ uri: photoUri }}
                style={{ width: "100%", minHeight: "25%"}}
              />
              <TouchableOpacity 
                style={{width: "100%", height: 35, borderRadius: 15, backgroundColor: "grey", marginTop: 13, display: "flex", justifyContent: "center", alignItems: 'center'}}
                onPress={() => onDeletePhoto()}
                >
                  <Text>Retirer la photo</Text>
              </TouchableOpacity>
            </View>
            
          ) : (
            <Button title="Choisir une photo" onPress={selectPhoto} />
          )}

          
      <TouchableOpacity style={styles.mainButton} onPress={() => onSaveObject(id)}>
          <Text>Sauvegarder</Text>
      </TouchableOpacity>
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: "white",
    height:"100%"
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  mainButton: { 
    height: 50, 
    width: "100%", 
    backgroundColor: 'cyan',  
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 50,
    marginTop: 10,
    fontWeight: "bold"
  },
   mainTitle: {
    marginBottom: 20,
    fontSize: 25,
    fontWeight: "bold"
   }
});
