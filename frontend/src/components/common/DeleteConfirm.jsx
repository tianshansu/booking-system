import "./DeleteConfirm.css";
export default function DeleteConfirm({ text, onCancel, onConfirm }) {
  return (
    <div className="delete-confirm-overlay">
      <div className="delete-confirm">
        <div className="delete-confirm-title">{text}</div>
        <div className="delete-confirm-buttons">
          <button
            type="button"
            className="delete-confirm-button"
            onClick={onCancel}
          >
            No
          </button>
          <button
            type="button"
            className="delete-confirm-button"
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
