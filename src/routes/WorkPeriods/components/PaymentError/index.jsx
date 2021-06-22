import React, { useCallback, useRef, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import Popup from "components/Popup";
import PaymentErrorDetails from "../PaymentErrorDetails";
import { useClickOutside } from "utils/hooks";
import { negate } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Displays an error icon and error details popup.
 *
 * @param {Object} props component properties
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} [props.errorDetails] error details object
 * @param {boolean} [props.isImportant] whether the error deemed important
 * @param {'absolute'|'fixed'} [props.popupStrategy] popup positioning strategy
 * @returns {JSX.Element}
 */
const PaymentError = ({
  className,
  errorDetails,
  isImportant = true,
  popupStrategy = "absolute",
}) => {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [refElem, setRefElem] = useState(null);
  const containerRef = useRef(null);

  const onIconClick = useCallback((event) => {
    event.stopPropagation();
    setIsShowPopup(negate);
  }, []);

  const onClickOutside = useCallback(() => {
    setIsShowPopup(false);
  }, []);

  useClickOutside(containerRef, onClickOutside, []);

  return (
    <div className={cn(styles.container, className)} ref={containerRef}>
      <span
        ref={setRefElem}
        className={cn(styles.icon, { [styles.isImportant]: isImportant })}
        onClick={onIconClick}
        role="button"
        tabIndex={0}
      />
      {isShowPopup && errorDetails && (
        <Popup referenceElement={refElem} strategy={popupStrategy}>
          <PaymentErrorDetails details={errorDetails} />
        </Popup>
      )}
    </div>
  );
};

PaymentError.propTypes = {
  className: PT.string,
  errorDetails: PT.object,
  isImportant: PT.bool,
  popupStrategy: PT.oneOf(["absolute", "fixed"]),
};

export default PaymentError;
