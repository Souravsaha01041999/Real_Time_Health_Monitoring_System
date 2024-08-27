import { React, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Pressable, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getAssignRooms } from './ApiDetails';
import axios from 'axios';

export default function HomeScree() {
    const nav = useNavigation();
    const [listOfRoom, onAddRoom] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('loginId').then(
            (result) => {
                if (result != null) {
                    axios.get(getAssignRooms + '?doctor=' + result).then(
                        (resp) => {
                            onAddRoom(resp['data']);
                        }
                    ).catch(
                        (err) => {
                            Alert.alert('Error', 'Internet error', [
                                {
                                    text: 'Ok',
                                    style: 'destructive'
                                }
                            ]);
                        }
                    );
                }
            }
        );

        const backHandler = () => {
            BackHandler.exitApp();
            return true;
        }

        BackHandler.addEventListener(
            "hardwareBackPress",
            backHandler
        );
    }, []);

    async function onClickLogin() {
        await AsyncStorage.clear();
        nav.navigate('Login');
    }

    function onClickData(data) {
        nav.navigate('Graph', {
            message: data
        });
    }

    return (
        <View style={styles.containerHolder}>
            <View style={styles.container1}>
                <View style={styles.buttonHolder}>
                    <TouchableOpacity onPress={onClickLogin} style={styles.button}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.container2}>
                {
                    listOfRoom.map((eachRoom) => {
                        return (
                            <Pressable key={eachRoom} onPress={() => onClickData(eachRoom)}>
                                <View style={styles.listDesign}>
                                    <Text style={styles.fontListStyle}>
                                        {eachRoom}
                                    </Text>
                                </View>
                            </Pressable>
                        )
                    })
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerHolder: {
        flex: 1,
        flexDirection: 'col'
    },

    container1: {
        flex: 1,
        alignItems: 'center'
    },
    container2: {
        flex: 8
    },
    buttonHolder: {
        marginTop: 15,
        width: 200
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 24,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    listDesign: {
        backgroundColor: '#CB7F83',
        padding: 10,
        margin: 20,
        shadowColor: '#000000',
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 8,
        borderRadius: 20
    },
    fontListStyle: {
        fontSize: 40,
        color: '#FFFFFF'
    }
});