import {useState, useEffect} from 'react';
import {arraysEqual} from './Util';
import { defaultUsers, defaultProducts, defaultBookings, defaultBalance } from './DefaultData';

const updateRate = 6*1000;
const debug = false;

function doRequest(topic, method, params, oldData, setData, defaultData, calculate = null) {
    if(topic.slice(-2)==='-1') return;
    fetch("http://127.0.0.1:5000/bounty/"+topic, {
        method: method,
        headers: params,
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
        window.alert('Datenbank Error: '+error);
        if(calculate != null) defaultData = calculate(defaultData);
        if(arraysEqual(defaultData, oldData)) return;
        if(setData!=null) setData(defaultData);
    })
}

function useGetData(topic, defaultData, callback = null, calculate=null, continues = true, method = 'GET', params = {}) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        doRequest(topic, method, params, data, setData, defaultData, calculate);
    }, [topic, method]);

    useEffect(() => {
        if(!continues) return;

        if(debug) console.log('start loop '+topic);
        const updateLoop = setInterval(() => {
            doRequest(topic, method, params, data, setData, defaultData, calculate);
        }, updateRate);

        if(callback != null) callback(data==null ? (calculate!=null ? calculate(defaultData) : defaultData) : data);

        return () => {
            if(debug) console.log('stop loop '+topic);
            clearInterval(updateLoop);
        }
    }, [data, topic, method, continues]);

    if(data == null || data === undefined) return calculate!=null ? calculate(defaultData) : defaultData;

    return data;
}

export function useGetUsers(callback) {
    return useGetData('accounts', defaultUsers, callback);
}

export function useGetProducts(callback, onlyActive = true) {
    return useGetData('products', defaultProducts, callback, (products) => products.filter(({active}) => !onlyActive || active===1));
}

export function useGetUserBalance(user, callback) {
    if(user==null || user===undefined) 
        user = {userId: -1};
    return useGetData('accounts/'+user.userId, [{balance: defaultBalance}], callback, ({balance}) => balance);
}

export function getLastBookings(userId, setBookings) {
    return doRequest('history/'+userId, 'GET', {}, null, setBookings, defaultBookings.map((booking) => ({...booking, products: JSON.stringify(booking.products)})), (booking) => booking.map((booking) => ({...booking, products: JSON.parse(booking.products)})).sort((booking1, booking2) => booking2.bookingId - booking1.bookingId));
    // return useGetData('history/'+userId, defaultBookings.map((booking) => ({...booking, products: JSON.stringify(booking.products)})), null, (booking) => booking.map((booking) => ({...booking, products: JSON.parse(booking.products)})), true);
}

export function commitBooking(userId, booking) {
    // console.log({...booking, products: JSON.stringify(booking.products)});
    doRequest('accounts/'+userId, 'POST', {...booking, products: JSON.stringify(booking.products)}, null, (result) => {
        if(result.balance!==booking.newBalance) {
            window.alert(`Error: false user balance! expected: ${booking.newBalance} actual: ${result.balance}`);
            console.log(`Error: false user balance! expected: ${booking.newBalance} actual: ${result.balance}`);
        }
    });
}

export function addProduct(productName, productPrice) {
    doRequest('products', 'POST', {name: productName, price: productPrice});
}

export function removeProduct(product) {
    doRequest('products', 'PUT', {...product, active: 0});
}

export function changeProduct(product, newProduct) {
    doRequest('products', 'PUT', newProduct);
}

export function addUser(firstname, lastname, balance) {
    doRequest('accounts', 'POST', {firstname: firstname, lastname: lastname, balance: balance});
}

export function removeUser(user) {
    // do server
}

export function changeUser(user, newUser) {
    doRequest('accounts/'+user.userId, 'PUT', newUser);
}