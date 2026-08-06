import {useState, useEffect} from 'react';
import {arraysEqual} from './Util';
import { defaultUsers, defaultProducts, defaultBookings, defaultBalance, defaultUser } from './DefaultData';
import { notifyError } from './Notifications';

const updateRate = 1*1000;
const settingsRate = 10*1000;
const summaryRate = 5*1000;
const requestTimeout = 10*1000;
const errorNoticeRate = 5*1000;
const debug = false;

const pendingRequests = new Set();
let lastErrorNotice = 0;

// one message per interval, otherwise a short outage stacks up a wall of toasts
function notifyRequestError(error) {
    const now = Date.now();
    if(now - lastErrorNotice < errorNoticeRate) return;
    lastErrorNotice = now;
    notifyError('Datenbank-Fehler: ' + error);
}

function doRequest(topic, method, params, oldData, setData, defaultData, calculate = null) {
    if(topic.slice(-2)==='-1') {
        if(calculate != null) defaultData = calculate(defaultData);
        if(arraysEqual(defaultData, oldData)) return;
        if(setData!=null) setData(defaultData);
        return;
    }

    // skips a poll while the same one is still running so a busy server does not get flooded
    const requestKey = method+' '+topic;
    if(method === 'GET' && pendingRequests.has(requestKey)) return;
    pendingRequests.add(requestKey);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeout);

    fetch(`http://${process.env.REACT_APP_DB_IP}:${process.env.REACT_APP_DB_PORT}/bounty/${topic}`, {
        method: method,
        headers: {'Content-Type': 'application/json'},
        signal: controller.signal,
        ...(method !== 'GET' ? {body: JSON.stringify(params)} : {}),
    })
    .then(response => response.json())
    .then(data => {
        if(method === 'PULL') return console.log(data);
        if(calculate!=null) data = calculate(data);

        if(arraysEqual(data, oldData)) return;
        console.log(topic+' new data: '); console.log(data);
        console.log(topic+` old data: `); console.log(oldData);
        if(setData!=null) setData(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        notifyRequestError(error);
        if(oldData != null) return; // keeps the last known data instead of clearing the view
        if(calculate != null) defaultData = calculate(defaultData);
        if(arraysEqual(defaultData, oldData)) return;
        if(setData!=null) setData(defaultData);
    })
    .finally(() => {
        clearTimeout(timeout);
        pendingRequests.delete(requestKey);
    })
}

function useGetData(topic, defaultData, callback = null, calculate=null, continues = true, method = 'GET', params = {}, rate = updateRate) {
    const [data, setData] = useState(null);

    useEffect(() => {
        doRequest(topic, method, params, data, setData, defaultData, calculate);
    }, [topic, method]);

    useEffect(() => {
        if(!continues) return;

        if(debug) console.log('start loop '+topic);
        const updateLoop = setInterval(() => {
            doRequest(topic, method, params, data, setData, defaultData, calculate);
        }, rate);

        if(callback != null && (data != null || (defaultData != null && defaultData.length > 0))) callback(data==null ? (calculate!=null ? calculate(defaultData) : defaultData) : data);

        return () => {
            if(debug) console.log('stop loop '+topic);
            clearInterval(updateLoop);
        }
    }, [data, topic, method, continues, rate]);

    if(data == null || data === undefined) return calculate!=null ? calculate(defaultData) : defaultData;

    return data;
}

export function useGetUsers(callback, onlyActive = true) {
    return useGetData('accounts', defaultUsers, callback, (users) => Array.isArray(users) ? users.filter(({active}) => !onlyActive || active===1): [users]);
}

export function useGetProducts(callback, onlyActive = true) {
    return useGetData('products', defaultProducts, callback, (products) => products.filter(({active}) => !onlyActive || active===1).sort((product1, product2) => (product1.place < product2.place ? -1 : product1.place > product2.place ? 1: 0)));
}

// delivers the whole account so balance and deposit share a single request
export function useGetUserAccount(user, callback) {
    if(user==null || user===undefined)
        user = {userId: -1};
    return useGetData('accounts/'+user.userId, defaultUser, callback);
}

export function useGetUserBalance(user, callback) {
    if(user==null || user===undefined)
        user = {userId: -1};
    return useGetData('accounts/'+user.userId, [{balance: defaultBalance}], callback, ({balance}) => balance);
}

// changes about once a day, so a slower interval is enough here
export function useGetSettings() {
    return useGetData('settings', {}, null, null, true, 'GET', {}, settingsRate);
}

export function setSetting(key, value) {
    doRequest('settings', 'PUT', {key: key, value: value});
}

export function useGetSummary() {
    return useGetData('summary', null, null, null, true, 'GET', {}, summaryRate);
}

export function getUserBalance(userId, callback) {
    return doRequest('accounts/'+userId, 'GET', {}, null, callback, null);
}

export function useGetLastBookings(userId, setBookings) {
    return useGetData('history/'+userId, defaultBookings.map((booking) => ({...booking, products: JSON.stringify(booking.products)})), setBookings, (booking) => booking.map((booking) => ({...booking, products: JSON.parse(booking.products)})).sort((booking1, booking2) => booking2.bookingId - booking1.bookingId));
}

export function getLastBookings(userId, setBookings) {
    return doRequest('history/'+userId, 'GET', {}, null, setBookings, defaultBookings.map((booking) => ({...booking, products: JSON.stringify(booking.products)})), (booking) => booking.map((booking) => ({...booking, products: JSON.parse(booking.products)})).sort((booking1, booking2) => booking2.bookingId - booking1.bookingId));
    // return useGetData('history/'+userId, defaultBookings.map((booking) => ({...booking, products: JSON.stringify(booking.products)})), null, (booking) => booking.map((booking) => ({...booking, products: JSON.parse(booking.products)})), true);
}

export function commitBooking(userId, booking) {
    // console.log({...booking, products: JSON.stringify(booking.products)});
    doRequest('accounts/'+userId, 'POST', {...booking, products: JSON.stringify(booking.products)}, null, (result) => {
        if(result.balance!==booking.newBalance) {
            notifyError(`Kontostand-Fehler! Erwartet: ${booking.newBalance}€  Tatsächlich: ${result.balance}€`);
            console.error(`Balance mismatch: expected ${booking.newBalance}, got ${result.balance}`);
        }
    });
}

export function addProduct(productName, productPrice, stock = null, deposit = 0) {
    const data = {name: productName, price: productPrice, deposit: deposit};
    if(stock !== null && stock !== '' && !isNaN(stock)) data.stock = stock;
    doRequest('products', 'POST', data);
}

export function removeProduct(product) {
    doRequest('products', 'PUT', {...product, active: 0});
}

export function changeProduct(newProduct) {
    doRequest('products', 'PUT', newProduct);
}

export function addUser(firstname, lastname, balance) {
    doRequest('accounts', 'POST', {firstname: firstname, lastname: lastname, balance: balance});
}

export function removeUser(user) {
    doRequest('accounts/'+user.userId, 'PUT', {...user, active: 0});
}

export function changeUser(newUser) {
    doRequest('accounts/'+newUser.userId, 'PUT', newUser);
}

export function getUserByCardId(cardId, setUser) {
    doRequest('cards/'+cardId, 'GET', {}, null, setUser, defaultUser);
}