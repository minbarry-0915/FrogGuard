import { NavigationContainer, NavigationProp, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './Screen/MainScreen';
import InfoScreen from './Screen/InfoScreen';
import AddScreen from './Screen/AddScreen';
import EditScreen from './Screen/EditScreen';
import SetHumidityScreen from './Screen/SetHumidityScreen';
import SetTempScreen from './Screen/SetTempScreen';
import SetLightTimeScreen from './Screen/SetLightTimeScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
         <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false,animation:'fade'}}/>
         <Stack.Screen name="Info" component={InfoScreen} options={{ headerShown: false,animation:'fade_from_bottom'}} />
         <Stack.Screen name='Add' component={AddScreen} options={{ headerShown: false,animation:'default'}}/>
         <Stack.Screen name='Edit' component={EditScreen} options={{ headerShown: false,animation:'fade_from_bottom'}}/>
         <Stack.Screen name='SetHumidity' component={SetHumidityScreen} options={{ headerShown: false,animation:'ios'}}/>     
         <Stack.Screen name='SetTemperature' component={SetTempScreen} options={{ headerShown: false,animation:'ios'}}/> 
         <Stack.Screen name='SetLightTime' component={SetLightTimeScreen} options={{ headerShown: false,animation:'ios'}}/>    
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}
export default App;