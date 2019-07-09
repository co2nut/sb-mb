import React, { Component } from 'react'
import { Animated, Easing, Alert, ScrollView, View, Text, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import client from '../feathers'
import { AsyncStorage } from "react-native"
import { updateProfile, updateMachine, updateActivePaymentItem } from '../actions'
import { bindActionCreators } from "redux"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Input, Divider } from 'react-native-elements';
import moment from 'moment'
import Loading from "./common/Loading"

/*
  Set the total with the response for the intial payments request
  If you want the total to update, pullToRefresh
*/
const queryLimit = 10;
class Calendar extends Component {
    static navigationOptions = ({navigation}) => {
      return {
        header: null,
      }
    };

    constructor (props) {
      super(props)
      this.state = {
        loading:true,
        data:[],
        refreshing: false,
        counterName:'',
        total: null,
        showAllPayments: true,
        recSkip:queryLimit,
      };
    }

    componentDidMount(){
      client.service('bookings').on('created', (Ticketbatches) => {
        this.initializeData(0);
      })

      client.service('bookings').on('removed', (Ticketbatches) => {
        this.initializeData(0);
      })

      client.service('bookings').on('updated', (Ticketbatches) => {
        this.initializeData(0);
      })

      client.service('bookings').on('patched', (Ticketbatches) => {
        this.initializeData(0);
      })

    }

    componentWillMount(){
      this.initializeData(0);
    }


    getQueryObject = (skip) => {
        return {
          query:{
            user: this.props.profile.userInfo._id,
            $sort: {
              createdAt: -1
            },
            $limit:queryLimit,
            $skip:skip,
          }
        }
    }

    initializeData(skip) {
      const queryObj = this.getQueryObject(skip)

      client.service('bookings').find(queryObj)
       .then( (res)=> {
         this.setState({
             data:res.data,
             refreshing: false,
             total: res.data.total,
             recSkip:res.data.length,
             loading:false
         })
       })
       .catch(err => {
         this.setState({refreshing: false});
       })
    }

    handleRefresh = () => {
      this.setState({
        refreshing: true,
        data: []
      }, () => {this.initializeData()})
    }

    fetchMoreData = () => {
      if(this.state.data.length === this.state.total) {
        return;
      }
      const queryObj = this.getQueryObject(this.state.recSkip)

      return client.service('bookings').find(queryObj)
       .then( (res)=> {
         if(res.data.length>0){
           this.setState({
             data:this.state.data.push(res.data),
             recSkip:this.state.recSkip + res.data.length
           })
         }
         this.setState({refreshing: false})
       })
       .catch(err => {
         this.setState({refreshing: false});
         console.log(err)
       })
    }

    _renderSportsType(btn){
      if (btn > 13){
        return 'FUTSAL'
      }
      return 'BADMINTON'

    }

    renderRow = ({item, index}) => {

      return(
          <View style={{flexDirection:'row', justifyContent:'space-around'}}>

            <View style={{flexDirection:'column', padding: 5, flex: 1}}>
              <Text style={{color:'#fff'}}>{this._renderSportsType(item.btn)}</Text>
              <Text style={{color:'#fff'}}>{ 'Court ' + item.btn}</Text>
            </View>
            <View style={{flexDirection: 'column', padding: 5, flex: 1}}>
              <Text style={{color:'#fff'}}>{item.bookingdate}</Text>
              <Text style={{color:'#fff'}}>{moment(item.dateitem).format('HH:mm') + ' - ' + moment(item.dateitem2).format('HH:mm') }</Text>
            </View>
          </View>
      )
    }

    _keyExtractor = (item, index) => item._id

    handleSwitch = () => {
        this.setState(old => ({showAllPayments: !old.showAllPayments}))
    }


    render(){
      return (this.state.loading)?
      <Loading/>
      :
        (
        <KeyboardAwareScrollView
          scrollEnabled={true}
          keyboardShouldPersistTaps='always'
          contentContainerStyle={styles.container}
          >

            <ImageBackground source={require('../assets/badmintonbg.jpg')} style={{ width:'100%', height:'100%', opacity:0.8, backgroundColor:'#000', justifyContent:'space-around'}} >
              <View style={{flex:10, width:'100%', justifyContent:'space-around', paddingVertical:20}}>

                <Text style={{alignSelf:'center', fontWeight:'bold', fontSize:20, color:'#fff', marginBottom:10}}>Bookings History</Text>

                <FlatList
                  data={this.state.data}
                  renderItem={this.renderRow}
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleRefresh}
                  ItemSeparatorComponent={() => (<View style={{height:1, width: '95%', backgroundColor: 'white', marginLeft: 'auto', marginRight: 'auto'}}></View>)}
                  onEndReachedThreshold={0.3}
                  onEndReached={this.fetchMoreData}
                />

              </View>
            </ImageBackground>


          </KeyboardAwareScrollView>
      )


    }
}


const styles = {
  container: {
    flexDirection: 'column',
    justifyContent:'space-around',
    flex:1,
    paddingTop: 20,
    paddingHorizontal:20,
    backgroundColor: 'black'
  },
  rowView:{
    flex: 1,
    borderColor: 'black',
    borderWidth: 0.5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowViewBig:{
    flex: 2,
    borderColor: 'black',
    borderWidth: 0.5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#4682b4'
  }
}

function mapStateToProps(state) {
  return {
    profile: state.profile,
  }
}

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators({
//     }, dispatch);
// }


export default connect(mapStateToProps)(Calendar);
