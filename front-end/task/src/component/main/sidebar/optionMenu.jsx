import ReactDOM from 'react-dom';
import { FilePenLine, Trash2, ChevronRight, X } from 'lucide-react';
export const RenderDropdown = ({ isOpen,  position ,onClose, onEdit, onDelete }) => {
    return ReactDOM.createPortal(
     <div style={{top: position.top, left: position.left}} className={`option-${isOpen ? 'active' : 'unActive'}`}>
      <div className="close-button" onClick={(e) => { e.stopPropagation(); onClose(); }}>
        <X style={{ height: '16px', width: '16px' }} />
      </div>

      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={(e) => { e.stopPropagation(); onEdit(); onClose(); }}
      >
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <FilePenLine style={{ width: '16px', height: '16px' }} />
          <p>Edit</p>
        </div>
        <ChevronRight style={{ width: '16px', height: '16px' }} />
      </div>

      <div
        style={{ display: 'flex', justifyContent: 'space-between' }}
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <Trash2 style={{ width: '16px', height: '16px', color: 'red' }} />
          <p style={{ color: 'red' }}>Delete</p>
        </div>
      </div>
    </div>,
    document.body
    )
}