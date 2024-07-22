import {Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';

Warning.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    show: PropTypes.bool,
    setShow: PropTypes.func.isRequired,
};

Warning.defaultProps = {
    title: "Error",
    text: "",
    show: false,
};

export default function Warning({title, text, show, setShow}) {
    if (show) {
        return (
            <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>{title}</Alert.Heading>
                {text}
            </Alert>
        );
    }
    return;
}