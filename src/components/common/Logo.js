import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image,  Animated, TouchableWithoutFeedback  } from 'react-native';
import { connect } from 'react-redux';
import { COLOR_GREEN, COLOR_TEXT, COLOR_TEXT_GREY } from './Color'

class Logo extends Component {
    state = {
      animation: new Animated.Value(1),
    };
    startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.spring(this.state.animation, {
            toValue: 1.2,
            friction:2,
            tension:1
          }),
          Animated.timing(this.state.animation, {
            toValue: 1,
            duration:300,
          })
        ])).start();
    }

    componentDidMount(){
      this.startAnimation()
    }

    render(){
      return(
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../../assets/ssa-logo.png')}
          />
          <Text style={{color:COLOR_TEXT_GREY, fontSize:16, fontWeight:'600', marginTop:10}}>{this.props.title}</Text>
        </View>
      )
    }

}

const styles = {
    mainLink:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor:'#fff'
    },
    container: {
      // flex: 1,
      marginTop:30,
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      width: 300,
      height: 200
    }
}

export default Logo;
