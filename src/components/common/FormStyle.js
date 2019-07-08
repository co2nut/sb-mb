import * as t from "tcomb-form-native";
import {
  COLOR_NOTIFICATION,
  COLOR_TEXT_GREY_LIGHT,
  COLOR_TEXT_GREY_LIGHTB,
  COLOR_TEXT_GREY_LIGHTC,
  COLOR_TEXT,
  COLOR_RED,
  COLOR_ORANGE,
  COLOR_ORANGE_2,
  COLOR_TEXT_GREY,
  COLOR_RED_ERR } from './Color'
var _ = require('lodash');
const FONT_SIZE = 15

  const stylesheet = _.cloneDeep(t.form.Form.stylesheet);
  stylesheet.textbox.normal.color = COLOR_TEXT_GREY_LIGHT;
  stylesheet.textbox.normal.borderWidth= 0;
  stylesheet.textbox.normal.fontSize= FONT_SIZE;
  stylesheet.textbox.normal.marginBottom= 0;
  stylesheet.textbox.normal.borderRadius= 1;
  stylesheet.textbox.normal.backgroundColor= 'transparent';

  stylesheet.textbox.error.width = window.width * 0.9;
  stylesheet.textbox.error.borderWidth= 0;
  stylesheet.textbox.error.fontSize= FONT_SIZE;
  stylesheet.textbox.error.marginBottom= 0;
  stylesheet.textbox.error.borderRadius= 5;
  stylesheet.textbox.error.backgroundColor= COLOR_TEXT_GREY_LIGHTC;

  stylesheet.pickerContainer.normal.borderColor= COLOR_TEXT_GREY_LIGHTC;
  // stylesheet.pickerContainer.normal.backgroundColor= COLOR_TEXT_GREY_LIGHTC;
  stylesheet.pickerContainer.normal.height= 40;
  stylesheet.pickerContainer.normal.borderWidth= 10;
  stylesheet.pickerContainer.normal.borderRadius= 10;
  stylesheet.pickerContainer.normal.borderColor= COLOR_TEXT_GREY_LIGHTC;
  // stylesheet.pickerContainer.normal.fontSize= FONT_SIZE;

  stylesheet.pickerContainer.error.backgroundColor= COLOR_TEXT_GREY_LIGHTC;
  // stylesheet.pickerContainer.error.borderRadius= 5;
  stylesheet.pickerValue.normal.color= '#474843';
  // stylesheet.pickerValue.normal.fontSize= 10;
  stylesheet.pickerValue.error.color= COLOR_RED;

  stylesheet.pickerTouchable.normal.borderRadius= 15;

  stylesheet.dateValue.normal.color= '#474843';
  stylesheet.dateValue.normal.fontSize= FONT_SIZE;
  stylesheet.dateValue.normal.backgroundColor= COLOR_TEXT_GREY_LIGHTC;
  stylesheet.dateValue.normal.borderRadius= 5;

  stylesheet.dateValue.error.fontSize= FONT_SIZE;
  stylesheet.dateValue.error.backgroundColor= COLOR_TEXT_GREY_LIGHTC;
  stylesheet.dateValue.error.borderRadius= 5;

  stylesheet.controlLabel.normal.color = COLOR_ORANGE;
  stylesheet.controlLabel.normal.fontSize = FONT_SIZE;
  stylesheet.controlLabel.normal.marginBottom = 0;

  stylesheet.controlLabel.error.color = COLOR_RED;
  stylesheet.controlLabel.error.fontSize = FONT_SIZE;
  stylesheet.controlLabel.error.marginBottom = 0;

  stylesheet.errorBlock.color = COLOR_RED;
  stylesheet.errorBlock.fontSize = FONT_SIZE;
  stylesheet.errorBlock.marginBottom = 0;

  stylesheet.select.normal.color = '#474843';


  stylesheet.pickerValue.error.color= COLOR_RED;

module.exports = stylesheet;
