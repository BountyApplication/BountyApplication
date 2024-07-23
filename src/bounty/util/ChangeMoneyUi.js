import React from 'react';
import { Card } from 'react-bootstrap';
import { useGetUsers } from './Database';
import RowText from './RowText';
import {toCurrency} from './Util';

export default function ChangeMoneyUi() {
    const users = useGetUsers();

    var total = 0;
    var _50 = 0;
    var _20 = 0;
    var _10 = 0;
    var _5 = 0;
    var _2 = 0;
    var _1 = 0;
    var _050 = 0;
    var _020 = 0;
    var _010 = 0;
    var _005 = 0;
    var _002 = 0;
    var _001 = 0;

    users.forEach(({balance}) => {
        total += balance;
        
        _50 += Math.floor(balance/50);
        balance -= Math.floor(balance/50)*50;

        _20 += Math.floor(balance/20);
        balance -= Math.floor(balance/20)*20;
        
        _10 += Math.floor(balance/10);
        balance -= Math.floor(balance/10)*10;
        
        _5 += Math.floor(balance/5);
        balance -= Math.floor(balance/5)*5;

        _2 += Math.floor(balance/2);
        balance -= Math.floor(balance/2)*2;

        _1 += Math.floor(balance/1);
        balance -= Math.floor(balance/1)*1;

        balance = Math.round(balance*100);

        _050 += Math.floor(balance/50);
        balance -= Math.floor(balance/50)*50;

        _020 += Math.floor(balance/20);
        balance -= Math.floor(balance/20)*20;

        _010 += Math.floor(balance/10);
        balance -= Math.floor(balance/10)*10;

        _005 += Math.floor(balance/5);
        balance -= Math.floor(balance/5)*5;

        _002 += Math.floor(balance/2);
        balance -= Math.floor(balance/2)*2;

        _001 += Math.floor(balance/1);
        balance -= Math.floor(balance/1)*1;
       
        if(balance !== 0) window.alert(`Error calculating balance! ${balance}ct left over`);


    });

    const ref = React.createRef();
    
    return (
        <div className='d-flex justify-content-evenly mt-5'>
            <Card className='w-25'>
                <Card.Header>
                    <Card.Title>Wechselgeld</Card.Title>
                </Card.Header>
                <Card.Body >
                    <RowText className='fw-bold' ref={ref} left={'Total:'} right={toCurrency(total)} />
                    <RowText ref={ref} left={'50€:'} right={_50} />
                    <RowText ref={ref} left={'20€:'} right={_20} />
                    <RowText ref={ref} left={'10€:'} right={_10} />
                    <RowText ref={ref} left={'5€:'} right={_5} />
                    <RowText ref={ref} left={'2€:'} right={_2} />
                    <RowText ref={ref} left={'1€:'} right={_1} />
                    <RowText ref={ref} left={'50ct:'} right={_050} />
                    <RowText ref={ref} left={'20ct:'} right={_020} />
                    <RowText ref={ref} left={'10ct:'} right={_010} />
                    <RowText ref={ref} left={'5ct:'} right={_005} />
                    <RowText ref={ref} left={'2ct:'} right={_002} />
                    <RowText ref={ref} left={'1ct:'} right={_001} />
                </Card.Body>
            </Card>
        </div>
    );
}