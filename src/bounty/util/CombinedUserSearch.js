import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import { useGetUsers, getUserByCardId, changeUser } from './Database';
import { Modal, Collapse, Button, ListGroup } from 'react-bootstrap';
import Input from './Input';
import { useKeyPress } from './Util';

const debug = true;
const autoSelection = true;
const useBarcode = process.env.REACT_APP_ENABLE_BARCODE === "true";
// const barcodeTimeout = 1000;

UserSelect.prototype = {
    title: PropTypes.string,
    submitDescription: PropTypes.string,
    show: PropTypes.bool,
    inModal: PropTypes.bool,

    // callbacks
    setShow: PropTypes.func,
    runCallback: PropTypes.func,
    resetCallback: PropTypes.func,
    setResetCallback: PropTypes.func,

    // settings
    useReset: PropTypes.bool,
    useSubmit: PropTypes.bool,

    hideUserList: PropTypes.bool,
    hideReset: PropTypes.bool,
    hideSubmit: PropTypes.bool,

    onlyActive: PropTypes.bool,

    theme: PropTypes.string,
    toggleTheme: PropTypes.func,
    onOpenAdmin: PropTypes.func,

    disabled: PropTypes.bool,
};

UserSelect.defaultProps = {
    title: "Suchen",
    submitDescription: "Bestätigen",
    show: false,
    inModal: false,

    useReset: false,
    useSubmit: false,

    hideUserList: false,
    hideReset: false,
    hideSubmit: false,

    onlyActive: true,

    disabled: false,
};

