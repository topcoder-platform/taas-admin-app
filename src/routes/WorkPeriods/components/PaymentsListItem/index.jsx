// @ts-nocheck
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback, useRef } from "react";
import PT from "prop-types";
import cn from "classnames";
import styles from "./styles.module.scss";
import { formatChallengeUrl } from "utils/formatters";

const PaymentsListItem = ({ className, item }) => {
  const inputRef = useRef();

  const onCopyLinkClick = useCallback(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
    document.execCommand("copy");
  }, []);

  return (
    <div className={cn(styles.container, className)}>
      <span className={styles.iconLink}></span>
      <input
        readOnly
        ref={inputRef}
        type="text"
        value={item.challengeId || "0"}
      />
      <span className={styles.iconCopyLink} onClick={onCopyLinkClick}></span>
      <a
        className={styles.iconOpenLink}
        href={formatChallengeUrl(item.challengeId)}
        target="_blank"
        rel="noreferrer"
      >
        <span className={styles.hidden}>{item.id}</span>
      </a>
    </div>
  );
};

PaymentsListItem.propTypes = {
  className: PT.string,
  item: PT.shape({
    id: PT.oneOfType([PT.string, PT.number]),
    challengeId: PT.oneOfType([PT.string, PT.number]),
  }),
};

export default PaymentsListItem;
