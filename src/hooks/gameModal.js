import ReactDOM from 'react-dom';
const Modal = ({ onClose, children }) => {
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    const modalContent = (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={handleModalClick}>
                <button onClick={onClose}>close</button>
                {children}
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById('modal-root') // これはpublic/index.htmlに配置する必要がある要素IDです
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
    zIndex: 1000,   // zIndexを追加して最前面に表示
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
