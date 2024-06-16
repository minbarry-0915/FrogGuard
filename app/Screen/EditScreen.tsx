import React, { useEffect, useState } from "react";
import { NavigationProp, ParamListBase, RouteProp ,useFocusEffect} from "@react-navigation/native";
import { Button, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, Modal } from "react-native";
import styles from "../Styles/StyleSheet";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import {CHATGPT_API_KEY} from '@env';

interface MyParams {
    id?: number | undefined,
    cno?: number | undefined,
    MinHumid?: number | undefined,
    MaxHumid?: number | undefined,
    DayMinTemp?: number | undefined,
    DayMaxTemp?: number | undefined,
    NightMinTemp?: number | undefined,
    NightMaxTemp?: number | undefined,
    LightStartTime?: string | undefined,
    LightEndTime?: string | undefined,
}

interface Animal {
    cno: number, // 케이지 번호
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

function EditScreen({ route, navigation }: { route: RouteProp<ParamListBase>, navigation: NavigationProp<ParamListBase> }) {
    const { cno } = route.params as MyParams;

    const [animal, setAnimal] = useState<Animal>({
        cno: 0,
        name: '',
        species: '',
        idealMinHumidity: 0,
        idealMaxHumidity: 0,
        idealMinTemperature: 0,
        idealMaxTemperature: 0,
        nightMinTemperature: 0,
        nightMaxTemperature: 0,
        lightStartTime: '09:00',
        lightEndTime: '16:00'
    });
    const [name, setName] = useState<string>('');
    const [species, setSpecies] = useState<string>('');
    const [chatgptModalVisible, setChatgptModalVisible] = useState<boolean>(false);
    const [savingModalVisible, setSavingModalVisible] = useState<boolean>(false);
    const [gptResponseText, setGptResponseText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        getResponse();
        console.log(cno);
    }, []);
    
    // useEffect(()=>{
    //     getResponse();
    // },[animal]);

    useFocusEffect(
        React.useCallback(() => {
            updateAnimalFromParams();
        }, [route.params])
    );

    const updateAnimalFromParams = () => {
        if (route.params !== undefined) {
            const { cno, MinHumid, MaxHumid, DayMinTemp, DayMaxTemp, NightMinTemp, NightMaxTemp, LightStartTime, LightEndTime } = route.params as MyParams;
            console.log(route.params);
            if(MinHumid !== undefined && MaxHumid !== undefined){
                setAnimal(currentAnimal => ({
                ...currentAnimal,
                idealMinHumidity:MinHumid? MinHumid: 0,
                idealMaxHumidity:MaxHumid? MaxHumid: 0,
                }));  
            }
            if(DayMinTemp !== undefined && DayMaxTemp !== undefined && NightMinTemp !== undefined && NightMaxTemp !== undefined){
                setAnimal(currentAnimal => ({
                    ...currentAnimal,
                    idealMinTemperature: DayMinTemp? DayMinTemp: 0,
                    idealMaxTemperature: DayMaxTemp? DayMaxTemp: 0,
                    nightMinTemperature: NightMinTemp? NightMinTemp: 0,
                    nightMaxTemperature: NightMaxTemp? NightMaxTemp: 0,
                }));
            }
            if(LightStartTime !== undefined && LightEndTime !== undefined){
                setAnimal(currentAnimal => ({
                    ...currentAnimal,
                    lightStartTime: LightStartTime? LightStartTime: '06:00',
                    lightEndTime: LightEndTime? LightEndTime:'18:00'
                }))
            }
        }
    };

    const getResponse = async() => {
        try{
            const res = await axios.get(`http://192.168.0.7:5000/get_data/${cno}`);
            console.log('Success to get data: ', res.data);
            setAnimal(res.data);
        }catch(error){
            console.log('Fail to get data: ', error.response);
        }
    };

    const onSetHumidityButton = () => {
        navigation.navigate(
            'SetHumidity', 
            {
                cno: animal.cno,
                MinHumid: animal.idealMinHumidity,
                MaxHumid: animal.idealMaxHumidity
            });
    }

    const onSetTempButton = () => {
        //console.log(animal.DayMaxTemperature);
        navigation.navigate(
            'SetTemperature', 
            {
                cno: animal.cno,
                DayMinTemp: animal.idealMinTemperature,
                DayMaxTemp: animal.idealMaxTemperature,
                NightMinTemp: animal.nightMinTemperature,
                NightMaxTemp: animal.nightMaxTemperature,
            });
    }

