import React, {useState, useEffect} from 'react';

export default function ProductSelect(props) {
    const [products, setProducts] = useState(getProducts);
    const [selectedProductId, setSelectedProductId] = useState(-1);

    useEffect(() => {
        if(props.setResetCallback!=null)
            props.setResetCallback(prev => reset);
    }, []);    
    
    function getProducts() {
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
        ].concat({id: -1, name: "", price: null});
    }

    function updateProduct(id) {
        if(id===-1)
            return reset();
        setSelectedProductId(id);
    }

    function reset() {
        setSelectedProductId(-1);
        if(props.reset)
            props.reset();
    }

    function submit() {
        if(selectedProductId===-1) {
            console.log("Error: no valid entries");
            window.alert("Error: no valid entries");
            return;
        }
        if(props.run!=null)
            props.run(products.find(product => product.id===selectedProductId));
        if(props.resetSubmit)
            reset();
    }

    return(
        <div className="wrapper">
            <div className='wrapper'>{"Product: "}
            <select value={selectedProductId} onChange={(event) => {updateProduct(parseInt(event.target.value));}}>
                {<option value={-1}>{""}</option>}
                {products.map(({id, name, price}) => { 
                    return <option key={id} value={id}>{`${name}(${+price.toFixed(2)}€)`}</option>
                })}
            </select></div>
            {props.useReset&&(!props.hideReset||selectedProductId!==-1)&&<button className='wrapper' onClick={reset}>{"reset"}</button>}
            {props.useSubmit&&(!props.hideSubmit||selectedProductId!==-1)&&<button className='wrapper' onClick={submit}>{"submit"}</button>}
        </div>
    );
}