import React, {useEffect, useState} from "react";
import { NavigationProp, ParamListBase,RouteProp } from "@react-navigation/native";
import { Button, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, TextInput } from "react-native";
import styles from "../Styles/StyleSheet";
import AntDesign from 'react-native-vector-icons/AntDesign';

interface MyParams{
    cno: number,
    MinHumid: number,
    MaxHumid: number,
}

function SetHumidityScreen({route, navigation}: {route: RouteProp<ParamListBase>,navigation: NavigationProp<ParamListBase>}){
    const {cno, MinHumid, MaxHumid} = route.params as MyParams;
    
    const [minHumid, setMinHumid] = useState<string>('');
    const [maxHumid, setMaxHumid] = useState<string>('');
    const [previousRoute, setPreviousRoute] = useState<string>('');

    const onExitButton = () =>{
       navigation.goBack();
    }
    const onSaveChangeButton = () =>{
        if(previousRoute == 'Add'){
            navigation.navigate('Add', {cno: cno, MinHumid: minHumid, MaxHumid: maxHumid});
        }
        if(previousRoute == 'Edit'){
            navigation.navigate('Edit', {cno: cno, MinHumid: minHumid, MaxHumid: maxHumid});
        }
    }   

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

    useEffect(()=>{
        console.log('routeId:',cno);
        console.log('routeMinHumid:',MinHumid);
        console.log('routeMaxHumid:',MaxHumid);
        setMinHumid(MinHumid.toString());
        setMaxHumid(MaxHumid.toString());
    },[]);

    useEffect(()=>{
        console.log('current MinHumid:',minHumid);
        console.log('current MaxHumid:',maxHumid);
    },[minHumid,maxHumid]);

    return (
        <SafeAreaView style={{flex: 1,
            backgroundColor:'#1F1F1F'}}>
            <View style={styles.HeaderContainer}>
                    <TouchableOpacity onPress={onExitButton}activeOpacity={0.7}>
                        <AntDesign name='close' size={32} color={'white'}/>
                    </TouchableOpacity>
                    <Text style={styles.HeaderText}>Humidity</Text>
                    <TouchableOpacity 
                    activeOpacity={0.7}>
                        <AntDesign name='setting' size={32} color={'white'}/>
                    </TouchableOpacity>
            </View>
            <View style={styles.BodyContainer}>
                <ScrollView contentContainerStyle={[styles.ScrollContainer, { paddingHorizontal: 16 }]}>
                    <View style={styles.SetContent}>
                        <Text style={[styles.HeaderText,{fontSize: 22}]}>
                            Set Range of Humidity
                        </Text>
                    </View>
                    <View style={styles.SetContent}>
                        <Text style={[styles.mainText, {alignSelf:'flex-start', marginBottom: 8}]}>Min</Text>
                        <TextInput
                        placeholderTextColor={'#94C7AB'}
                        keyboardType="numeric"
                        style={styles.TextInput}
                        value={minHumid}
                        onChangeText={setMinHumid}
                        />
                    </View>
                    <View style={styles.SetContent}>
                        <Text style={[styles.mainText, {alignSelf:'flex-start', marginBottom: 8}]}>Max</Text>
                        <TextInput 
                        placeholderTextColor={'#94C7AB'}
                        keyboardType="numeric"
                        style={styles.TextInput}
                        value={maxHumid}
                        onChangeText={setMaxHumid}
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
export default SetHumidityScreen;