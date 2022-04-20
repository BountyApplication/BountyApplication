import React, {useState, useEffect} from 'react';

export default function UserSelect(props) {

    const [users, setUsers] = useState(getUsers());
    const [userFirstname, setUserFirstname] = useState("");
    const [userLastname, setUserLastname] = useState("");

    useEffect(() => {
      if(props.setResetCallback!=null)
        props.setResetCallback(()=>reset);
    }, []);


    useEffect(() => {
        if(userFirstname!==""&&userLastname!=="")
            run();
        else
            checkOptions();
    }, [userFirstname, userLastname]);

    function getUsers() {
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
            { id: "16", lastname: "Maurer", firstname: "Jakob"},
        ];
    }

    function updateName(isFirstname, name) {
        if(name === "")
            return reset();

        if(isFirstname)
            setUserFirstname(name);
        else
            setUserLastname(name);
    }

    function checkOptions() {
        if(getFilteredUsers().length > 1)
            return;

        if(userFirstname!=="" && userLastname==="")
            return setUserLastname(getFilteredUsers().find(user => {return user.firstname === userFirstname}).lastname);
        if(userFirstname==="" && userLastname!=="")
            return setUserFirstname(getFilteredUsers().find(user => {return user.lastname === userLastname}).firstname);
    }

    function getFilteredUsers() {
        return users.filter(({lastname, firstname}) => (userFirstname==="" || userFirstname===firstname) && (userLastname==="" || userLastname===lastname));
    }

    function run() {
        console.log(userFirstname+" "+userLastname);
        if(!props.useSubmit)
            submit();
    }

    function submit() {
        if(getFilteredUsers().length!==1) {
            console.log("Error: user selection ambiguous");
            window.alert("Error: user selection ambiguous");
            return;
        }

        if(props.run!=null)
            props.run(getFilteredUsers()[0]);

        if(props.resetSubmit)
            reset();
    }

    function reset() {
        setUserFirstname("");
        setUserLastname("");
        if(props.reset!=null)
            props.reset();
    }
    
    const filteredUsers = getFilteredUsers();
    return(
        <div className="rubric">
            <div className='title'>{props.title!=null?props.title:"Suchen"}</div>
            <div className='wrapper'>{"Vorname "}
            <select className="firstname" value={userFirstname} onChange={(event) => {updateName(true, event.target.value);}}>
                {<option value="">{userFirstname!==""?"delete":""}</option>}
                {filteredUsers.map(({id, firstname}) => { 
                    if(filteredUsers.findIndex(object => {return object.firstname === firstname}) === filteredUsers.findIndex(object => {return object.id === id}))
                        return <option key={id} value={firstname}>{firstname}</option>
                    return null;
                })}
            </select></div>
            <div className='wrapper'>{"Nachname "}
            <select className="lastname" value={userLastname} onChange={(event) => {updateName(false, event.target.value);}}>
                {<option value="">{userLastname!==""?"delete":""}</option>}
                {filteredUsers.map(({id, lastname}) => {
                    if(filteredUsers.findIndex(object => {return object.lastname === lastname}) === filteredUsers.findIndex(object => {return object.id === id}))
                        return <option key={id} value={lastname}>{lastname}</option>
                    return null;
                })}
            </select></div>
            {props.useReset&&(!props.hideReset||userFirstname!==""||userLastname!=="")&&<button className='wrapper' onClick={reset}>{"reset"}</button>}
            {props.useSubmit&&(!props.hideSubmit||filteredUsers.length<=1)&&<button className='wrapper' onClick={submit}>{"submit"}</button>}
        </div>
    );
}