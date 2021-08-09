/**
 * Role Item
 * An item for the Role List component.
 * Shows an image and the name of the role, with additional controls for editing and deleting.
 */
import React, { useState, useCallback } from "react";
import PT from "prop-types";
import cn from "classnames";
import FallbackIcon from "../../../../assets/images/icon-role-fallback.svg";
import styles from "./styles.module.scss";

function RoleItem({ name, imageUrl, onEditClick, onDeleteClick }) {
  const [error, setError] = useState(false);
  const onImgError = useCallback(() => setError(true), []);

  return (
    <div className={styles.item}>
      {imageUrl && !error ? (
        <img
          src={imageUrl}
          onError={onImgError}
          alt={name}
          className={styles["role-icon"]}
        />
      ) : (
        <FallbackIcon className={styles["role-icon"]} />
      )}
      <p className={styles["item-text"]}>{name}</p>
      <div className={styles.controls}>
        <button className={styles.button} onClick={onEditClick}>
          Edit
        </button>
        <button
          className={cn(styles.button, styles.red)}
          onClick={onDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

RoleItem.propTypes = {
  name: PT.string,
  imageUrl: PT.string,
  onEditClick: PT.func,
  onDeleteClick: PT.func,
};

export default RoleItem;
