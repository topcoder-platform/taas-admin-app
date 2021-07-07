import React from "react";
import PT from "prop-types";
import cn from "classnames";
import Loader from "react-loader-spinner";
import styles from "./styles.module.scss";

/**
 * Displays spinning incomplete circle.
 *
 * @param {Object} props component props
 * @param {string} [props.className] class name added to root element
 * @param {string} [props.color] spinner color in HEX format
 * @param {any} [props.type] spinner type as defined in
 * react-loader-spinner documentation
 * @param {number} [props.width] spinner width
 * @param {number} [props.height] spinner height
 * @returns {JSX.Element}
 */
const Spinner = ({
  className,
  color = "#00BFFF",
  type = "TailSpin",
  width = 80,
  height = 0,
}) => (
  <div className={cn(styles.container, className)}>
    <Loader color={color} type={type} width={width} height={height || width} />
  </div>
);

Spinner.propTypes = {
  className: PT.string,
  color: PT.string,
  type: PT.string,
  width: PT.number,
  height: PT.number,
};

export default Spinner;
