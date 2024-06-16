import React, { useEffect, useState } from "react";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Button, Image, ScrollView, StyleSheet, Text, View , TouchableOpacity} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../Styles/StyleSheet";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import axios from "axios";

interface Animal {
    id: number,
    cno: number, //cage number
    name: string,
    species: string,
    humidity: number,
    temperature: number,
    isRunning: number,
}

function MainScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
    const [animals, setAnimals] = useState<Animal[]>([]);

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.
        getResponse();

        // 5초마다 getResponse 함수를 호출하는 타이머 설정
        const interval = setInterval(() => {
            getResponse();
            //console.log('updated');
        }, 10000); // 5초
        
        // 컴포넌트가 언마운트될 때 타이머를 정리합니다.
        return () => clearInterval(interval);
    }, []);

    //response example
    const getResponse = async() => {
        try{
            const res = await axios.get('http://192.168.0.7:5000/get_log');
            console.log('Success getting Info:', res.data);
            setAnimals([...res.data]);
        }catch(error){
            console.error('Fail to get Info: ', error);
        }
    }


    const onInfoButton = (cno: number) => {
        navigation.navigate('Info', {cno});
    }
    const onAddNewButton = () => {
        navigation.navigate('Add')
    }
    const onStartButton = async(cno: number) => {
        try{
            const res = await axios.post(`http://192.168.0.7:5000/start_logging/${cno}`);
            console.log('tracking service start:', res);
            const updateAnimals = animals.map(animal => {
                if(animal.cno == cno){
                    const newRunningStatus = 1;
                    return {...animal,isRunning:newRunningStatus};
                }
                else{
                    return animal;
                }
            })
            //서버에 중단요청 보내야됨
            setAnimals(updateAnimals);
        }catch(error){
            console.error('Fail to service start:',error);
        }
    }

    const onStopButton = async(cno: number) =>{
        try{
            const res = await axios.post(`http://192.168.0.7:5000/stop_logging/${cno}`);
            console.log('tracking service stop:', res);
            const updateAnimals = animals.map(animal => {
                if(animal.cno == cno){
                    const newRunningStatus = 0;
                    return {...animal,isRunning:newRunningStatus};
                }
                else{
                    return animal;
                }
            })
            //서버에 실행요청 보내야됨
            setAnimals(updateAnimals);
        }catch(error){
            console.error('Fail to service stop', error);
        }
    }

    return (
        <SafeAreaView style={{flex: 1,
        backgroundColor:'#1F1F1F'}}>
            <View style={styles.HeaderContainer}>
                <Text style={styles.HeaderText}>FrogGuard</Text>
                <TouchableOpacity onPress={onAddNewButton} activeOpacity={0.7}>
                    <Image source={require('../assets/icons/Plus.png')} style={{width:32,height:32}}/>
                </TouchableOpacity>
            </View>
            <View style={styles.BodyContainer}>
                <ScrollView contentContainerStyle = {styles.ScrollContainer}>
                {animals && animals.map((animal, index) => (
                    <View key={index} style={styles.CardContainer}>
                        <View style={styles.CardTopContainer}>
                            <View>
                                <Text style={[styles.mainText]}>Cage-{animal.cno}</Text>
                                <Text style={[styles.mainText, {color: '#94C7AB'}]}>{animal.name}</Text>
                            </View>
                            <TouchableOpacity onPress={()=>onInfoButton(animal.cno)} activeOpacity={0.7}>
                                <Image source={require('../assets/icons/Setting.png')} style = {styles.SettingIcon}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{width: '100%',marginVertical: 12}}>
                            <View style={styles.HummidityContainer}>
                                <SimpleLineIcons
    name={"drop"} size={24} style= {styles.HummidityIcon}/>
                               <Text style={[styles.mainText, {color: '#94C7AB'}]}>{animal.humidity}%</Text>
                            </View>
                            <View style={styles.HummidityContainer}>
                                <Image source={require('../assets/icons/Temperature.png')} style={styles.TemperatureIcon} />
                                <Text style={[styles.mainText, {color: '#94C7AB'}]}>{animal.temperature}°C</Text>
                            </View>
                        </View>
                        
                        {animal.isRunning == 0 && (
                            <TouchableOpacity style={styles.StartButton} onPress={()=> onStartButton(animal.cno) } activeOpacity={0.7}>
                                <Text style={[styles.mainText, {fontSize: 16, color: '#1F1F1F', fontFamily:'Lexend-Bold'}]}>Start</Text>
                            </TouchableOpacity>
                        )}
                        {animal.isRunning == 1 &&(
                            <TouchableOpacity style={[styles.StartButton, {backgroundColor:'#CF6D6D'}]} onPress={()=>onStopButton(animal.cno)} activeOpacity={0.7}>
                                <Text style={[styles.mainText, {fontSize: 16, color: '#1F1F1F', fontFamily:'Lexend-Bold'}]}>Stop</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
                </ScrollView>
            </View>
            
        </SafeAreaView>
    );
}
export default MainScreen;
