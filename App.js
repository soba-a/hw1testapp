import * as React from 'react';
import {useState} from 'react';
import { Image, KeyboardAvoidingView, Button} from 'react-native';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { withAuthenticator } from '@aws-amplify/ui-react-native';
import { Amplify, Auth, API} from 'aws-amplify';
import awsExports from './aws-exports';
Amplify.configure(awsExports);
Auth.configure(awsExports);

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

const GetAmplifyApi = () => {
  const [apiResp, setApiResp] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://q8w9a8k360.execute-api.us-east-1.amazonaws.com/staging/customers/1', {
      method: 'GET'
    })
      .then( async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${errorText}`);
        }
        setApiResp(await response.json());

        console.log(apiResp.message);
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
      ) : apiResp ? (
        <Text>{apiResp.message}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </KeyboardAvoidingView>
  );
};

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


async function signOut() {
  try {
    await Auth.signOut({ global: true });
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const MyTabs = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeTab}
          options={{ title: 'Welcome' }}
        />
        <Tab.Screen name="Profile" component={ProfileTab} />
        <Tab.Screen name="Chats" component={ChatsTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
const HomeTab = ({ navigation }) => {
  return (
    <KeyboardAvoidingView style = 'container' behavior='padding'>
      <GetAmplifyApi/>
      <Text>Welcome! Let's translate what your cat is saying by going to the Chats tab!</Text> 
      <Button title="Sign Out" onPress={signOut} />
    </KeyboardAvoidingView>
  );
}

const ProfileTab = ({ navigation, route}) => {
  return (
    <KeyboardAvoidingView style = 'container' behavior='padding'>
        <Text>Welcome to the profile screen!</Text>
    </KeyboardAvoidingView>
  );
}

const ChatsTab = ({ navigation, route}) => {
  return (
    <MyStack/>
  );
}

const MyStack = ({ navigation, route}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatsListScreen" options = {{headerShown: false}} component={ChatsListScreen} />
      <Stack.Screen name="ChatScreen" options = {{headerShown: false}} component={ChatScreen} />
      <Stack.Screen name="ChatScreen2" options = {{headerShown: false}} component={ChatScreen2} />
    </Stack.Navigator>
  )
}

const ChatsListScreen = ({navigation, route}) => {
  return (
    <View>
      <Button title="Translate Mochi" onPress={() => navigation.navigate('ChatScreen')} />
      <Button title="Translate Maru" onPress={() => navigation.navigate('ChatScreen2')} />
    </View>
  );
}

const ChatScreen = ({navigation, route}) => {
  return (
      <CatTranslator flair = '^^' name = {'mochi'}/> 
  );
}
const ChatScreen2 = ({navigation, route}) => {
  return (
      <CatTranslator flair = ':3' name = {'maru'}/> 
  );
}

const App = () => {
  return (
    <MyTabs/>
  );
}

export default withAuthenticator(App);