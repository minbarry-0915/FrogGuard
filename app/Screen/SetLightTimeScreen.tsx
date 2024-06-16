import React, {useEffect, useState} from "react";
import { NavigationProp, ParamListBase,RouteProp } from "@react-navigation/native";
import { Button, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../Styles/StyleSheet";
import AntDesign from 'react-native-vector-icons/AntDesign';

interface MyParams{
    cno: number,
    LightStartTime: string,
    LightEndTime: string,
}

function SetLightTimeScreen({route,navigation}: {route: RouteProp<ParamListBase>,navigation: NavigationProp<ParamListBase>}){
    const {cno, LightStartTime, LightEndTime} = route.params as MyParams;
    const [lightStartTime, setLightStartTime] = useState<string>('');
    const [lightEndTime, setLightEndTime] = useState<string>('');
    const [previousRoute, setPreviousRoute] = useState<string>('');


    const onExitButton = () =>{
        navigation.goBack();
    }

    const onSaveChangeButton = () =>{
        if(previousRoute == 'Add'){
            navigation.navigate('Add', {cno: cno, LightStartTime: lightStartTime, LightEndTime: lightEndTime});
        }
        if(previousRoute == 'Edit'){
            navigation.navigate('Edit', {cno: cno, LightStartTime: lightStartTime, LightEndTime: lightEndTime});
        }
    }

    useEffect(()=>{ 
        console.log(route.params);
        setLightStartTime(LightStartTime);
        setLightEndTime(LightEndTime);
    },[])

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
                <Text style={styles.HeaderText}>LightTime</Text>
                <TouchableOpacity 
                activeOpacity={0.7}>
                    <AntDesign name='setting' size={32} color={'white'}/>
                </TouchableOpacity>
            </View>
            <View style={styles.BodyContainer}>
                <ScrollView contentContainerStyle={[styles.ScrollContainer, { paddingHorizontal: 16 }]}>
                    <View style={styles.SetContent}>
                        <Text style={[styles.HeaderText,{fontSize: 22}]}>
                            Set Range of LightTime
                        </Text>
                    </View>
                    <View style={styles.SetContent}>
                        <Text style={[styles.mainText, {alignSelf:'flex-start', marginBottom: 8}]}>LightStartTime</Text>
                        <TextInput 
                        placeholderTextColor={'#94C7AB'}
                        keyboardType='numbers-and-punctuation'
                        style={styles.TextInput}
                        value={lightStartTime}
                        onChangeText={setLightStartTime}
                        />
                    </View>
                    <View style={styles.SetContent}>
                        <Text style={[styles.mainText, {alignSelf:'flex-start', marginBottom: 8}]}>LightEndTime</Text>
                        <TextInput 
                        placeholderTextColor={'#94C7AB'}
                        keyboardType='numbers-and-punctuation'
                        style={styles.TextInput}
                        value={lightEndTime}
                        onChangeText={setLightEndTime}
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
export default SetLightTimeScreen;