    const onSetLightTimeButton = () => {
        navigation.navigate(
            'SetLightTime', 
            {
                cno: animal.cno, 
                LightStartTime: animal.lightStartTime, 
                LightEndTime: animal.lightEndTime,
            });
    }

    const onExitButton = () => {
        navigation.goBack();
    }

    const onSaveButton = () => {
        toggleSavingModal();
        navigation.goBack();
    }
    const onGetDataButton = () => {
        setIsLoading(true);
        callOpenAI();
    }

    const toggleChatgptModal = () => {
        setChatgptModalVisible(!chatgptModalVisible);
    }

    const toggleSavingModal = () =>{
        setSavingModalVisible(!savingModalVisible);
    }

    const callOpenAI = async () => {
        // API key 쓰는법 
        // 1. .env 파일 설정,
        // 2. npm install react-native-dotenv
        // 3. babel.config.js 파일에서 react-native-dotenv를 플러그인으로 추가, 
        // 4. env.d.ts 파일 루트에 생성 후 각 키의 타입을 env.d.ts 파일에 정의
        const apiKey = CHATGPT_API_KEY;; 
        const data = {
            model: 'gpt-3.5-turbo-instruct', //엔진 또는 모델 지정
            prompt: `Please provide the optimal temperature and humidity environment for ${species} in the form of JSON, including daymintemp, daymaxtemp, nightmintemp, nightmaxtemp, minhumidity, maxhumidity. The units for temperature should be in Celsius and humidity in percentage. Exclude the units and provide only the numbers.`,
            max_tokens: 150
        };
        try {
            const res = await axios.post(
                'https://api.openai.com/v1/completions',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                }
            );
            setGptResponseText(res.data.choices[0].text);
            //파싱
            const parsedRes = JSON.parse(res.data.choices[0].text);
            const newAnimal = {
                ...animal,
                idealMinHumidity: parsedRes.minhumidity,
                idealMaxHumidity: parsedRes.maxhumidity,
                idealMinTemperature: parsedRes.daymintemp,
                idealMaxTemperature: parsedRes.daymaxtemp,
                nightMinTemperature: parsedRes.nightmintemp,
                nightMaxTemperature: parsedRes.nightmaxtemp
            }    
            console.log(parsedRes);
            setAnimal(newAnimal);  
            toggleChatgptModal();
            setIsLoading(false);
        } catch (error) {
            console.error(error.response.data);
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1F1F1F' }}>
            <View style={styles.HeaderContainer}>
                <TouchableOpacity onPress={onExitButton} activeOpacity={0.7}>
                    <AntDesign name='close' size={32} color={'white'} />
                </TouchableOpacity>
                <Text style={styles.HeaderText}>Cage-{animal.cno}</Text>
            </View>
            <View style={styles.BodyContainer}>
                <ScrollView contentContainerStyle={[styles.ScrollContainer, { paddingHorizontal: 16 }]}>
                    <View style={styles.InfoImageContainer}>
                        <Image style={styles.AnimalImage} />
                    </View>
                    <View style={[styles.AnimalSpecContainer, { height: 112 }]}>
                        <Text style={styles.mainText}>Name</Text>
                        <TextInput
                            style={styles.TextInput}
                            placeholder={animal.name}
                            placeholderTextColor={'#94C7AB'}
                            value={name}
                            onChangeText={setName} />
                    </View>
                    <View style={[styles.AnimalSpecContainer, { height: 112 }]}>
                        <Text style={styles.mainText}>Species</Text>
                        <TextInput
                            style={styles.TextInput}
                            placeholder={animal.species}
                            placeholderTextColor={'#94C7AB'}
                            value={species}
                            onChangeText={setSpecies} />
                    </View>
                    <View style={{ width: '100%', height: 46.5, justifyContent: 'center' }}>
                        <Text style={[styles.mainText, { fontFamily: 'Lexend-Bold', fontSize: 18 }]}>
                            Ideal Habitat Settings
                        </Text>
                    </View>
                    {/* chatgpt */}
                    <View style={{ width: '100%', paddingVertical: 12 }}>
                        <TouchableOpacity
                            style={styles.ChatgptButton}
                            onPress={toggleChatgptModal}
                        >
                            <View style={{ marginRight: 16, }}>
                                <Image
                                    source={require('../assets/icons/chatgpt_logo.png')}
                                    style={styles.ChatgptLogo} />
                            </View>
                            <Text style={{ color: 'black' }}>
                                AI Recommendation
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* temperature */}
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.AnimalSpecContainer, { flex: 1 }]}>
                            <Text style={styles.mainText}>Temperature</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', marginRight: 12 }}>
                                    <Image source={require('../assets/icons/ph_sun-horizon-light.png')} style={{ marginRight: 6 }} />
                                    <Text style={styles.SubText}>{animal.idealMinTemperature}° - {animal.idealMaxTemperature}°C</Text>
                                </View>
                                <View style={{ flexDirection: 'row', marginRight: 12 }}>
                                    <Image source={require('../assets/icons/carbon_partly-cloudy-night.png')} style={{ marginRight: 6 }} />
                                    <Text style={styles.SubText}>{animal.nightMinTemperature}° - {animal.nightMaxTemperature}°C</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ height: 72, justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={styles.SetButton}
                                activeOpacity={0.7}
                                onPress={onSetTempButton}
                            >
                                <Text style={styles.mainText}>Set</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* humidity */}
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.AnimalSpecContainer, { flex: 1 }]}>
                            <View>
                                <Text style={styles.mainText}>Humidity</Text>
                                <Text style={styles.SubText}>{animal.idealMinHumidity}% - {animal.idealMaxHumidity}%</Text>
                            </View>
                        </View>
                        <View style={{ height: 72, justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={styles.SetButton}
                                activeOpacity={0.7}
                                onPress={onSetHumidityButton}
                            >
                                <Text style={styles.mainText}>Set</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* lighttime */}
                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.AnimalSpecContainer, { flex: 1 }]}>
                            <Text style={styles.mainText}>LightTime</Text>
                            <Text style={styles.SubText}>{animal.lightStartTime} - {animal.lightEndTime}</Text>
                        </View>
                        <View style={{ height: 72, justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={styles.SetButton}
                                activeOpacity={0.7}
                                onPress={onSetLightTimeButton}
                            >
                                <Text style={styles.mainText}>Set</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* saveButton */}
                    <TouchableOpacity style={[styles.StartButton, { marginBottom: 24 }]} onPress={onSaveButton} activeOpacity={0.7}>
                        <Text style={[styles.mainText, { fontSize: 16, color: '#1F1F1F', fontFamily: 'Lexend-Bold' }]}>Save</Text>
                    </TouchableOpacity>
                    {/* saving modal */}
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={savingModalVisible}
                        onRequestClose={toggleSavingModal}
                    >
                        <View style={styles.ModalContainer}>
                            <View style={styles.ChatgptModalContent}>
                                <Text style={[styles.mainText,{color:'black'}]}>Saving Data...</Text>
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        animationType='fade'
                        transparent={true}
                        visible={chatgptModalVisible}
                        onRequestClose={toggleChatgptModal}
                    >
                        <View style={styles.ModalContainer}>
                            {!isLoading ?
                            <View style={styles.ChatgptModalContent}>
                                <View style={{
                                    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                    marginBottom: 16,
                                    }}>
                                    <View style={{ marginRight: 16 }}>
                                        <Image
                                            source={require('../assets/icons/chatgpt_logo.png')}
                                            style={styles.ChatgptLogo} />
                                    </View>
                                    <Text style={{ color: 'black' }}>
                                        AI Recommendation
                                    </Text>
                                </View>
                                <View style={styles.ChatgptTextContainer}>
                                    <Text style={styles.ChatgptModalText}>
                                        Is this correct species of your amphibia?
                                    </Text>
                                    <Text style={styles.ChatgptModalText}>
                                        If not, modify it.
                                    </Text>
                                </View>
                                <View style={{ width: '100%', marginBottom: 12, }}>
                                    <TextInput
                                        placeholder={animal.species}
                                        placeholderTextColor={'#94C7AB'}
                                        style={[styles.ChatgptModalTextInput]}
                                        onChangeText={setSpecies} />
                                </View>
                                <TouchableOpacity
                                    onPress={onGetDataButton}
                                    style={styles.GetDataButton}
                                >
                                    <Text style={styles.MainText}>Get Data</Text>
                                </TouchableOpacity>
                            </View> : 
                            <View style={styles.ChatgptModalContent}>
                                <Text style={[styles.mainText,{color:'black'}]}>Getting Data...</Text>
                            </View>    
                            }   
                        </View>
                    </Modal>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

export default EditScreen;
