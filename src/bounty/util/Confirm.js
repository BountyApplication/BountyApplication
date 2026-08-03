import { Alert, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

Confirm.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    run: PropTypes.func,
    hasBreak: PropTypes.bool,
    show: PropTypes.bool,
    setShow: PropTypes.func.isRequired,
    danger: PropTypes.bool,
};

Confirm.defaultProps = {
    title: "Bestätigung",
    text: "",
    hasBreak: true,
    show: false,
    danger: false,
};

export default function Confirm({ title, text, run, hasBreak, show, setShow, danger }) {
    return (
        <Alert show={show} variant={danger ? "danger" : "primary"} className="shadow-sm">
            <Alert.Heading className="d-flex align-items-center gap-2">
                <i className={`bi ${danger ? 'bi-exclamation-triangle-fill' : 'bi-question-circle-fill'}`} />
                {title}
            </Alert.Heading>
            {text && <p className="mb-0">{text}</p>}
            <hr />
            <div className="d-flex justify-content-end gap-2">
                {hasBreak && (
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShow(false)}
                    >
                        <i className="bi bi-x-lg me-1" />Abbrechen
                    </Button>
                )}
                <Button
                    variant={danger ? "danger" : "primary"}
                    onClick={() => { setShow(false); if (run) run(); }}
                    autoFocus
                >
                    <i className="bi bi-check-lg me-1" />Bestätigen
                </Button>
            </div>
        </Alert>
    );
}
