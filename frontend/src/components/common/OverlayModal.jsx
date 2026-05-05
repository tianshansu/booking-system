import { useEffect } from "react";
import "./OverlayModal.css";

export default function OverlayModal({ open, title, onClose, children }) {
  // make sure the outside content does not move
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // only show when open is true
  if (!open) return null;

  return (
    // click backdrop area to close the overlay
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-modal" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-header">
          <div>{title}</div>
          {/* button to exit overlay */}
          <button type="button" onClick={onClose}>
            x
          </button>
        </div>
        <div className="overlay-body">{children}</div>
      </div>
    </div>
  );
}
