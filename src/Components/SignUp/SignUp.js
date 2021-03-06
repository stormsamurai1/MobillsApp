import React, { useState } from 'react'

import { View } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import auth from '@react-native-firebase/auth'

import firestore from '@react-native-firebase/firestore'

import { SignUpMessage, Card, InputBlock, UserInput, PasswordInput, InputArea,  SignUpButton, SignUpButtonText, GoBackButton, GoBackText } from './styles'


export default function SignUp(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const navigator = useNavigation()

    function navigateToLogin(){
        navigator.goBack()
    }

    function navigateToMain(ref){
        navigator.navigate('Main', {ref})
    }

    async function handleSignUp(){
        if(password === "" || password === "" || confirmPassword === ""){
            alert('Preencha todos os campos!')
            return ;
        }

        if( password !=confirmPassword){
            alert('Erro: Senhas estão diferentes!')
            return ;
        }

        try{
            await auth().createUserWithEmailAndPassword(email, password)
            
            const res = await firestore().collection('Usuarios').add({email, operations: []})
            
            await firestore().collection('Usuarios').doc(res._documentPath._parts[1]).update({ref:res._documentPath._parts[1]})

            navigateToMain(res._documentPath._parts[1])
        }catch(error){
            alert('Essa conta já existe!')
        }
    }

    return (
        <View style={{alignItems:"center", flex: 1}}>
            <SignUpMessage>Cadastre-se agora!</SignUpMessage>
        
            <Card>
                <InputBlock>
                    <UserInput>Email</UserInput>
                    <InputArea value={email} onChangeText= {(inputUser) => { setEmail(inputUser) }}/>
                    <PasswordInput>Password</PasswordInput>
                    <InputArea secureTextEntry={true} value={password} onChangeText= {(inputUser) => { setPassword(inputUser) }}/>
                    <PasswordInput>Confirm Password</PasswordInput>
                    <InputArea secureTextEntry={true} value={confirmPassword} onChangeText= {(inputUser) => { setConfirmPassword(inputUser) }}/>
                </InputBlock>
            
            
                <SignUpButton onPress={() => handleSignUp()}>
                    <SignUpButtonText>Finalizar</SignUpButtonText>
                </SignUpButton>


                <SignUpButton style={{marginTop: 5}} onPress={() => navigateToLogin()}>
                    <SignUpButtonText>Voltar</SignUpButtonText>
                </SignUpButton>
            </Card>

        </View>
    )
}