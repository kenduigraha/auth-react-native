/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Alert
} from 'react-native';

import t from 'tcomb-form-native'

const STORAGE_KEY = 'id_token'

var Form = t.form.Form

var Person = t.struct({
  username: t.String,
  password: t.String
})

const options = {}

export default class AuthReactNative extends Component {
  async _onValueChange(item, selectedValue){
    try{
      await AsyncStorage.setItem(item, selectedValue)
    }catch(error){
      console.log('AsyncStorage error', error.message);
    }
  }

  async _getProtectedAPI(item, selectedValue){//ES7
    var TOKEN = await AsyncStorage.getItem(STORAGE_KEY)
    fetch("http://localhost:3001/api/protected/sayhello/", {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + TOKEN
      }
    })
      .then((response) => response.text())
      .then((data) => {
        AlertIOS.alert(
          "Hai", data
        )
      })
      .done()
  }

  async _userLogout(){
    try{
      AlertIOS.alert("logout before", await AsyncStorage.getItem(STORAGE_KEY))
      await AsyncStorage.removeItem(STORAGE_KEY)
      AlertIOS.alert("logout success", await AsyncStorage.getItem(STORAGE_KEY))
    }catch(error){
      console.log('AsyncStorage error' + error.message);
    }
  }

  _userSignup(){
    var value = this.refs.form.getValue()
    if(value){
      fetch("http://localhost:3001/users/register", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: value.username,
          password: value.password
        })
      })
        .then(response => response.json())
        .then(data => {
          this._onValueChange(STORAGE_KEY, data.id_token)
          AlertIOS.alert(
            "Sign up success"
          )
        })
        .done()
    }
  }

  _userLogin(){
    var value = this.refs.form.getValue()
    if(value){
      fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: value.username,
          password: value.password
        })
      })
        .then(response => response.json())
        .then(data => {
          this._onValueChange(STORAGE_KEY, data.id_token)
          AlertIOS.alert(
            "login success", data.id_token
          )
        })
        .done()
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Signup / Login</Text>
        </View>
        <View>
          <Form
            ref="form"
            type={Person}
            options={options}
          />
        </View>
        <View>
          <TouchableHighlight
            style={styles.button}
            onPress={this._userSignup.bind(this)}
            underLayColor='#99d9f4'
          >
          <Text style={styles.buttonText}>
            Signup
          </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.button}
            onPress={this._userLogin.bind(this)}
            underLayColor='#99d9f4'
          >
          <Text style={styles.buttonText}>
            Login
          </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.button}
            onPress={this._userLogout.bind(this)}
            underLayColor='#99d9f4'
          >
          <Text style={styles.buttonText}>
            Logout
          </Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.button}
            onPress={this._getProtectedAPI.bind(this)}
            underLayColor='#99d9f4'
          >
          <Text style={styles.buttonText}>
            Say hello
          </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    // alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 30,
    color: 'white',
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('AuthReactNative', () => AuthReactNative);
