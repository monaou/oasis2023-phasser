const Modal = ({ onClose, children }) => {
    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <button onClick={onClose}>close</button>
                {children}
            </div>
        </div>
    );
};

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const modalStyle = {
    width: '80vw',
    maxHeight: '80vh',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    overflowY: 'auto',
};

export default Modal;
