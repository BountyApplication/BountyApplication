import {useState, useEffect} from 'react';
import {arraysEqual} from './Util';
import { defaultUsers, defaultProducts, defaultBookings } from './DefaultData';

const updateRate = 6*1000;

function doRequest(topic, method, params, oldData, setData, defaultData) {
    fetch("http://127.0.0.1:5000/bounty/"+topic, {
        method: method,
        // headers: { 'Content-Type': 'application/json' },
        body: params!=null ? JSON.stringify(params) : null,
    })
    .then(response => response.json())
    .then(data => {
        if(method === 'PULL') return console.log(data);
        if(arraysEqual(data, oldData)) return;
        console.log('new data: '); console.log(data);
        console.log(`old data: `); console.log(oldData);
        if(setData!=null) setData(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        if(arraysEqual(defaultData, oldData)) return;
        if(setData!=null) setData(defaultData);
    })
}

function useGetData(topic, method, defaultData, callback) {
    const [data, setData] = useState(null);

    useEffect(() => {
        console.log('start loop');
        const updateLoop = setInterval(() => {
            doRequest(topic, method, null, data, setData, defaultData);
        }, updateRate);

        if(callback != null) callback(data==null?defaultData:data);

        return () => {
            console.log('stop loop');
            clearInterval(updateLoop);
        }
    }, [data]);

    if(data == null || data === undefined) return defaultData;

    return data;
}

export function useGetUsers(callback) {
    const result = useGetData('accounts', 'GET', defaultUsers.map(({id, firstname, lastname}) => ({accountId: id, fname: firstname, lname: lastname})), callback).map(({accountId, lname, fname}) => ({id: accountId, firstname: fname, lastname: lname}));
    console.log(result);
    return result;
}

export function useGetProducts(callback) {
    return useGetData('products', 'GET', defaultProducts, callback);
}

export function getUserBalance(id) {
    return 20;
}

export function getLastBookings() {
    //do server 
    return defaultBookings;
}

export function commitBooking(id, booking) {
    // do server
}

export function addProduct(productName, productPrice) {
    // do server
}

export function removeProduct(product) {
    // do server
}

export function changeProduct(product, newProduct) {
    // do server
}

export function addUser(firstname, lastname, balance) {
    // do server
    doRequest('accounts', 'POST', {fname: firstname, lname: lastname, balance: balance});
}

export function removeUser(users) {
    // do server
}

export function changeUser(users, newUser) {
    // do server
}