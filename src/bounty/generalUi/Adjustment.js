import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Card } from 'react-bootstrap';
import { toCurrency } from '../util/Util';

Adjustment.propTypes = {
    channels: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        plus: PropTypes.number,
        minus: PropTypes.number,
        setPlus: PropTypes.func.isRequired,
        setMinus: PropTypes.func.isRequired,
    })).isRequired,
};

function channelValue(c) {
    return (c.plus || 0) - (c.minus || 0);
}

function valueToBuffer(v) {
    if (v == null || v === 0) return '';
    return v.toString().replace('.', ',');
}

function bufferToValue(s) {
    if (s == null || s === '' || s === '-' || s === ',' || s === '-,') return 0;
    const normalized = s.replace(',', '.');
    const n = parseFloat(normalized);
    return isNaN(n) ? 0 : n;
}

function formatBuffer(s) {
    if (s == null || s === '') return '0,00';
    if (s === '-' || s === '-,') return s + '0,00'.slice(s.length - 1);
    return s;
}

export default function Adjustment({ channels }) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(channels[0].key);
    const [drafts, setDrafts] = useState({});

    useEffect(() => {
        if (!open) return;
        const next = {};
        channels.forEach((c) => {
            next[c.key] = valueToBuffer(channelValue(c));
        });
        setDrafts(next);
        setMode(channels[0].key);
    }, [open]);  // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!open) return;

        function onKey(e) {
            if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;

            let handled = true;
            if (e.key >= '0' && e.key <= '9') appendDigit(e.key);
            else if (e.key === ',' || e.key === '.') appendComma();
            else if (e.key === 'Backspace') backspace();
            else if (e.key === 'Delete') clear();
            else if (e.key === 'Enter') confirm();
            else if (e.key === '-' || e.key === '+') toggleSign();
            else if (e.key === 'Escape') setOpen(false);
            else if (e.key === 'Tab' && channels.length > 1) {
                const idx = channels.findIndex((c) => c.key === mode);
                const dir = e.shiftKey ? -1 : 1;
                setMode(channels[(idx + dir + channels.length) % channels.length].key);
            }
            else handled = false;

            if (handled) {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }

        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    });

    function buffer() {
        return drafts[mode] ?? '';
    }

    function setBuffer(s) {
        setDrafts((prev) => ({ ...prev, [mode]: s }));
    }

    function appendDigit(d) {
        const cur = buffer();
        if (cur.includes(',')) {
            const [, dec] = cur.split(',');
            if (dec && dec.length >= 2) return;
        }
        if (cur === '0') return setBuffer(d);
        if (cur === '-0') return setBuffer('-' + d);
        setBuffer(cur + d);
    }

    function appendComma() {
        const cur = buffer();
        if (cur.includes(',')) return;
        if (cur === '' || cur === '-') return setBuffer(cur + '0,');
        setBuffer(cur + ',');
    }

    function backspace() {
        const cur = buffer();
        if (cur === '') return;
        setBuffer(cur.slice(0, -1));
    }

    function clear() {
        setBuffer('');
    }

    function toggleSign() {
        const cur = buffer();
        if (cur === '' || cur === '0') return;
        if (cur.startsWith('-')) setBuffer(cur.slice(1));
        else setBuffer('-' + cur);
    }

    function confirm() {
        channels.forEach((c) => {
            const v = Math.round(bufferToValue(drafts[c.key]) * 100) / 100;
            if (v > 0)      { c.setPlus(v);    c.setMinus(null); }
            else if (v < 0) { c.setPlus(null); c.setMinus(Math.abs(v)); }
            else            { c.setPlus(null); c.setMinus(null); }
        });
        setOpen(false);
    }

    function clearAll() {
        channels.forEach((c) => { c.setPlus(null); c.setMinus(null); });
        setOpen(false);
    }

    const draftValue = bufferToValue(buffer());
    const sign = draftValue > 0 ? 'pos' : draftValue < 0 ? 'neg' : 'zero';
    const display = formatBuffer(buffer());

    const totalsActive = channels.some((c) => channelValue(c) !== 0);

    const numpadRows = [
        ['7', '8', '9'],
        ['4', '5', '6'],
        ['1', '2', '3'],
        [',', '0', 'back'],
    ];

    return (
        <>
            <Card className="adj-trigger shadow-sm" onClick={() => setOpen(true)} role="button" tabIndex={0}>
                <Card.Body className="d-flex align-items-center justify-content-between py-2 px-3">
                    <div className="d-flex flex-column">
                        <small className="text-muted">
                            <i className="bi bi-sliders me-1" />Korrektur &amp; Barzahlung
                        </small>
                        <div className="d-flex gap-3 mt-1 flex-wrap">
                            {channels.map((c) => {
                                const v = channelValue(c);
                                const tone = v > 0 ? 'pos' : v < 0 ? 'neg' : 'zero';
                                return (
                                    <span key={c.key} className={`adj-summary ${tone}`}>
                                        <span className="opacity-75 me-1">{c.label}:</span>
                                        <strong>{v === 0 ? '—' : (v > 0 ? '+' : '') + toCurrency(v)}</strong>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                    <span className="adj-trigger-arrow" aria-hidden="true">›</span>
                </Card.Body>
            </Card>

            <Modal
                show={open}
                onHide={() => setOpen(false)}
                centered
                dialogClassName="adj-sheet"
                contentClassName="adj-sheet-content"
            >
                <button
                    type="button"
                    className="adj-close"
                    aria-label="Schließen"
                    onClick={() => setOpen(false)}
                >×</button>

                <div className="adj-body">
                    <div className="adj-pills">
                        {channels.map((c) => {
                            const v = bufferToValue(drafts[c.key] ?? '');
                            const isActive = mode === c.key;
                            return (
                                <button
                                    key={c.key}
                                    type="button"
                                    className={`adj-pill ${isActive ? 'active' : ''}`}
                                    onClick={() => setMode(c.key)}
                                >
                                    <span className="adj-pill-label">{c.label}</span>
                                    <span className={`adj-pill-value ${v > 0 ? 'pos' : v < 0 ? 'neg' : 'zero'}`}>
                                        {v === 0 ? '0,00 €' : (v > 0 ? '+' : '') + toCurrency(v)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className={`adj-display ${sign}`}>
                        <span className="adj-display-value">{display}</span>
                        <span className="adj-display-suffix">€</span>
                    </div>

                    <div className="adj-numpad">
                        {numpadRows.map((row, i) => (
                            <React.Fragment key={i}>
                                {row.map((cell) => {
                                    if (cell === 'back') return (
                                        <button
                                            key="back"
                                            type="button"
                                            className="adj-key adj-key-action"
                                            onClick={backspace}
                                            onDoubleClick={clear}
                                            title="Löschen (Doppelklick: alles)"
                                        >⌫</button>
                                    );
                                    if (cell === ',') return (
                                        <button
                                            key=","
                                            type="button"
                                            className="adj-key adj-key-secondary"
                                            onClick={appendComma}
                                        >,</button>
                                    );
                                    return (
                                        <button
                                            key={cell}
                                            type="button"
                                            className="adj-key"
                                            onClick={() => appendDigit(cell)}
                                        >{cell}</button>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="adj-tools">
                        <button
                            type="button"
                            className={`adj-tool ${draftValue < 0 ? 'is-neg' : ''}`}
                            onClick={toggleSign}
                            title="Vorzeichen wechseln"
                        >± Vorzeichen</button>
                        <button
                            type="button"
                            className="adj-tool"
                            onClick={clear}
                        >Leeren</button>
                        <button
                            type="button"
                            className="adj-tool adj-tool-danger"
                            onClick={clearAll}
                            disabled={!totalsActive}
                        >Alles ↺</button>
                    </div>

                    <div className="adj-actions">
                        <button
                            type="button"
                            className="adj-cancel"
                            onClick={() => setOpen(false)}
                        >Abbrechen</button>
                        <button
                            type="button"
                            className="adj-confirm"
                            onClick={confirm}
                        >Übernehmen</button>
                    </div>

                    <div className="adj-hint">
                        <kbd>0</kbd>–<kbd>9</kbd> Ziffern&nbsp;·&nbsp;
                        <kbd>,</kbd> Komma&nbsp;·&nbsp;
                        <kbd>−</kbd> Vorzeichen&nbsp;·&nbsp;
                        <kbd>⌫</kbd> Löschen&nbsp;·&nbsp;
                        <kbd>Tab</kbd> Wechseln&nbsp;·&nbsp;
                        <kbd>↵</kbd> Übernehmen&nbsp;·&nbsp;
                        <kbd>Esc</kbd> Abbrechen
                    </div>
                </div>
            </Modal>
        </>
    );
}
