import { expect } from 'chai';
import { UTCToFormattedString, compareDateByParam, filterActiveCookie, renderCookies } from './../index.mjs';
import { mockCookieList } from './mock.constant.mjs'

describe('Find recenlty used cookies', () => {
    const defaultFilterDate = '2018-12-09';
    const defaultUTCDateTime = '2018-12-09T10:13:00+00:00';

    it('Should return a formated date in `YYYY-mm-dd` format', () => {
        const inputDate = new Date('2018-12-09T14:19:00+00:00');
        var formatedDate = UTCToFormattedString(inputDate);
        expect(formatedDate).to.equal(defaultFilterDate);
    });

    it('Should return 4 Cookie items', () => {
        const filteredCookieList = filterActiveCookie(mockCookieList, defaultFilterDate);
        expect(filteredCookieList.length).to.equal(4);
    });

    it('Should return 0 Cookie items', () => {
        const inputFilterDate = '2018-12-10';
        const filteredCookieList = filterActiveCookie(mockCookieList, inputFilterDate);
        expect(filteredCookieList.length).to.equal(0);
    });

    it('Should return 1 Cookie items', () => {
        const inputFilterDate = '2018-12-07';
        const filteredCookieList = filterActiveCookie(mockCookieList, inputFilterDate);
        expect(filteredCookieList.length).to.equal(1);
    });

    it('Should return true when the filterCookie items are printed', () => {
        const inputFilterDate = '2018-12-07';
        const filteredCookieList = filterActiveCookie(mockCookieList, inputFilterDate);
        const boolValue = renderCookies(filteredCookieList);
        expect(boolValue).to.equal(true);
    });

    it('Should return false when the filterList is empty', () => {
        const inputFilterDate = '2018-12-06';
        const filteredCookieList = filterActiveCookie(mockCookieList, inputFilterDate);
        const boolValue = renderCookies(filteredCookieList);
        expect(boolValue).to.equal(false);
    });

    it('Should return true when the source and filter dates are equal', () => {
        const boolValue = compareDateByParam(defaultUTCDateTime, defaultFilterDate);
        expect(boolValue).to.equal(true);
    });

    it('Should return false when the source and filter dates are not equal', () => {
        const inputFilterDate = '2018-12-08';
        const boolValue = compareDateByParam(defaultUTCDateTime, inputFilterDate);
        expect(boolValue).to.equal(false);
    });

    it('Should return false when the source and filter dates are not equal', () => {
        const inputFilterDate = '2018-12-11';
        const boolValue = compareDateByParam(defaultUTCDateTime, inputFilterDate);
        expect(boolValue).to.equal(false);
    });

    it('Should return false when the filter Date is empty', () => {
        const boolValue = compareDateByParam(defaultUTCDateTime, "");
        expect(boolValue).to.equal(false);
    });

});