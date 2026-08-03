import { useGetLastBookings } from "../util/Database";
import { Card, ListGroup, Row, Col, Badge } from "react-bootstrap";
import BookingDisplay from "../util/BookingDisplay";
import { toCurrency } from '../util/Util';
import { useState } from 'react';

export default function LastBookings({ userId }) {
    const bookings = useGetLastBookings(userId);
    const [activeId, setActiveId] = useState(null);

    if (!bookings || bookings.length === 0) return null;

    const activeBooking = bookings.find(({ bookingId }) => bookingId === activeId);
    let counter = bookings.length;

    return (
        <Card className="shadow-sm">
            <Card.Header>
                <Card.Title className="mb-0 fw-semibold">
                    <i className="bi bi-clock-history me-2" />
                    Letzte Buchungen
                </Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
                <Row className="g-0">
                    <Col xs={12} md={activeBooking ? 5 : 12}>
                        <ListGroup variant="flush">
                            {bookings.map(({ bookingId, date = "0000-00-00 00:00:00", productSum, correction, cashPayment, newBalance, oldBalance }) => {
                                const num = counter--;
                                const isActive = bookingId === activeId;
                                const dateStr = date.substring(5, 16).replace('-', '.');
                                return (
                                    <ListGroup.Item
                                        key={bookingId}
                                        action
                                        active={isActive}
                                        onClick={() => setActiveId(isActive ? null : bookingId)}
                                        className="px-3 py-2"
                                    >
                                        <div className="d-flex align-items-center justify-content-between gap-2">
                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                <Badge bg={isActive ? 'light' : 'secondary'} text={isActive ? 'dark' : undefined}>
                                                    #{num}
                                                </Badge>
                                                <span className="text-nowrap small">{dateStr}</span>
                                                {productSum !== 0 && (
                                                    <span className="small fw-semibold">
                                                        {toCurrency(productSum)}
                                                    </span>
                                                )}
                                                {correction !== 0 && (
                                                    <span className="small text-muted">
                                                        Kor.: {correction > 0 ? '+' : ''}{toCurrency(correction)}
                                                    </span>
                                                )}
                                                {cashPayment !== 0 && (
                                                    <span className="small text-muted">
                                                        Bar: {cashPayment > 0 ? '+' : ''}{toCurrency(cashPayment)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="small text-muted text-nowrap">
                                                → {toCurrency(newBalance)}
                                            </span>
                                        </div>
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    </Col>
                    {activeBooking && (
                        <Col xs={12} md={7} className="border-start p-3">
                            <BookingDisplay
                                booking={activeBooking}
                                isHistory
                                userId={userId}
                            />
                        </Col>
                    )}
                </Row>
            </Card.Body>
        </Card>
    );
}
