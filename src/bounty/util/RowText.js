import PropTypes from 'prop-types';
import React from 'react';

const RowText = React.forwardRef(({ className, left, right }, ref) => (
    <div ref={ref} className={`d-flex w-100 justify-content-between align-items-baseline gap-3 ${className}`}>
        <span className="text-truncate">{left}</span>
        <span className="text-nowrap">{right}</span>
    </div>
));

RowText.propTypes = {
    className: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
};

RowText.defaultProps = {
    className: '',
    left: '',
    right: '',
};

export default RowText;
