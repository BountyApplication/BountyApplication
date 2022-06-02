import { Row, Col } from "react-bootstrap";
import PropTypes from 'prop-types';

RowText.propTypes = {
    className: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string
};

RowText.defaultProps = {
    className: '',
    left: '',
    right: ''
};

export default function RowText({className, left, right}) {
    return(
        <Row className={"justify-content-between"}>
            <Col className={className}>{left}</Col>
            <Col className={className} style={{maxWidth: "max-content"}}>{right}</Col>
        </Row>
    );
}   