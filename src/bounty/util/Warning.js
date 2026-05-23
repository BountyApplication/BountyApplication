import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

Warning.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    show: PropTypes.bool,
    setShow: PropTypes.func.isRequired,
};

Warning.defaultProps = {
    title: "Fehler",
    text: "",
    show: false,
};

export default function Warning({ title, text, show, setShow }) {
    if (!show) return null;
    return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible className="d-flex align-items-start gap-2">
            <i className="bi bi-exclamation-triangle-fill mt-1" />
            <div>
                <Alert.Heading className="fs-6 fw-bold mb-1">{title}</Alert.Heading>
                {text}
            </div>
        </Alert>
    );
}
