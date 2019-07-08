import { Dimensions } from 'react-native'
import {
  COLOR_ORANGE,
  COLOR_TEXT_GREY_LIGHT
} from './Color'


export const FAC_COURT = {
  height:40,
  width:40,
  backgroundColor: '#000',
  justifyContent: 'space-around',
  borderRadius:20,
  borderWidth:1,
  borderStyle:'solid',
  borderColor:COLOR_ORANGE,
  marginLeft:20,
  marginTop:0,
}

export const FAC_COURT_ACTIVE = {
  height:40,
  width:40,
  backgroundColor: COLOR_ORANGE,
  justifyContent: 'space-around',
  borderRadius:20,
  borderWidth:1,
  borderStyle:'solid',
  borderColor:COLOR_ORANGE,
  marginLeft:20,
  marginTop:0,
}

export const FAC_CARD = {
  height:'85%',
  width:Dimensions.get('window').width * 0.8 / 2,
  backgroundColor: 'dimgrey',
  justifyContent: 'space-around',
  borderRadius:5,
  borderWidth:1,
  borderStyle:'solid',
  borderColor:'grey',
  marginLeft:10,
  marginTop:20
}

export const FAC_TITLE = {
  fontSize: 20,
  fontWeight: '500',
  color: 'white',
  alignSelf: 'flex-start'
}

export const FAC_DESC = {
  fontSize: 10,
  // fontWeight: '500',
  color: 'grey',
  alignSelf: 'flex-start'
}

export const USERNAME = {
  fontSize: 25,
  fontWeight: '500',
  color: 'white',
  alignSelf: 'flex-start'
}

export const USERID = {
  fontSize: 13,
  // fontWeight: '500',
  color: 'white',
  alignSelf: 'flex-start'
}

export const ACT_TITLE_1 = {
  fontSize: 14,
  // fontWeight: '500',
  color: 'grey',
  alignSelf: 'center',
  marginVertical:20
}

export const ACT_TITLE_2 = {
  fontSize: 12,
  flex:1,
  // fontWeight: '500',
  color: 'grey',
  alignSelf: 'flex-start',
  marginVertical:10,
  marginLeft:10
}

export const ACT_VAL_1 = {
  fontSize: 16,
  fontWeight: '500',
  color: 'white',
  alignSelf: 'center',
  marginVertical:20
}

export const ACT_VAL_2 = {
  fontSize: 12,
  flex:1,
  fontWeight: '500',
  color: 'white',
  textAlign: 'right',
  marginVertical:10,
  marginLeft:'auto'
}

export const TITLE_1 = {
  fontSize: 14,
  fontWeight: '500',
  color: 'white',
  alignSelf: 'center',
  marginVertical:20
}

export const BTN_TEXT = {
  fontSize: 10,
  color: 'white',
  alignSelf: 'center'
}

export const BTN_PRIMARY = {
  height: 36,
  width: 180,
  backgroundColor: COLOR_ORANGE,
  borderColor: COLOR_ORANGE,
  borderWidth: 1,
  borderRadius: 15,
  marginBottom: 10,
  justifyContent: 'center',
  alignSelf: 'center',
  width:'50%'
}

export const BTN_PRIMARY_FLAT = {
  height: 36,
  width: '100%',
  backgroundColor: COLOR_ORANGE,
  borderColor: COLOR_ORANGE,
  justifyContent: 'center',
  alignSelf: 'center',
}
