// import '../App.css';
import React from 'react';

export default class ProductSelect extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            products: this.getProducts(),
            selectedProduct: {id: -1, name: "", price: null}
        }

        if(this.props.setResetCallback!=null)
            this.props.setResetCallback(this.reset.bind(this));
    }

    getProducts() {
        // do sever
        return [
            { id: 0, name: "Bonbon", price: .05 },
            { id: 1, name: "Schokoriegel", price: .7 },
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
        ];
    }

    updateProduct(id) {
        if(id!==-1)
            this.setState({selectedProduct: this.state.products.find(product=>{return product.id===id})}, this.props.useSubmit?null:this.submit.bind(this));
        else
            this.reset();
    }

    reset() {
        this.setState({selectedProduct: {id: -1, name: "", price: null}})
        if(this.props.reset)
            this.props.reset();
    }

    submit() {
        if(this.state.selectedProduct.id===-1)
            return;
        if(this.props.run!=null)
            this.props.run(this.state.selectedProduct);
        if(this.props.resetSubmit)
            this.reset();
    }

    render() {
        return(
            <div className="ProductSelect">
                {"select product: "}
                <select value={this.state.selectedProduct.id} onChange={(event) => {this.updateProduct(parseInt(event.target.value));}}>
                    {<option value={-1}>{""}</option>}
                    {this.state.products.map(({id, name, price}) => { 
                        return <option key={id} value={id}>{name+" ("+price.toFixed(2)+"€)"}</option>
                    })}
                </select>
                {this.props.useReset?<button className='reset' onClick={this.reset.bind(this)}>{"reset"}</button>:null}
                {this.props.useSubmit?<button className='submit' onClick={this.submit.bind(this)}>{"submit"}</button>:null}
            </div>
        );
    }
}