function UserSelect({products, setProducts, inModal, show, title, setShow, runCallback, resetCallback, setResetCallback, useReset, useSubmit, hideUserList, hideReset, hideSubmit, submitDescription, onlyActive, theme, toggleTheme, onOpenAdmin, disabled}) {
    // vars
    const [input, setInput] = useState("");
    const [idInput, setIdInput] = useState(null);
    const users = useGetUsers(null, onlyActive);
    const [user, setUser] = useState(null);
    const [barcode, setBarcode] = useState('');

    // temp var for easier access
    const hasCode = !isNaN(parseInt(input));
    const hasInput = input !== '' && !hasCode;
    const hasBarcode = useBarcode && (barcode.length === 4 && !isNaN(parseInt(barcode)));
    const filteredUsers = getFilteredUsers();
    const [focus, setFocus] = useState(true);
    const selectedRow = useRef(null);

    useKeyPress('Enter', () => {
        if(disabled) return;
        if(inModal && !show) return;
        if(hasBarcode) return;
        submit();
    });

    useKeyPress('Delete', () => {
        if(disabled) return;
        reset();
    });

    useKeyPress('Escape', () => {
        if(disabled) return;
        if(!show) return;
        // if(user!=null) return reset();
        if(setShow!=null) setShow(false);
    });

    useKeyPress('a', () => {
        if(disabled) return;
        if(setShow!=null) setShow(true);
    })

    useKeyPress('ArrowDown', () => moveSelection(1));
    useKeyPress('ArrowUp', () => moveSelection(-1));

    // moves selection through the currently displayed list
    function moveSelection(direction) {
        if(disabled) return;
        if(inModal && !show) return;
        const sortedUsers = getSortedUsers();
        if(sortedUsers.length === 0) return;

        const index = user == null ? -1 : sortedUsers.findIndex(({userId}) => userId === user.userId);
        if(index === -1) return setUser(direction > 0 ? sortedUsers[0] : sortedUsers[sortedUsers.length-1]);

        const next = Math.min(Math.max(index + direction, 0), sortedUsers.length-1);
        setUser(sortedUsers[next]);
    }

    // keeps the selected entry visible while navigating
    useEffect(() => {
        if(selectedRow.current == null) return;
        selectedRow.current.scrollIntoView({block: 'nearest'});
    }, [user]);
    
    useEffect(() => {
        if(!useBarcode) return;
        document.addEventListener("keydown", checkedCodeReceived, false);
        
        // if(hasBarcode) setTimeout(()=>{setBarcode('')}, 500);
        setTimeout(()=>{setBarcode('')}, 500);

        return (() => {
            document.removeEventListener("keydown", checkedCodeReceived, false);
        });

    }, [barcode])
    
    function checkedCodeReceived(event) {
        console.log(barcode);
        switch(event.key) {
            // setTimeout(()=>setBarcode(''), barcodeTimeout); 
            // case 'K': if(barcode!=='') return; break;
            // case 'C': if(barcode!=='K') return; break;
            // case '2': if(barcode.substring(0,2) !== 'KC') return; break;
            // case 'ß': if(barcode!=='KC22') return; break;
            // case 'Enter': if(barcode.substring(0,5) !== 'KC22ß' || barcode.length < 8) return; console.log(" Barcode: "); console.log(barcode); setIdInput(parseInt(barcode.substring(5, 8))); break;
            case 'Enter': if(barcode.length < 4) return;
                if(barcode.length > 4) {
                    if(barcode.includes('ein slush eis bitte') && user != null) {
                        console.log("Gratis Slush!!");
                        const freeSlushProduct = products.find(product => product.name === "Gratis Slush");
                        if(!freeSlushProduct) return;
                        const updatedProduct = { ...freeSlushProduct, amount: freeSlushProduct.amount + 1};
                        const updatedProducts = products.map(product => product.productId === freeSlushProduct.productId ? updatedProduct : product)
                        setProducts(updatedProducts);
                    }
                    setBarcode('');
                    return;
                }
                console.log("Barcode: "); console.log(barcode); setIdInput(parseInt(barcode)); break;
            default: setBarcode(barcode+event.key); break;
        }
        // event.preventDefault();
    }
    
    // set callback on beginning
    useEffect(() => {
      if(setResetCallback) setResetCallback(()=>reset.bind(this, false));
    }, [setResetCallback]);

    useEffect(() => {
        if(!autoSelection) return;
        if(filteredUsers.length === 1) setUser(filteredUsers[0]);
    }, [filteredUsers])

    // runs if user selected
    useEffect(() => {
        if(user == null) return;
        if(useBarcode && idInput != null) {
            if(user.cardId === idInput) {
                setIdInput(null);
                run();
                return;
            }
            if(users.some(({cardId}) => cardId === idInput)) {
                window.alert("ERROR: Code already given");
                setIdInput(null);
                return;
            }
            if(user.cardId != null) window.alert(`Warning: User already assigned to [${('0000' + user.cardId).substr(-4)}]`);
            var newUser = user;
            user.cardId = idInput;
            changeUser(newUser);
            setIdInput(null);
        }
        //  else setIdInput(user.cardId)
        run();
    }, [user, idInput, users]);

    // Code Input
    useEffect(() => {
        if(!useBarcode) return;
        // if(input.length < 3 && user==null) return setIdInput(null);
        if(input === '') return;
        let code = parseInt(input);
        if(isNaN(code)) return;
        if(input.length < 3) return;
        console.log(code);
        if(input.length > 3) return setInput(input.substr(-3));
        setIdInput(code);
        if(user!=null) setUser(null);
        setInput('');
        resetFocus();
    }, [input, user]);

    useEffect(() => {
        if(idInput == null) return;
        if(user != null && !show) return;
        // if(idInput%10 === 0) return;
        // if(Math.floor(idInput%100/10) === 0) return;
        // if(Math.floor(idInput/100) === 0) return;
        getUserByCardId(idInput, (result) => {
            if(Array.isArray(result)) {
                if(result.length === 0) console.log('Code not assigned'); //window.alert('Code unbekannt! Bitte wähle den dazugehörigen Kunde aus');
                if(result.length > 1) window.alert('more than one users with same code');
                if(!show && inModal) return reset();
                return resetFocus();
            }
            setInput('');
            if(!result.active) {
                setIdInput(null);
                return window.alert('Dieser Kunde ist deaktiviert');
            }

            setUser(result);
        });

    }, [idInput, inModal, show, user]);

    useEffect(() => {
        if(show) return;
        if(input === '') return;
        setInput('');
    }, [show]);

    function updateInput(newInput) {
        if(input === '' && newInput !== '') reset(true);
        setInput(newInput);
    }

    // filters for current selection (firstname or lastname)
    function getFilteredUsers() {
        return users.filter(({lastname, firstname}) => checkUser(firstname, lastname));
    }

    function checkUser(firstname, lastname) {
        if(!hasInput) return true;
        let hasFirstname = checkName(firstname);
        let hasLastname = checkName(lastname);
        let inputsCount = input.split(' ').filter(input => input !== '').length;
        if(inputsCount > 1) return hasFirstname && hasLastname
        return hasFirstname || hasLastname;
    }
    
    function checkName(name) {
        if(!hasInput) return true;
        return input.toLocaleLowerCase().split(" ").some(v => v!=='' && name.toLocaleLowerCase().includes(v));
    }

    // sortes user selection alphabetically
    function getSortedUsers() {
        let lastnameSelected = filteredUsers.some(({lastname}) => checkName(lastname));
        return filteredUsers.sort((user1, user2) => compareNames(lastnameSelected?user1.firstname:user1.lastname, lastnameSelected?user2.firstname:user2.lastname));
    }

    // compares alphabetic order of two names
    function compareNames(name1, name2) {
        return name1.toLowerCase().localeCompare(name2.toLowerCase());
    }

    // executed when selection complete
    function run() {
        if(debug) console.log(`${user.firstname} ${user.lastname} [${user.cardId}]`);
        
        // auto submit if no submit button
        if(!useSubmit || barcode) submit();
    }

    function submit() {
        // checks if result valid
        if(user == null) {
            // console.log(`Error: No User selected!`);
            // window.alert(`Error: No User selected!`);
            setUser(filteredUsers[0]);
            return;
        }

        if(setShow!=null) setShow(false);

        if(runCallback != null) runCallback(user);
    }

    function resetFocus() {
        setFocus(false);
        setTimeout(()=>{
            setFocus(true);
        }, 1);
    }

    function reset(keepInput = false) {
        if(!keepInput) {
            setIdInput(null);
            setInput("");
            resetFocus();
        }
        setUser(null);
        if(resetCallback != null) resetCallback();
    }

    function displayUsers() {
        return <div className='user-list mt-3'>
            <ListGroup variant='flush'>
                {getSortedUsers().map(listedUser => {
                    const isSelected = user != null && user.userId === listedUser.userId;
                    return <ListGroup.Item
                        key={listedUser.userId}
                        ref={isSelected?selectedRow:null}
                        onClick={setUser.bind(this, listedUser)}
                        className={`user-row${isSelected?' user-selected':''}${listedUser.active!==1?' user-inactive':''}`}
                    >
                        <span className='user-avatar'>{initials(listedUser)}</span>
                        <span className='user-name'>{listedUser.firstname} {listedUser.lastname}</span>
                    </ListGroup.Item>
                })}
            </ListGroup>
        </div>
    }

    function initials({firstname, lastname}) {
        return `${firstname?.charAt(0) ?? ''}${lastname?.charAt(0) ?? ''}`;
    }

    function searchUi() {
        return <div>
            <Input value={input} setValue={updateInput} title={title} isFocused={focus&&(!inModal||show)} />
            {/* <p className='mb-1'>or</p>
            <div className='mb-2'>
                <p className='d-inline fs-4 me-2'>Code:</p>
                <Input className='d-inline' type='id' value={Math.floor(idInput/100)} setValue={(n) => setIdInput(n%10*100+idInput%100)}/>
                <Input className='d-inline' type='id' value={Math.floor(idInput%100/10)} setValue={(n) => setIdInput(n%10*10+Math.floor(idInput/100)*100+idInput%10)}/>
                <Input className='d-inline' type='id' value={idInput%10} setValue={(n) => setIdInput(n%10+Math.floor(idInput/10)*10)}/>
            </div> */}
        </div>
    }

    
    function displayUi() {
        return <div>
            {useBarcode&&<div className='ms-1'><p className='fs-4 d-inline'>Code: </p><p className='fs-4 d-inline fw-bold'>{user!=null?user.cardId==null?'nicht hinzugefügt':('0000' + user.cardId).substr(-4):('0000' + idInput).substr(-4)}</p></div>}
        </div>
    }

    function inputSection() {
        return <>
            <Collapse in={true}>{searchUi()}</Collapse>
            <Collapse in={user != null || idInput != null}>{displayUi()}</Collapse>
            <Collapse in={user == null || (hasInput && filteredUsers.length>1) || !hideUserList}>{displayUsers()}</Collapse>
        </>
    }

    function buttons() {
        return <>
            <Collapse in={useReset  && (!hideReset  || hasInput || user != null)}>
                <Button className='mx-0 ms-2' variant="secondary" type="reset" onClick={reset.bind(this, false)}>Zurücksetzten</Button>
            </Collapse>
            <Collapse in={useSubmit && (!hideSubmit || hasInput || user != null)}>
                <Button className='mx-0 ms-2' variant="primary" type="submit" onClick={submit}>{submitDescription}</Button>
            </Collapse>
        </>
    }
    
    if(!inModal) return (
        <>
            {inputSection()}
            <div className='d-flex justify-content-end mt-2'>
                {buttons()}
            </div>
        </>
    );
    
    return(
        <Modal show={show}>
            <Modal.Header closeButton onClick={setShow!=null?setShow.bind(this, false):()=>{}}>
                <Modal.Title className='fs-2'>Kunden Auswahl</Modal.Title>
                {(toggleTheme != null || onOpenAdmin != null) &&
                    <div className='d-flex gap-2 ms-auto me-2'>
                        {toggleTheme != null &&
                            <button
                                type='button'
                                className='icon-btn'
                                onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                                title={theme === 'light-theme' ? 'Dunkles Design' : 'Helles Design'}
                            >
                                <i className={`bi ${theme === 'light-theme' ? 'bi-moon-stars' : 'bi-sun'}`} />
                            </button>
                        }
                        {onOpenAdmin != null &&
                            <button
                                type='button'
                                className='icon-btn'
                                onClick={(e) => { e.stopPropagation(); onOpenAdmin(); }}
                                title='Verwaltung'
                            >
                                <i className='bi bi-gear' />
                            </button>
                        }
                    </div>
                }
            </Modal.Header>

            <Modal.Body>
                {inputSection()}
            </Modal.Body>

            <Modal.Footer>
                {buttons()}
            </Modal.Footer>
        </Modal>
    );
}

export default UserSelect;
