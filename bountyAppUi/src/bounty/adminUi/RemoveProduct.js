// import '../App.css';
import React from 'react';
import ProductSelect from '../adminUi/ProductSelect';

export default class RemoveProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    run(product) {
        console.log(product);
        // do server
    }

    render() {
        return(
            <div className='RemoveProduct'>
                <p>{"Remove Product"}</p>
                <ProductSelect run={this.run.bind(this)} useReset={true} useSubmit={true} resetSubmit={true} />
            </div>
        );
    }
}