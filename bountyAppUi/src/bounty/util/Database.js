import {useState, useEffect} from 'react';
import {arraysEqual} from './Util';
import { defaultUsers, defaultProducts, defaultBookings } from './DefaultData';

const updateRate = 6*1000;

function doRequest(topic, method, params, oldData, setData, defaultData) {
    fetch("http://127.0.0.1:5000/bounty/"+topic, {
        method: method,
        headers: params,
    })
    .then(response => response.json())
    .then(data => {
        if(method === 'PULL') return console.log(data);
        if(arraysEqual(data, oldData)) return;
        // console.log('new data: '); console.log(data);
        // console.log(`old data: `); console.log(oldData);
        if(setData!=null) setData(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        if(arraysEqual(defaultData, oldData)) return;
        if(setData!=null) setData(defaultData);
    })
}

function useGetData(topic, method, defaultData, callback = null, continues = true) {
    const [data, setData] = useState(null);

    useEffect(() => {
        doRequest(topic, method, {}, data, setData, defaultData);
    }, []);

    useEffect(() => {
        if(!continues) return;

        // console.log('start loop');
        const updateLoop = setInterval(() => {
            doRequest(topic, method, {}, data, setData, defaultData);
        }, updateRate);

        if(callback != null) callback(data==null?defaultData:data);

        return () => {
            // console.log('stop loop');
            clearInterval(updateLoop);
        }
    }, [data]);

    if(data == null || data === undefined) return defaultData;

    return data;
}

export function useGetUsers(callback) {
    return useGetData('accounts', 'GET', defaultUsers.map(({id, firstname, lastname}) => ({accountId: id, fname: firstname, lname: lastname})), callback).map(({accountId, lname, fname}) => ({id: accountId, firstname: fname, lastname: lname}));
}

export function useGetProducts(callback) {
    return useGetData('products', 'GET', defaultProducts, callback);
}

export function getUserBalance(id) {
    return 20;
}

export function useGetLastBookings(id) {
    //do server
    return useGetData('accounts/'+id, 'GET', defaultBookings, null, false);
}

export function commitBooking(id, booking) {
    // do server
    doRequest('accounts/'+id, 'POST', booking);
}

export function addProduct(productName, productPrice) {
    // do server
    doRequest('products', 'POST', {name: productName, price: productPrice});
}

export function removeProduct(product) {
    // do server
}

export function changeProduct(product, {id, name, price}) {
    // do server
    doRequest('products', 'PUT', {id: id, name: name, price: price});
}

export function addUser(firstname, lastname, balance) {
    // do server
    doRequest('accounts', 'POST', {fname: firstname, lname: lastname, balance: balance});
}

export function removeUser(user) {
    // do server
}

export function changeUser(user, {id, firstname, lastname}) {
    // do server
    doRequest('accounts/'+id, 'PUT', {fname: firstname, lname: lastname});
}