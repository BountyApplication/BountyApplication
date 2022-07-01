export const defaultUsers = [
    { userId: 0, lastname: "Mauch", firstname: "Josua" },
    { userId: 1, lastname: "Tappe", firstname: "Isajah" },
    { userId: 2, lastname: "Braun", firstname: "Jonas" },
    { userId: 3, lastname: "Strasser", firstname: "Marit" },
    { userId: 4, lastname: "Pauli", firstname: "Lotta" },
    { userId: 5, lastname: "Volmer", firstname: "Hannah" },
    { userId: 6, lastname: "Schwarz", firstname: "Tim" },
    { userId: 7, lastname: "Schreiber", firstname: "Jan" },
    { userId: 8, lastname: "Günther", firstname: "William" },
    { userId: 9, lastname: "Lee", firstname: "Cindy" },
    { userId: 10, lastname: "Hopp", firstname: "Janice" },
    { userId: 11, lastname: "Kuhn", firstname: "Maja" },
    { userId: 12, lastname: "Wäscher", firstname: "Nele" },
    { userId: 13, lastname: "Bürle", firstname: "Rahle" },
    { userId: 14, lastname: "Mustermann", firstname: "Tim"},
    { userId: 15, lastname: "Mustermann", firstname: "Fridolin"},
    { userId: 16, lastname: "Maurer", firstname: "Jakob"},
];

export const defaultProducts = [
    { productId: 2, name: "Loli", price: .5 },
    { productId: 3, name: "Kracher", price: .1 },
    { productId: 4, name: "Slush", price: .2 },
    { productId: 5, name: "M&M", price: .3 },
    { productId: 6, name: "Schlangen", price: .1 },
    { productId: 7, name: "Snickers", price: .6 },
    { productId: 8, name: "T-shirt", price: 15 },
    { productId: 9, name: "Cappy", price: 8 },
    { productId: 10, name: "CD", price: 10 },
    { productId: 11, name: "Bibel", price: 20 },
    { productId: 12, name: "Sprudel", price: 0.8 },
    { productId: 13, name: "Apfelschorle", price: 1 },
    { productId: 14, name: "Cola", price: 1.5 },
    { productId: 15, name: "Reis", price: 2 },
    { productId: 16, name: "ESP", price: 5 },
    { productId: 17, name: "Bonbon", price: .05 },
    { productId: 18, name: "Schokoriegel", price: .7},
    { productId: 19, name: "Loli", price: .5 },
    { productId: 20, name: "Kracher", price: .1 },
    { productId: 21, name: "Slush", price: .2 },
    { productId: 22, name: "M&M", price: .3 },
    { productId: 23, name: "Schlangen", price: .1 },
    { productId: 24, name: "Snickers", price: .6 },
    { productId: 25, name: "T-shirt", price: 15 },
    { productId: 26, name: "Cappy", price: 8 },
    { productId: 27, name: "CD", price: 10 },
    { productId: 28, name: "Bibel", price: 20 },
    { productId: 29, name: "Sprudel", price: 0.8 },
    { productId: 30, name: "Apfelschorle", price: 1 },
    { productId: 32, name: "Cola", price: 1.5 },
    { productId: 33, name: "Reis", price: 2 },
    { productId: 34, name: "ESP", price: 5 },
    { productId: 35, name: "Bonbon", price: .05 },
    { productId: 36, name: "Schokoriegel", price: .7},
];

export const defaultBookings = [
    {bookingId: 0, productSum: -5.3, products: [{ productId: '0', name: 'Cola', price: 0.5, amount: 2 }, { productId: '1', name: 'Bonbon', price: 0.05, amount: 10 }]}, 
    {bookingId: 1, productSum: -0.83, correction: +2.1, products: [{ productId: '3', name: 'ESP', price: 5, amount: 10 }, { productId: '2', name: 'Slush', price: 0.20, amount: 3 }]},
    {bookingId: 2, productSum: -1.4, products: [{ productId: '5', name:'Bibel', price: 15, amount: 1 }, { productId: '6', name: 'T-shirt', price: 12, amount: 1 }, { productId: '0', name: 'Cola', price: 0.5, amount: 2 }, { productId: '1', name: 'Bonbon', price: 0.05, amount: 10 }]},
    {bookingId: 3, productSum: 5, products: [{ productId: '0', name: 'Cola', price: 0.5, amount: 2 }, { productId: '1', mame: 'Bonbon', price: 0.05, amount: 10 }]},
];

export const defaultBalance = 20;