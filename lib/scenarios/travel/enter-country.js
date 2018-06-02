'use strict';Object.defineProperty(exports,"__esModule",{value:true});var _regenerator=require('babel-runtime/regenerator');var _regenerator2=_interopRequireDefault(_regenerator);var _asyncToGenerator2=require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2);var _toBool=require('../../to-bool');var _toBool2=_interopRequireDefault(_toBool);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}exports.default=function(){var _ref=(0,_asyncToGenerator3.default)(/*#__PURE__*/_regenerator2.default.mark(function _callee(page,_ref2){var _ref2$selectPredicted=_ref2.selectPredictedCountry,selectPredictedCountry=_ref2$selectPredicted===undefined?false:_ref2$selectPredicted,_ref2$countryName=_ref2.countryName,countryName=_ref2$countryName===undefined?'United Kingdom':_ref2$countryName;var _ref3$message,message;return _regenerator2.default.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.prev=0;_context.next=3;return page.waitForSelector('.quote-travel .quote-input-container');case 3:if(!(0,_toBool2.default)(selectPredictedCountry)){_context.next=8;break;}_context.next=6;return page.click('.predicted-country-question a.accept-predicted-country');case 6:_context.next=22;break;case 8:_context.next=10;return page.evaluate(function(){document.querySelector('.quote-travel .quote-input-container input.quote-input-country').scrollIntoView({behaviour:'instant'});});case 10:_context.next=12;return page.waitForSelector('.quote-travel .quote-input-container input.quote-input-country',{visible:true});case 12:_context.next=14;return page.focus('.quote-travel .quote-input-container input.quote-input-country');case 14:_context.next=16;return page.click('.quote-travel .quote-input-container input.quote-input-country',{clickCount:3});case 16:_context.next=18;return page.keyboard.press('Backspace');case 18:_context.next=20;return page.type('.quote-travel .quote-input-container input.quote-input-country',countryName);case 20:_context.next=22;return page.evaluate(function(){document.querySelector('.quote-travel .quote-input-container input.quote-input-country').dispatchEvent(new Event('change',{bubbles:true,cancelable:true,view:window}));});case 22:_context.next=29;break;case 24:_context.prev=24;_context.t0=_context['catch'](0);_ref3$message=_context.t0.message;message=_ref3$message===undefined?'No error message is defined':_ref3$message;console.error('Error in Enter Country. '+message.trim());case 29:case'end':return _context.stop();}}},_callee,undefined,[[0,24]]);}));return function(_x,_x2){return _ref.apply(this,arguments);};}();/* eslint no-console: "off", no-shadow: "off", no-param-reassign: "off" *//*
import { countries } from 'app/countries';

export default async (page, { countryName = 'United Kingdom' }) => {
  await page.waitForSelector('.quote-travel .quote-input-container');

  await page.click('.predicted-country-question a.accept-predicted-country');

  await page.waitForSelector('.quote-travel .quote-input-container');

  const countryIndex = countries.findIndex((country) => country.toLowerCase() === countryName.toLowerCase());

  await page.evaluate(({ countryIndex, countryName }) => {
    const EVENT = { bubbles: true, cancelable: true, view: window };
    const selectedIndex = (countryIndex + 1);

    document.querySelectorAll('#country-quote-travel')
      .forEach((country) => {
        country.dispatchEvent(new FocusEvent('focus', EVENT));
        country.dispatchEvent(new MouseEvent('click', EVENT));
        country.value = countryName;
        country.dispatchEvent(new Event('change', EVENT));
      });

    document.querySelectorAll('.alternative-country-select')
      .forEach((country) => {
        country.dispatchEvent(new FocusEvent('focus', EVENT));
        country.dispatchEvent(new MouseEvent('click', EVENT));
        country.selectedIndex = selectedIndex;
        country.dispatchEvent(new Event('change', EVENT));
      });

    const acceptPredictedCountry = document.querySelector('.accept-predicted-country');
    if (acceptPredictedCountry) acceptPredictedCountry.dispatchEvent(new MouseEvent('click', EVENT));
  }, { countryName, countryIndex });
};
*//*
  await page.evaluate(() => { document.querySelectorAll('.quote-travel .alternative-country-container select.alternative-country-select').forEach((select) => select.scrollIntoView()); });
  await page.select('.quote-travel .alternative-country-container select.alternative-country-select', 'United Kingdom');
*/