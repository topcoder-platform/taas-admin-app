import React, { useCallback, useMemo } from "react";
import PT from "prop-types";
import cn from "classnames";
import { Modal as ReactModal } from "react-responsive-modal";
import Button from "components/Button";
import IconCross from "../../assets/images/icon-cross-light.svg";
import { stopImmediatePropagation } from "utils/misc";
import styles from "./styles.module.scss";
import "react-responsive-modal/styles.css";

const closeIcon = <IconCross />;

/**
 * Displays a modal with Approve- and Dismiss-button and an overlay.
 *
 * @param {Object} props component properties
 * @param {'primary'|'error'|'warning'} [props.approveColor] color for the approve-button
 * @param {boolean} [props.approveDisabled] whether the approve button is disabled
 * @param {string} [props.approveText] text for Approve-button
 * @param {Object} props.children elements that will be shown inside modal
 * @param {string} [props.className] class name to be added to modal element
 * @param {?Object} [props.controls] custom controls that will be shown below
 * modal's contents
 * @param {string} [props.dismissText] text for Dismiss-button
 * @param {boolean} [props.isDisabled] whether the modal is disabled
 * @param {boolean} props.isOpen whether to show or hide the modal
 * @param {() => void} [props.onApprove] function called on approve action
 * @param {() => void} [props.onClose] function called when the modal is closed
 * and the close animation has finished
 * @param {() => void} props.onDismiss function called on dismiss action
 * @param {string} [props.title] text for modal title
 * @returns {JSX.Element}
 */
const Modal = ({
  approveColor = "warning",
  approveDisabled = false,
  approveText = "Apply",
  children,
  className,
  controls,
  dismissText = "Cancel",
  isDisabled = false,
  isOpen,
  onApprove,
  onClose,
  onDismiss,
  title,
}) => {
  const onAnimationEnd = useCallback(() => {
    if (!isOpen) {
      onClose?.();
    }
  }, [isOpen, onClose]);

  const classNames = useMemo(
    () => ({
      modal: cn(styles.modal, className),
      modalContainer: styles.modalContainer,
    }),
    [className]
  );

  return (
    <ReactModal
      center
      classNames={classNames}
      closeOnOverlayClick={!isDisabled}
      onAnimationEnd={onAnimationEnd}
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
              color={approveColor}
              isDisabled={approveDisabled}
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
        <button
          className={styles.closeButton}
          type="button"
          onClick={onDismiss}
        >
          {closeIcon}
        </button>
      </div>
    </ReactModal>
  );
};

Modal.propTypes = {
  approveColor: PT.oneOf(["primary", "error", "warning"]),
  approveDisabled: PT.bool,
  approveText: PT.string,
  children: PT.node,
  className: PT.string,
  container: PT.element,
  controls: PT.node,
  dismissText: PT.string,
  isDisabled: PT.bool,
  isOpen: PT.bool.isRequired,
  onApprove: PT.func,
  onClose: PT.func,
  onDismiss: PT.func.isRequired,
  title: PT.string,
};

export default Modal;
