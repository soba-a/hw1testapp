import * as React from 'react';
import {useState} from 'react';
import { Button, SafeAreaView, Image} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

const Stack = createNativeStackNavigator();

const CatTranslator = () => {
  const [text, setText] = useState('');
  return (
    <View style = {styles.centered}>
      <TextInput
        style={styles.textInput}
          placeholder='Type here to translate!'
          onChangeText={text => setText(text)}
          defaultValue={text}
      />
      <Text style={{padding: 10, fontSize: 42}}>
        {text.split(' ').map((word) => word && 'meow').join(' ')}
      </Text>
    </View>
  );
}

const Cat = props => {
  return (
    <Text>Hello, I am your cat, {props.name}!</Text>
  );
}

const HomeScreen = ({ navigation }) => {
  return (
    <Button
      title="Go to maru's profile"
      onPress={() =>
        navigation.navigate('Profile', { name: 'maru' })
      }
    />
  );
}

const ProfileScreen = ({ navigation, route}) => {
  return (
    <View style ={styles.centered}>
      <GetPhotoFromApi/>
      <Cat name = 'maru'/>
      <CatTranslator/>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  textInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 320,
    height: 160,
  },
});

const GetPhotoFromApi = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://pixabay.com/api/?key=39255006-4174be3598e41d3a1ce4fe9d9&q=cute+cat&per_page=50', {
      method: 'GET'
    })
      .then( async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
        return response.json();
      })
      .then((data) => {
        const randomIndex = Math.floor(Math.random() * 50);
        console.log(randomIndex);
        setImageUrl(data["hits"][randomIndex].largeImageURL);
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {error ? (
        <Text>Error: {error}</Text>
      ) : imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;