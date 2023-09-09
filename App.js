import * as React from 'react';
import {useState} from 'react';
import { Button, SafeAreaView, Image, KeyboardAvoidingView, Vibration} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { VStack } from 'react-native-flex-layout'
import { withAuthenticator } from '@aws-amplify/ui-react-native';

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    padding: 10
  },
  textInput: {
    flexDirection: 'row',
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 2,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',},
  image: {
    width: 400,
    height: 160,
    margin: 10
  },
});

const Tab = createBottomTabNavigator();

const CatTranslator = props => {
  const [text, setText] = useState('');
  return (
    <KeyboardAvoidingView style = {styles.centered} behavior='padding'>
      <GetPhotoFromApi/>
      <Text>Hello, I am your cat, {props.name}!</Text>
      <TextInput
        style={styles.textInput}
        placeholder='Type here to translate!'
        onChangeText={text => setText(text)}
        defaultValue={text}
      />
      <Text style={{padding: 10, fontSize: 30}}>
        {text.split(' ').map((word) => word && 'meow'.concat(' ' + props.flair)).join(' ')}
      </Text>
    </KeyboardAvoidingView>
  );
}

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
    <KeyboardAvoidingView>
      {error ? (
        <Text>Error: {error}</Text>
      ) : imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text>Loading...</Text>
      )}
    </KeyboardAvoidingView>
  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <Text>Welcome!</Text> 
  );
}

const ProfileScreen = ({ navigation, route}) => {
  return (
    <KeyboardAvoidingView style = 'container' behavior='padding'>
        <CatTranslator flair = ':3' name = {'maru'}/>
    </KeyboardAvoidingView>
  );
}

const ChatsScreen = ({ navigation, route}) => {
  return (
    <KeyboardAvoidingView style = 'container' behavior='padding'>
        <CatTranslator flair = '😺' name = {'mochi'}/>
    </KeyboardAvoidingView>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Welcome' }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Chats" component={ChatsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default withAuthenticator(App);