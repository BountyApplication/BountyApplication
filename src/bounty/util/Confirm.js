import {Alert, Button} from 'react-bootstrap';
import PropTypes from 'prop-types';

Confirm.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    run: PropTypes.func,
    hasBreak: PropTypes.bool,
    show: PropTypes.bool,
    setShow: PropTypes.func.isRequired,
};

Confirm.defaultProps = {
    title: "Bestätigung",
    text: "",
    hasBreak: true,
    show: false,
};

export default function Confirm({title, text, run, hasBreak, show, setShow, danger}) {  
    return (
      <>
        <Alert show={show} variant={danger?"danger":"success"}>
          <Alert.Heading>{title}</Alert.Heading>
          {text}
          <hr />
          <div className="d-flex justify-content-end">
            {hasBreak && <Button onClick={() => setShow(false)} variant="outline-danger" className="ms-3">
                Abbrechen
            </Button>}
            <Button onClick={() => {setShow(false); if(run) run();}} variant="outline-success" className="ms-3" autoFocus>
                Bestätige
            </Button>
          </div>
        </Alert>
      </>
    );
  }