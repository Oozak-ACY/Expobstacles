import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity,TextInput, Button, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';



export default function TabTwoScreen() {

  const [nom, setNom] = useState("")
  const [contacts, setContacts] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [photoUri, setPhotoUri] = useState<any>(null);

  const navigation: any = useNavigation()


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

  const onSaveObject = async () => {

    const storedObstacles = await AsyncStorage.getItem('obstacles');
    let updatedObstacles = storedObstacles ? JSON.parse(storedObstacles) : [];

    const obstacleId = updatedObstacles.length + 1
    const obstacleData = {
      obstacleId,
      nom,
      photoUri,
      contacts,
      latitude,
      longitude
    };
    updatedObstacles.push(obstacleData);

    await AsyncStorage.setItem('obstacles', JSON.stringify(updatedObstacles));
    Alert.alert('Succès', 'L\'obstacle a été enregistré avec succès');

    navigation.navigate('index')
  }
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Ajouter un obstacle</Text>
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

          
      <TouchableOpacity style={styles.mainButton} onPress={onSaveObject}>
          <Text>Ajouter un obstacle</Text>
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
