import React, {useEffect, useState} from "react";
import { NavigationProp, ParamListBase,RouteProp } from "@react-navigation/native";
import { Button, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View , TextInput} from "react-native";
import styles from "../Styles/StyleSheet";
import AntDesign from 'react-native-vector-icons/AntDesign';

interface MyParams{
    cno: number,
    DayMinTemp: number,
    DayMaxTemp: number,
    NightMinTemp: number,
    NightMaxTemp: number,
}

function SetTempScreen({route,navigation}: {route: RouteProp<ParamListBase>,navigation: NavigationProp<ParamListBase>}){
    const {cno, DayMinTemp, DayMaxTemp, NightMinTemp, NightMaxTemp} = route.params as MyParams;

    // console.log("id:", id);
    // console.log("DayMinTemp:", DayMinTemp);
    // console.log("DayMaxTemp:", DayMaxTemp);
    // console.log("NightMinTemp:", NightMinTemp);
    // console.log("NightMaxTemp:", NightMaxTemp);

    const [dayMinTemp, setDayMinTemp] = useState<string>('');
    const [dayMaxTemp, setDayMaxTemp] = useState<string>('');
    const [nightMinTemp, setNightMinTemp] = useState<string>('');
    const [nightMaxTemp, setNightMaxTemp] = useState<string>('');
    const [previousRoute, setPreviousRoute] = useState<string>('');

    const onExitButton = () =>{
        navigation.goBack();
    }
    const onSaveChangeButton = () =>{
        
        if(previousRoute == 'Add'){
            navigation.navigate('Add', {cno: cno, DayMinTemp: dayMinTemp, DayMaxTemp: dayMaxTemp, NightMinTemp: nightMinTemp, NightMaxTemp: nightMaxTemp});
        }
        if(previousRoute == 'Edit'){
            navigation.navigate('Edit', {cno: cno, DayMinTemp: dayMinTemp, DayMaxTemp: dayMaxTemp, NightMinTemp: nightMinTemp, NightMaxTemp: nightMaxTemp});
        }
    }

    useEffect(() => {
        setDayMinTemp(DayMinTemp.toString());
        setDayMaxTemp(DayMaxTemp.toString());
        setNightMinTemp(NightMinTemp.toString());
        setNightMaxTemp(NightMaxTemp.toString());
    },[]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            const state = e.data.state;
            if (state) {
                const routes = state.routes;
                const previousRouteName = routes[routes.length - 2]?.name;
                setPreviousRoute(previousRouteName);
            }
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <SafeAreaView style={{flex: 1,
            backgroundColor:'#1F1F1F'}}>
            <View style={styles.HeaderContainer}>
                    <TouchableOpacity onPress={onExitButton}activeOpacity={0.7}>
                        <AntDesign name='close' size={32} color={'white'}/>
                    </TouchableOpacity>
                    <Text style={styles.HeaderText}>Temperature</Text>
                    <TouchableOpacity 
                    activeOpacity={0.7}>
                        <AntDesign name='setting' size={32} color={'white'}/>
                    </TouchableOpacity>
            </View>
            <View style={styles.BodyContainer}>
                <ScrollView contentContainerStyle={[styles.ScrollContainer, { paddingHorizontal: 16 }]}>
                <View style={styles.SetContent}>
                    <Text style={[styles.HeaderText,{fontSize: 22}]}>
                        Set Range of Temperature
                    </Text>
                </View>
                <View style={styles.SetContent}>
                    <View style={{flexDirection:'row',justifyContent:'flex-start', alignSelf:'flex-start'}}>
                        <Image source={require('../assets/icons/ph_sun-horizon-light.png')} style={styles.SetIcon}/>
                        <Text style={[styles.mainText,{fontSize:24}]}>Day</Text>    
                    </View>
                </View>
                <View style={styles.SetContent}>
                    <Text style={[styles.mainText, {alignSelf:'flex-start', marginBottom: 8}]}>Min</Text>
                    <TextInput 
                    placeholderTextColor={'#94C7AB'}
                    keyboardType="numeric"
                    style={styles.TextInput}
                    value={dayMinTemp}
                    onChangeText={setDayMinTemp}
                    />
                </View>
                <View style={styles.SetContent}>
                    <Text style={[styles.mainText, {alignSelf:'flex-start', marginBottom: 8}]}>Max</Text>
                    <TextInput 
                    placeholderTextColor={'#94C7AB'}
                    keyboardType="numeric"
                    style={styles.TextInput}
                    value={dayMaxTemp}
                    onChangeText={setDayMaxTemp}
                    />
                </View>
                
                {/* night */}
                <View style={styles.SetContent}>
                    <View style={{flexDirection:'row',justifyContent:'flex-start', alignSelf:'flex-start'}}>
                        <Image source={require('../assets/icons/carbon_partly-cloudy-night.png')} style={styles.SetIcon}/>
                        <Text style={[styles.mainText,{fontSize:24}]}>Night</Text>    
                    </View>
                </View>
                <View style={styles.SetContent}>
                    <Text style={[styles.mainText, {alignSelf:'flex-start', marginBottom: 8}]}>Min</Text>
                    <TextInput 
                    placeholderTextColor={'#94C7AB'}
                    keyboardType="numeric"
                    style={styles.TextInput}
                    value={nightMinTemp}
                    onChangeText={setNightMinTemp}
                    />
                </View>
                <View style={styles.SetContent}>
                    <Text style={[styles.mainText, {alignSelf:'flex-start', marginBottom: 8}]}>Max</Text>
                    <TextInput 
                    placeholderTextColor={'#94C7AB'}
                    keyboardType="numeric"
                    style={[styles.TextInput, {marginBottom: 40}]}
                    value={nightMaxTemp}
                    onChangeText={setNightMaxTemp}
                    />
                </View>
                <View style={styles.SetContent}>
                    <TouchableOpacity 
                    onPress={onSaveChangeButton}
                    style={[styles.StartButton,{marginBottom: 24}]}>
                        <Text style={[styles.mainText, {fontSize: 16, color: '#1F1F1F', fontFamily:'Lexend-Bold'}]}>
                            Save Changes
                        </Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
export default SetTempScreen;