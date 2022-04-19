// import '../App.css';
import React from 'react';
import ProductSelect from '../util/ProductSelect';

export default class RemoveProduct extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }

    run(product) {
        if(window.confirm("Remove Product "+product.name+" ("+product.price+"€) ?")) {
            console.log(product);
            // do server
        }
    }

    render() {
        return(
            <div className='rubric'>
                <div className='title'>{"Remove Product"}</div>
                <ProductSelect run={this.run.bind(this)} useReset={true} useSubmit={true} resetSubmit={true} hideReset={true} hideSubmit={true} />
            </div>
        );
    }
}