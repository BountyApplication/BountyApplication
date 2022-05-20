
export function getUsers() {
    // do server
    return [
        { id: 0, lastname: "Mauch", firstname: "Josua" },
        { id: 1, lastname: "Tappe", firstname: "Isajah" },
        { id: 2, lastname: "Braun", firstname: "Jonas" },
        { id: 3, lastname: "Strasser", firstname: "Marit" },
        { id: 4, lastname: "Pauli", firstname: "Lotta" },
        { id: 5, lastname: "Volmer", firstname: "Hannah" },
        { id: 6, lastname: "Schwarz", firstname: "Tim" },
        { id: 7, lastname: "Schreiber", firstname: "Jan" },
        { id: 8, lastname: "Günther", firstname: "William" },
        { id: 9, lastname: "Lee", firstname: "Cindy" },
        { id: 10, lastname: "Hopp", firstname: "Janice" },
        { id: 11, lastname: "Kuhn", firstname: "Maja" },
        { id: 12, lastname: "Wäscher", firstname: "Nele" },
        { id: 13, lastname: "Bürle", firstname: "Rahle" },
        { id: 14, lastname: "Mustermann", firstname: "Tim"},
        { id: 15, lastname: "Mustermann", firstname: "Fridolin"},
        { id: 16, lastname: "Maurer", firstname: "Jakob"},
    ];
}

export function getProducts() {
    // do sever
    let products = [
        { id: 2, name: "Loli", price: .5 },
        { id: 3, name: "Kracher", price: .1 },
        { id: 4, name: "Slush", price: .2 },
        { id: 5, name: "M&M", price: .3 },
        { id: 6, name: "Schlangen", price: .1 },
        { id: 7, name: "Snickers", price: .6 },
        { id: 8, name: "T-shirt", price: 15 },
        { id: 9, name: "Cappy", price: 8 },
        { id: 10, name: "CD", price: 10 },
        { id: 11, name: "Bibel", price: 20 },
        { id: 12, name: "Sprudel", price: 0.8 },
        { id: 13, name: "Apfelschorle", price: 1 },
        { id: 14, name: "Cola", price: 1.5 },
        { id: 15, name: "Reis", price: 2 },
        { id: 16, name: "ESP", price: 5 },
        { id: 17, name: "Bonbon", price: .05 },
        { id: 18, name: "Schokoriegel", price: .7},
    ];

    // add amount property
    products.forEach(product => product.amount = 0);

    return products;
}

export function getUserBalance(id) {
    return 20;
}

export function getLastBookings() {
    //do server 
    const bookings = [
        {id: 0, sum: -5.3, products: [{ name: 'Cola', price: 0.5, amount: 2 }, { name: 'Bonbon', price: 0.05, amount: 10 }]}, 
        {id: 1, sum: -0.83, correction: +2.1, products: [{ name: 'ESP', price: 5, amount: 10 }, { name: 'Slush', price: 0.20, amount: 3 }]},
        {id: 2, sum: -1.4, products: [{ name:'Bibel', price: 15, amount: 1 }, { name: 'T-shirt', price: 12, amount: 1 }, { name: 'Cola', price: 0.5, amount: 2 }, { name: 'Bonbon', price: 0.05, amount: 10 }]},
        {id: 3, sum: 5, products: [{ name: 'Cola', price: 0.5, amount: 2 }, { name: 'Bonbon', price: 0.05, amount: 10 }]},
    ];
    return bookings;
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
}

export function removeUser(user) {
    // do server
}

export function changeUser(user, newUser) {
    // do server
}