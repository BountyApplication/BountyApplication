import {useState, useEffect} from 'react';
import {arraysEqual} from './Util';
import { defaultUsers, defaultProducts, defaultBookings, defaultBalance } from './DefaultData';

const updateRate = 6*1000;
const debug = false

function doRequest(topic, method, params, oldData, setData, defaultData) {
    fetch("http://127.0.0.1:5000/bounty/"+topic, {
        method: method,
        headers: params,
    })
    .then(response => response.json())
    .then(data => {
        if(method === 'PULL') return console.log(data);
        if(arraysEqual(data, oldData)) return;
        if(debug) console.log('new data: '); console.log(data);
        if(debug) console.log(`old data: `); console.log(oldData);
        if(setData!=null) setData(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        if(arraysEqual(defaultData, oldData)) return;
        if(setData!=null) setData(defaultData);
    })
}

function useGetData(topic, defaultData, callback = null, continues = true, method = 'GET', params = {}) {
    const [data, setData] = useState(null);

    useEffect(() => {
        doRequest(topic, method, params, data, setData, defaultData);
    }, []);

    useEffect(() => {
        if(!continues) return;

        if(debug) console.log('start loop');
        const updateLoop = setInterval(() => {
            doRequest(topic, method, {}, data, setData, defaultData);
        }, updateRate);

        if(callback != null) callback(data==null?defaultData:data);

        return () => {
            if(debug) console.log('stop loop');
            clearInterval(updateLoop);
        }
    }, [data]);

    if(data == null || data === undefined) return defaultData;

    return data;
}

export function useGetUsers(callback) {
    return useGetData('accounts', defaultUsers, callback);
}

export function useGetProducts(callback) {
    return useGetData('products', defaultProducts, callback);
}

export function useGetUserBalance(user) {
    if(user==null || user===undefined)
        user = {userId: -1};
    let account = useGetData('accounts/'+user.userId, [{balance: defaultBalance}]);
    if(user == null || user === undefined) return null;
    return account[0].balance;
}

export function useGetLastBookings(userId) {
    //do server
    let history = useGetData('history/'+userId, defaultBookings.map((booking) => ({...booking, products: JSON.stringify(booking.products)})), null, false).map((booking) => ({...booking, products: JSON.parse(booking.products)}));
    return history;
}

export function commitBooking(userId, booking) {
    // do server
    console.log({...booking, products: JSON.stringify(booking.products)});
    doRequest('accounts/'+userId, 'POST', {...booking, products: JSON.stringify(booking.products)}, null, (result) => {
        console.log(result); 
        if(result.balance!==booking.newBalance) {
            window.alert(`Error: No User selected!`);
            console.log("ERROR: false user balance");
        }
    });
}

export function addProduct(productName, productPrice) {
    // do server
    doRequest('products', 'POST', {name: productName, price: productPrice});
}

export function removeProduct(product) {
    // do server
    doRequest('products', 'PUT', {...product, active: 0});
}

export function changeProduct(product, newProduct) {
    // do server
    doRequest('products', 'PUT', newProduct);
}

export function addUser(firstname, lastname, balance) {
    // do server
    doRequest('accounts', 'POST', {firstname: firstname, lastname: lastname, balance: balance});
}

export function removeUser(user) {
    // do server
}

export function changeUser(user, newUser) {
    // do server
    doRequest('accounts/'+user.userId, 'PUT', newUser);
}