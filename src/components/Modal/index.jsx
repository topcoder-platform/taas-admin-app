import React from "react";
import PT from "prop-types";
import { Modal as ReactModal } from "react-responsive-modal";
import Button from "components/Button";
import IconCross from "../../assets/images/icon-cross-light.svg";
import { stopImmediatePropagation } from "utils/misc";
import styles from "./styles.module.scss";
import "react-responsive-modal/styles.css";

const classNames = {
  modal: styles.modal,
  modalContainer: styles.modalContainer,
};
const closeIcon = <IconCross />;

/**
 * Displays a modal with Approve- and Dismiss-button and an overlay.
 *
 * @param {Object} props component properties
 * @param {string} [props.approveText] text for Approve-button
 * @param {Object} props.children elements that will be shown inside modal
 * @param {?Object} [props.controls] custom controls that will be shown below
 * modal's contents
 * @param {string} [props.dismissText] text for Dismiss-button
 * @param {boolean} props.isOpen whether to show or hide the modal
 * @param {() => void} [props.onApprove] function called on approve action
 * @param {() => void} props.onDismiss function called on dismiss action
 * @param {string} [props.title] text for modal title
 * @returns {JSX.Element}
 */
const Modal = ({
  approveText = "Apply",
  children,
  controls,
  dismissText = "Cancel",
  isOpen,
  onApprove,
  onDismiss,
  title,
}) => (
  <ReactModal
    center
    classNames={classNames}
    onClose={onDismiss}
    open={isOpen}
    onOverlayClick={stopImmediatePropagation}
    showCloseIcon={false}
  >
    <div
      className={styles.wrapper}
      onMouseDown={stopImmediatePropagation}
      onMouseUp={stopImmediatePropagation}
      onClick={stopImmediatePropagation}
      role="button"
      tabIndex={0}
    >
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
      {controls || controls === null ? (
        controls
      ) : (
        <div className={styles.controls}>
          <Button
            className={styles.button}
            color="warning"
            variant="contained"
            onClick={onApprove}
          >
            {approveText}
          </Button>
          <Button className={styles.button} onClick={onDismiss}>
            {dismissText}
          </Button>
        </div>
      )}
      <button className={styles.closeButton} type="button" onClick={onDismiss}>
        {closeIcon}
      </button>
    </div>
  </ReactModal>
);

Modal.propTypes = {
  approveText: PT.string,
  children: PT.node,
  container: PT.element,
  controls: PT.node,
  dismissText: PT.string,
  isOpen: PT.bool.isRequired,
  onApprove: PT.func,
  onDismiss: PT.func.isRequired,
  title: PT.string,
};

export default Modal;
