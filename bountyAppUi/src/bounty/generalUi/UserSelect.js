// import '../App.css';
import React from 'react';

// export default function UserSelect() {
//     const [userFirstname, setUserFirstname] = useState("");
// 	const [userLastname, setUserLastname] = useState("");
//     const [users, setUsers] = useState([
//         { id: "0", lastname: "Mauch", firstname: "Josua" },
//         { id: "1", lastname: "Tappe", firstname: "Isajah" },
//         { id: "2", lastname: "Braun", firstname: "Jonas" },
//         { id: "3", lastname: "Strasser", firstname: "Marit" },
//         { id: "4", lastname: "Pauli", firstname: "Lotta" },
//         { id: "5", lastname: "Volmer", firstname: "Hannah" },
//         { id: "6", lastname: "Schwarz", firstname: "Tim" },
//         { id: "7", lastname: "Schreiber", firstname: "Jan" },
//         { id: "8", lastname: "Günther", firstname: "William" },
//         { id: "9", lastname: "Mustermann", firstname: "Tim"},
//         { id: "10", lastname: "Mustermann", firstname: "Fridolin"},
//     ])

//     useEffect(() => {checkOptions();});

//     const filteredUsers = getFilteredUsers();
    
//      return(
//         <div className="UserSelect">
//             <select className="firstname" value={userFirstname} onChange={(event) => {updateName(true, event.target.value);}}>
//                 {<option value="">{userFirstname!==""?"delete":""}</option>}
//                 {users.map(({id, lastname, firstname}) => { 
//                     if(users.findIndex(object => {return object.firstname === firstname}) === users.findIndex(object => {return object.id === id}))
//                         return <option key={id} value={firstname}>{firstname}</option>
//                 })}
//             </select>
//             <select className="lastname" value={userLastname} onChange={(event) => {updateName(false, event.target.value);}}>
//                 {<option value="">{userLastname!==""?"delete":""}</option>}
//                 {users.map(({id, lastname, firstname}) => {
//                     if(users.findIndex(object => {return object.lastname === lastname}) === users.findIndex(object => {return object.id === id}))
//                         return <option key={id} value={lastname}>{lastname}</option>
//                 })}
//             </select>
//         </div>
//     );

//     function updateName(isFirstname, name) {
//         if(name === "") {
//             if(isFirstname && userFirstname!=="")
//                 setUserLastname(name);
//             else if(!isFirstname && userLastname!=="")
//                 setUserFirstname(name);
//         }
//         if(isFirstname)
//             setUserFirstname(name);
//         else
//             setUserLastname(name);
//     }

//     function checkOptions() {
//         console.log("tedfst");
//         if(getFilteredUsers().length <= 1) {
//             if(userFirstname!=="" && userLastname==="")
//                 setUserLastname(getFilteredUsers().find(user => {return user.firstname === userFirstname}).lastname, run);
//             else if(userFirstname==="" && userLastname!=="")
//                 setUserFirstname(getFilteredUsers().find(user => {return user.lastname === userLastname}).firstname, run);
//         } else
//             console.log(userFirstname+"_"+userLastname);
//     }

//     function getFilteredUsers() {
//         return users.filter(({id, lastname, firstname}) => {return (userFirstname === "" || userFirstname === firstname) && (userLastname === "" || userLastname === lastname)});
//     }

//     function run() {
//         console.log(userFirstname+"_"+userLastname);
//     }

// }

export default class UserSelect extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            users: this.getUsers(),
            userFirstname: "",
            userLastname: "",
        }
    }

    getUsers() {
        // do server
        return [
            { id: "0", lastname: "Mauch", firstname: "Josua" },
            { id: "1", lastname: "Tappe", firstname: "Isajah" },
            { id: "2", lastname: "Braun", firstname: "Jonas" },
            { id: "3", lastname: "Strasser", firstname: "Marit" },
            { id: "4", lastname: "Pauli", firstname: "Lotta" },
            { id: "5", lastname: "Volmer", firstname: "Hannah" },
            { id: "6", lastname: "Schwarz", firstname: "Tim" },
            { id: "7", lastname: "Schreiber", firstname: "Jan" },
            { id: "8", lastname: "Günther", firstname: "William" },
            { id: "9", lastname: "Lee", firstname: "Cindy" },
            { id: "10", lastname: "Hopp", firstname: "Janice" },
            { id: "11", lastname: "Kuhn", firstname: "Maja" },
            { id: "12", lastname: "Wäscher", firstname: "Nele" },
            { id: "13", lastname: "Bürle", firstname: "Rahle" },
            { id: "14", lastname: "Mustermann", firstname: "Tim"},
            { id: "15", lastname: "Mustermann", firstname: "Fridolin"},
        ];
    }

    updateName(isFirstname, name) {
        if(name === "") {
            this.props.reset();
            return;
        }
        if(isFirstname)
            this.props.setUserFirstname(name, this.checkOptions.bind(this));
        else
            this.props.setUserLastname(name, this.checkOptions.bind(this));
    }

    checkOptions() {
        if(this.getFilteredUsers().length <= 1) {
            if(this.props.userFirstname!=="" && this.props.userLastname==="")
                this.props.setUserLastname(this.getFilteredUsers().find(user => {return user.firstname === this.props.userFirstname}).lastname, this.run.bind(this));
            else if(this.props.userFirstname==="" && this.props.userLastname!=="")
                this.props.setUserFirstname(this.getFilteredUsers().find(user => {return user.lastname === this.props.userLastname}).firstname, this.run.bind(this));
            else if(this.props.userFirstname!=="" && this.props.userLastname!=="")
                this.run();
        }
    }

    getFilteredUsers() {
        return this.state.users.filter(({id, lastname, firstname}) => {return (this.props.userFirstname === "" || this.props.userFirstname === firstname) && (this.props.userLastname === "" || this.props.userLastname === lastname)});
    }

    run() {
        console.log(this.props.userFirstname+" "+this.props.userLastname);
        this.props.setUserId(this.getFilteredUsers().length==1?this.getFilteredUsers()[0].id:-1);
    }

    render() {
        const users = this.getFilteredUsers();
        return(
            <div className="UserSelect">
                <select className="firstname" value={this.props.userFirstname} onChange={(event) => {this.updateName(true, event.target.value);}}>
                    {<option value="">{this.props.userFirstname!==""?"delete":""}</option>}
                    {users.map(({id, lastname, firstname}) => { 
                        if(users.findIndex(object => {return object.firstname === firstname}) === users.findIndex(object => {return object.id === id}))
                            return <option key={id} value={firstname}>{firstname}</option>
                    })}
                </select>
                <select className="lastname" value={this.props.userLastname} onChange={(event) => {this.updateName(false, event.target.value);}}>
                    {<option value="">{this.props.userLastname!==""?"delete":""}</option>}
                    {users.map(({id, lastname, firstname}) => {
                        if(users.findIndex(object => {return object.lastname === lastname}) === users.findIndex(object => {return object.id === id}))
                            return <option key={id} value={lastname}>{lastname}</option>
                    })}
                </select>
            </div>
        );
    }
}