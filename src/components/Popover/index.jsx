import React, { useCallback, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import Popup from "components/Popup";
import { negate, stopPropagation } from "utils/misc";
import styles from "./styles.module.scss";

/**
 * Displays a popover with provided content when clicked on the provided
 * target children;
 *
 * @param {Object} props component properties
 * @param {Object} props.children target children
 * @param {string} [props.className] class name to be added to root element
 * @param {Object} props.content content to show in popover
 * @param {string} [props.popupClassName] class name to be added to popup
 * @param {boolean} [props.stopClickPropagation] whether to prevent propagation
 * of click events on target content
 * @param {'absolute'|'fixed'} [props.strategy] popup positioning strategy
 * @param {string} [props.targetClassName] class name to be added to wrapper
 * element around target children
 * @returns {JSX.Element}
 */
const Popover = ({
  children,
  className,
  content,
  popupClassName,
  stopClickPropagation = false,
  strategy = "absolute",
  targetClassName,
}) => {
  const [isShown, setIsShown] = useState(false);
  const [refElem, setRefElem] = useState(null);

  const onTargetClick = useCallback(() => {
    setIsShown(negate);
  }, []);

  const onClickOutside = useCallback(() => {
    setIsShown(false);
  }, []);

  return (
    <div
      className={cn(styles.container, className)}
      onClick={stopClickPropagation ? stopPropagation : null}
      role="button"
      tabIndex={0}
    >
      <span
        className={cn(styles.target, targetClassName)}
        onClick={isShown ? null : onTargetClick}
        ref={setRefElem}
        role="button"
        tabIndex={0}
      >
        {children}
      </span>
      {!!content && isShown && (
        <Popup
          className={popupClassName}
          onClickOutside={onClickOutside}
          referenceElement={refElem}
          strategy={strategy}
        >
          {content}
        </Popup>
      )}
    </div>
  );
};

Popover.propTypes = {
  children: PT.node,
  className: PT.string,
  content: PT.node,
  popupClassName: PT.string,
  stopClickPropagation: PT.bool,
  strategy: PT.oneOf(["absolute", "fixed"]),
  targetClassName: PT.string,
};

export default Popover;
