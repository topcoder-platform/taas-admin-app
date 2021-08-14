import React, { useCallback, useMemo, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import { usePopper } from "react-popper";
import Button from "components/Button";
import Tooltip from "components/Tooltip";
import IconArrowDown from "../../assets/images/icon-arrow-down-narrow.svg";
import { useClickOutside } from "utils/hooks";
import { negate, stopPropagation } from "utils/misc";
import compStyles from "./styles.module.scss";

/**
 * Displays a clickable button with a menu.
 *
 * @param {Object} props component properties
 * @param {'primary'|'error'|'warning'} [props.handleColor] menu handle color
 * @param {'small'|'medium'} [props.handleSize] menu handle size
 * @param {string} [props.handleText] text to show inside menu handle
 * @param {Array} props.items menu items
 * @param {'absolute'|'fixed'} [props.popupStrategy] popup positioning strategy
 * @param {boolean} [props.stopClickPropagation] whether to stop click event propagation
 * @returns {JSX.Element}
 */
const ActionsMenu = ({
  handleColor = "primary",
  handleSize = "small",
  handleText,
  items = [],
  popupStrategy = "absolute",
  stopClickPropagation = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen(negate);
  }, []);

  return (
    <div
      className={compStyles.container}
      onClick={stopClickPropagation ? stopPropagation : null}
      role="button"
      tabIndex={0}
    >
      <Button
        color={handleColor}
        size={handleSize}
        style={handleText ? "rounded" : "circle"}
        variant="contained"
        onClick={isOpen ? null : toggleMenu}
        className={cn(compStyles.handle, {
          [compStyles.handleMenuOpen]: isOpen,
        })}
        innerRef={setReferenceElement}
      >
        {handleText ? <span>{handleText}&nbsp;</span> : null}
        <IconArrowDown className={compStyles.iconArrowDown} />
      </Button>
      {isOpen && (
        <Menu
          close={closeMenu}
          items={items}
          referenceElement={referenceElement}
          strategy={popupStrategy}
        />
      )}
    </div>
  );
};

ActionsMenu.propTypes = {
  handleColor: PT.oneOf(["primary", "error", "warning"]),
  handleSize: PT.oneOf(["small", "medium"]),
  handleText: PT.string,
  items: PT.arrayOf(
    PT.shape({
      label: PT.string,
      action: PT.func,
      separator: PT.bool,
      disabled: PT.bool,
      hidden: PT.bool,
    })
  ),
  popupStrategy: PT.oneOf(["absolute", "fixed"]),
  stopClickPropagation: PT.bool,
};

export default ActionsMenu;

/**
 * Displays a list of provided action items.
 *
 * @param {Object} props component properties
 * @returns {JSX.Element}
 */
const Menu = ({ close, items, referenceElement, strategy }) => {
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    strategy,
    modifiers: [
      {
        name: "flip",
        options: {
          fallbackPlacements: ["bottom"],
        },
      },
      {
        name: "offset",
        options: {
          // use offset to move the dropdown slightly down
          offset: [0, 5],
        },
      },
      {
        name: "arrow",
        // padding should be equal to border-radius of the dropdown
        options: { element: arrowElement, padding: 8 },
      },
      {
        name: "preventOverflow",
        options: {
          // padding from browser edges
          padding: 16,
        },
      },
      {
        name: "computeStyles",
        options: {
          // to fix bug in IE 11 https://github.com/popperjs/popper-core/issues/636
          gpuAcceleration: false,
        },
      },
    ],
  });

  const onClickItem = useCallback(
    (event) => {
      let targetData = event.target.dataset;
      let index = +targetData.actionIndex;
      let item = items[index];
      if (!item || targetData.disabled || item.separator) {
        return;
      }
      close();
      item.action?.();
    },
    [close, items]
  );

  useClickOutside(popperElement, close, []);

  const menuItems = useMemo(() => {
    return items.map((item, index) => {
      if (item.hidden) {
        return null;
      } else if (item.separator) {
        return <div key={index} className={compStyles.separator} />;
      } else {
        let reasonsDisabled = item.checkDisabled?.();
        let disabled = !!item.disabled || !!reasonsDisabled;
        let attrs = {
          key: index,
          "data-action-index": index,
          onClick: onClickItem,
          role: "button",
          tabIndex: 0,
          className: cn(
            compStyles.item,
            { [compStyles.itemDisabled]: disabled },
            item.className
          ),
        };
        if (disabled) {
          attrs["data-disabled"] = true;
        }
        return (
          <div {...attrs}>
            {reasonsDisabled ? (
              <Tooltip
                content={
                  reasonsDisabled.length === 1 ? (
                    reasonsDisabled[0]
                  ) : (
                    <ul>
                      {reasonsDisabled.map((text, index) => (
                        <li key={index}>{text}</li>
                      ))}
                    </ul>
                  )
                }
                strategy="fixed"
              >
                {item.label}
              </Tooltip>
            ) : (
              item.label
            )}
          </div>
        );
      }
    });
  }, [items, onClickItem]);

  return (
    <div
      className={compStyles.popover}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      <div className={compStyles.items}>{menuItems}</div>
      <div
        ref={setArrowElement}
        style={styles.arrow}
        className={compStyles.popoverArrow}
      />
    </div>
  );
};

Menu.propTypes = {
  close: PT.func.isRequired,
  items: PT.arrayOf(
    PT.shape({
      label: PT.string,
      action: PT.func,
      checkDisabled: PT.func,
      disabled: PT.bool,
      separator: PT.bool,
      hidden: PT.bool,
    })
  ),
  referenceElement: PT.object,
  strategy: PT.oneOf(["absolute", "fixed"]),
};
