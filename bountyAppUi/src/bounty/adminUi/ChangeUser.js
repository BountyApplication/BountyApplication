import React, { useState, useEffect } from 'react';
import UserSelect from '../util/UserSelect';
import NumberInput from '../util/NumberInput';
import { changeUser, getUserBalance } from '../util/Database';

export default function ChangeUser(props) {
    // vars
    const [user, setUser] = useState(null);
    const [newUser, setNewUser] = useState(null);
    const [balance, setBalance] = useState(null);
    const [newBalance, setNewBalance] = useState(null);

    const [resetCallback, setResetCallback] = useState(null);

    useEffect(() => {
        if(!user) return;
        let b = getUserBalance(user);
        console.log(`${user.firstname} ${user.lastname} (${b}€)`);

        setNewUser(user);
        setBalance(b);
        setNewBalance(b);
    }, [user]);

    function resetAll() {
        setUser(null);
        setNewUser(null);
        setBalance(null);
        setNewBalance(null);
    }
    
    function reset() {
        setNewUser(user);
        setNewBalance(balance);
    }

    function submit() {
        if(user===newUser && balance===newBalance) {
            console.log("nothing changed");
            window.alert("Nothing changed");
            return;
        }
        if(newUser.firstname==="" || newUser.lastname==="" || newBalance==null) {
            console.log("Error no valid entries");
            window.alert("Error: No valid entries");
            return;
        }
        if(window.confirm(`Change ${user.firstname} ${user.lastname} (${balance}€) to ${newUser.firstname} ${newUser.lastname} (${newBalance}€) ?`)) {
            console.log(`Change ${user} to ${newUser}`);
            changeUser(user, newUser);

            if(resetCallback)
                resetCallback();
        }
    }

    function changeUserUi() {
        return(
            <div>
                <div className='wrapper'>{"Vorname: "} <input value={newUser.firstname} onChange={event => setNewUser({...newUser, firstname: event.target.value})} /></div>
                <div className='wrapper'>{"Nachname: "} <input value={newUser.lastname} onChange={event => setNewUser({...newUser, lastname: event.target.value})} /></div>
                <div className='wrapper'>{"Kontostand: "} <NumberInput value={newBalance} setValue={setNewBalance} /></div>
                {(newUser!==user || balance!==newBalance) && <button className='wrapper' onClick={reset}>{"reset"}</button>}
                {(newUser!==user || balance!==newBalance) && <button className='wrapper' onClick={submit}>{"submit"}</button>}
            </div>
        );
    }

    return(
        <div className='rubric'>
            <div className='title'>{"Change User"}</div>
            <UserSelect runCallback={setUser} resetCallback={resetAll} setResetCallback={setResetCallback} useReset={true} hideReset={true}/>
            {newUser && changeUserUi()}
        </div>
    );
}