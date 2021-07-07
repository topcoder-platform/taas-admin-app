import React, { useState } from "react";
import { usePopper } from "react-popper";
import PT from "prop-types";
import cn from "classnames";
import { useClickOutside } from "utils/hooks";
import compStyles from "./styles.module.scss";

/**
 * Displays a popup near the reference element.
 *
 * @param {Object} props component properties
 * @param {any} [props.children] child nodes
 * @param {string} [props.className] class name to be added to root element
 * @param {() => void} [props.onClickOutside] function called when user clicks
 * outside the popup
 * @param {import('@popperjs/core').Placement} [props.placement] popup placement
 * as defined in PopperJS documentation
 * @param {Object} props.referenceElement reference element
 * @param {'absolute'|'fixed'} [props.strategy] positioning strategy
 * @returns {JSX.Element}
 */
const Popup = ({
  children,
  className,
  onClickOutside,
  placement = "bottom",
  referenceElement,
  strategy = "absolute",
}) => {
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,
    strategy,
    modifiers: [
      { name: "arrow", options: { element: arrowElement, padding: 10 } },
      { name: "offset", options: { offset: [0, 5] } },
      { name: "preventOverflow", options: { padding: 15 } },
    ],
  });

  useClickOutside(popperElement, onClickOutside, []);

  return (
    <div
      ref={setPopperElement}
      className={cn(compStyles.container, className)}
      style={styles.popper}
      {...attributes.popper}
    >
      {children}
      <div
        className={compStyles.popupArrow}
        ref={setArrowElement}
        style={styles.arrow}
      />
    </div>
  );
};

Popup.propTypes = {
  children: PT.node,
  className: PT.string,
  onClickOutside: PT.func,
  placement: PT.string,
  referenceElement: PT.object.isRequired,
  strategy: PT.oneOf(["absolute", "fixed"]),
};

export default Popup;
