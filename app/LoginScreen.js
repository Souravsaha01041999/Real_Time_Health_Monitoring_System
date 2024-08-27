import { React, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import axios from 'axios';
import { LoginUrl } from './ApiDetails';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [loginId, onLoginChange] = useState('');
    const [password, onPasswordChangeText] = useState('');
    const nav = useNavigation();

    AsyncStorage.getItem('loginId').then(
        (result) => {
            if (result != null) {
                nav.navigate('Home');
            }
        }
    );

    function onClickLogin() {
        axios.post(LoginUrl, {
            email: loginId,
            password: password
        }).then(async (resp) => {
            if (resp['data'] == '0') {
                Alert.alert('Error', 'Invalid credential', [
                    {
                        text: 'Ok',
                        style: 'destructive'
                    }
                ]);
            } else {
                await AsyncStorage.setItem('loginId', loginId);
                nav.navigate('Home');
            }
        }).catch((err) => {
            Alert.alert('Error', 'Error network', [
                {
                    text: 'Ok',
                    style: 'destructive'
                }
            ]);
        });
    }

    function onEmailChange(text) {
        onLoginChange(text);
    }

    function onPasswordChange(text) {
        onPasswordChangeText(text);
    }

    return (
        <View style={styles.container}>
            <TextInput placeholder='Email' style={styles.email} onChangeText={onEmailChange} />

            <TextInput placeholder='Password' secureTextEntry={true} style={styles.password} onChangeText={onPasswordChange} />

            <View style={styles.buttonHolder}>
                <TouchableOpacity onPress={onClickLogin} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    email: {
        backgroundColor: '#D59FE1',
        width: 300,
        fontSize: 20,
        padding: 10,
        color: '#000000',
        borderWidth: 2,
        borderColor: '#243064',
        borderRadius: 20
    },
    password: {
        backgroundColor: '#D59FE1',
        width: 300,
        fontSize: 20,
        padding: 10,
        color: '#000000',
        borderWidth: 2,
        borderColor: '#243064',
        borderRadius: 20,
        marginTop: 30
    },
    buttonHolder: {
        marginTop: 15
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
    }
});
