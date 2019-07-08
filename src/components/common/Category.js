import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image,  Animated, TouchableWithoutFeedback, Easing, Dimensions  } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { withNavigation } from 'react-navigation'

class Category extends Component {

  constructor(props){
    super(props)

    this.state={
      scaleAnimation: new Animated.Value(0),
      colorAnimation: new Animated.Value(0),
      moveXAnimation: new Animated.Value(0),
      moveYAnimation: new Animated.Value(0),
      entries:[],
      loading:true,
    }

    this.startAnimation = this.startAnimation.bind(this)
    this.resetAnimation = this.resetAnimation.bind(this)
  }
    startAnimation = () => {
        Animated.parallel([
          Animated.timing(this.state.colorAnimation, {
             toValue: 1,
             duration: 500
           }),
          // Animated.timing(this.state.moveXAnimation, {
          //    toValue: (this.props.i % 2 === 0)?80:-80,
          //    duration:500 + (this.props.i / 10 * 500),
          //    easing: Easing.elastic(1)
          //  }),
          Animated.timing(this.state.scaleAnimation, {
               toValue: 1,
               duration:500 + (this.props.i / 10 * 500),
               easing: Easing.elastic(1)
           }),
          // Animated.spring(this.state.scaleAnimation, {
          //   toValue: 1,
          //   friction:2,
          //   tension:1
          // }),
        ]).start();
    }

    resetAnimation = () => {
        Animated.parallel([
          Animated.timing(this.state.colorAnimation, {
             toValue: 0,
             // duration: 500
           }),
          // Animated.timing(this.state.moveXAnimation, {
          //    toValue: (this.props.i % 2 === 0)?80:-80,
          //    duration:500 + (this.props.i / 10 * 500),
          //    easing: Easing.elastic(1)
          //  }),
          Animated.timing(this.state.scaleAnimation, {
               toValue: 0,
               // duration:500 + (this.props.i / 10 * 500),
               // easing: Easing.elastic(1)
           }),
          // Animated.spring(this.state.scaleAnimation, {
          //   toValue: 1,
          //   friction:2,
          //   tension:1
          // }),
        ]).start();
    }

    componentWillMount(){
      this.startAnimation()
    }

    componentDidUpdate(){
      if(!this.props.animate){
        this.resetAnimation()
      }else{
        this.startAnimation()
      }
    }

    render(){

      const backgroundColorInterpolate = this.state.colorAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["rgb(255,255,255)", this.props.val.color]
      })

      const animatedStyles = {
        transform: [
          { scale: this.state.scaleAnimation },
          { translateY: this.state.moveYAnimation },
          // { translateX: this.state.moveXAnimation }
        ]
      }

      const animatedColorStyles = {
        borderColor:backgroundColorInterpolate,
      }

      return (
        <TouchableOpacity style={styles.categories} onPress={()=>{
          this.props.val.route?this.props.navigation.navigate(this.props.val.route,{propertyUnit:this.props.propertyUnit,property:this.props.property}):console.log('in progress')
          }} >
          <Animated.View key={this.props.i} style={[styles.categories, animatedStyles]}>
            <Animated.View  style={[styles.category, animatedColorStyles, {borderRadius:50, borderWidth:1}]}>
              <Icon name={this.props.val.icon} size={25} style={[styles.categoryIcon, {color:this.props.val.color}]} />
            </Animated.View>
            <Text style={styles.categoryTitle}>{this.props.val.title}</Text>
          </Animated.View>
        </TouchableOpacity>
      )

    }

}

const styles = {

    item: {
      backgroundColor: '#4D243D',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      margin: 1,
      height: Dimensions.get('window').width / 2, // approximate a square
    },
    itemInvisible: {
      backgroundColor: 'transparent',
    },
    mainLink:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor:'#fff'
    },
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    logo: {
      width: 120,
      height: 130
    },
    categoryTitle:{
      color:'grey',
      alignSelf:'center',
      fontWeight:'bold',
      fontSize:13,
      marginTop:5,
    },
    categoryWrap:{
      width:130,
      marginTop:10,
      alignSelf:'center',
      height:35,
      backgroundColor:'rgba(169, 216, 255, 1)',
      borderRadius:5,
      justifyContent:'space-around',
    },
    categoryIcon:{
      // color:'rgba(43, 54, 145, 0.9)',
      // marginTop:5,
      alignSelf:'center'
    },
    category:{
      // marginHorizontal:20,
      flex:0.4,
      width:60,
      height:60,
      padding:10,
      backgroundColor:'#fff',
      shadowColor: "#000",
      shadowOffset: {
      	width: 0,
      	height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      borderWidth:0.1
    },
    categories:{
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      margin: 1,
      height: Dimensions.get('window').width / 3, // approximate a square
      flexDirection:'column',
      // marginTop:-10,
    }
}

export default withNavigation(Category);
