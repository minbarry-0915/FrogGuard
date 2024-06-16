import React, {useEffect, useState} from "react";
import { NavigationProp, ParamListBase,RouteProp,useFocusEffect } from "@react-navigation/native";
import { Button, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "../Styles/StyleSheet";
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from "axios";

interface MyParams{
    cno: number;
}
interface Time{
    hour: number;
    minute: number;
}
interface Animal{
    cno: number, //cage number
    name: string,
    species: string,
    idealMinHumidity: number,   
    idealMaxHumidity: number,
    idealMinTemperature: number,
    idealMaxTemperature: number,
    nightMinTemperature: number,
    nightMaxTemperature: number,
    lightStartTime: string,
    lightEndTime: string,
}

function InfoScreen({route,navigation}: {route: RouteProp<ParamListBase>,navigation: NavigationProp<ParamListBase>}){
    const {cno} = route.params as MyParams;
    const [animal, setAnimal] = useState<Animal>();

    useEffect(()=>{
        getResponse();
        console.log(animal);
    },[])
    // useFocusEffect(React.useCallback(()=>{
    //     getResponse();
    //     console.log(animal);
    // },[]))

    const getResponse = async() =>{
        //서버요청 작성 필요
        try{
            const res = await axios.get(`http://192.168.0.7:5000/get_data/${cno}`);
            console.log('Success to get data: ', res.data);
            setAnimal(res.data);
        }catch(error){
            if(error.response){
                console.error('server responded with error: ', error.response.data);
            }
            else if (error.request){
                console.error('No response received: ', error.request);
            }
            else{
                console.error('Error setting up request: ', error.message);
            }
        }
        
    };
    

    const onExitButton = () =>{
        navigation.navigate('Main')
    }

    const onEditButton = (cno: number|undefined) =>{
        //console.log(id);
        navigation.navigate('Edit', {cno})
    }
    const onDeleteButton = (cno: number|undefined) => {
        //서버에 delete 요청하고 home으로 나감
        navigation.navigate('Main')
    }

    return (
        <SafeAreaView style={{flex: 1,
            backgroundColor:'#1F1F1F'}}>
                <View style={styles.HeaderContainer}>
                    <TouchableOpacity onPress={onExitButton}activeOpacity={0.7}>
                        <AntDesign name='close' size={32} color={'white'}/>
                    </TouchableOpacity>
                    <Text style={styles.HeaderText}>Cage-{animal?.cno}</Text>
                </View>
                <View style={styles.BodyContainer}>
                    <ScrollView contentContainerStyle = {[styles.ScrollContainer, {paddingHorizontal: 16}]}>
                        <View style={styles.InfoImageContainer}>
                            <Image style={styles.AnimalImage}/>
                        </View>
                        <View style={styles.AnimalSpecContainer}>
                            <Text style={styles.mainText}>Name</Text>
                            <Text style={styles.SubText}>{animal?.name}</Text>
                        </View>
                        <View style={styles.AnimalSpecContainer}>
                            <Text style={styles.mainText}>Species</Text>
                            <Text style={styles.SubText}>{animal?.species}</Text>
                        </View>
                        <View style={{ width: '100%', height: 46.5, justifyContent:'center'}}>
                            <Text style={[styles.mainText, {fontFamily: 'Lexend-Bold', fontSize: 18}]}>
                                Ideal Habitat Settings
                            </Text>
                        </View>
                        <View style={styles.AnimalSpecContainer}>
                            <Text style={styles.mainText}>Temperature</Text>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row', marginRight: 12}}>
                                    <Image source={require('../assets/icons/ph_sun-horizon-light.png')} style={{marginRight:6}}/>
                                    <Text style={styles.SubText}>{animal?.idealMinTemperature}° - {animal?.idealMaxTemperature}°C</Text>
                                </View>
                                
                                <View style={{flexDirection: 'row', marginRight: 12}}>
                                    <Image source={require('../assets/icons/carbon_partly-cloudy-night.png')} style={{marginRight:6}}/>
                                    <Text style={styles.SubText}>{animal?.nightMinTemperature}° - {animal?.nightMaxTemperature}°C</Text>
                                </View>
                            </View>
                            
                        </View>
                        <View style={styles.AnimalSpecContainer}>
                            <Text style={styles.mainText}>Humidity</Text>
                            <Text style={styles.SubText}>{animal?.idealMinHumidity}% - {animal?.idealMaxHumidity}%</Text>
                        </View>
                        <View style={styles.AnimalSpecContainer}>
                            <Text style={styles.mainText}>LightTime</Text>
                            <Text style={styles.SubText}>{animal?.lightStartTime} - {animal?.lightEndTime}</Text>
                        </View>
                        <TouchableOpacity style={[styles.StartButton, {backgroundColor: '#AFAFAF'}]} onPress={()=> onEditButton(animal?.cno)} activeOpacity={0.7}>
                                <Text style={[styles.mainText, {fontSize: 16, color: '#1F1F1F', fontFamily:'Lexend-Bold'}]}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.StartButton, {backgroundColor: '#CF6D6D', marginBottom: 24}]} onPress={()=> onDeleteButton(animal?.cno)} activeOpacity={0.7}>
                                <Text style={[styles.mainText, {fontSize: 16, color: '#1F1F1F', fontFamily:'Lexend-Bold'}]}>Delete</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            
        </SafeAreaView>
    );
}
export default InfoScreen;