import { Row, Col } from "react-bootstrap";
import PropTypes from 'prop-types';
import React from 'react';

const RowText = React.forwardRef(({innerRef, className, left, right}, ref) => (
    <Row ref={ref} className={"w-100 justify-content-between"}>
        <Col className={className}>{left}</Col>
        <Col className={className} style={{maxWidth: "max-content"}}>{right}</Col>
    </Row>
));

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

export default RowText;