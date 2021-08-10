import React, { useCallback, useMemo, useState } from "react";
import PT from "prop-types";
import cn from "classnames";
import { usePopper } from "react-popper";
import Button from "components/Button";
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
 * @param {Array} props.items menu items
 * @param {'absolute'|'fixed'} [props.popupStrategy] popup positioning strategy
 * @param {boolean} [props.stopClickPropagation] whether to stop click event propagation
 * @returns {JSX.Element}
 */
const ActionsMenu = ({
  handleColor = "primary",
  handleSize = "small",
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

  const onItemClick = useCallback(
    (event) => {
      let index = +event.target.dataset.actionIndex;
      let item = items[index];
      if (!item || item.disabled || item.separator) {
        return;
      }
      closeMenu();
      item.action?.();
    },
    [items, closeMenu]
  );

  const menuItems = useMemo(
    () =>
      items.map((item, index) => {
        if (item.hidden) {
          return null;
        } else if (item.separator) {
          return <div key={index} className={compStyles.separator} />;
        } else {
          return (
            <div
              key={index}
              data-action-index={index}
              onClick={onItemClick}
              role="button"
              tabIndex={0}
              className={cn(
                compStyles.item,
                { [compStyles.itemDisabled]: item.disabled },
                item.className
              )}
            >
              {item.label}
            </div>
          );
        }
      }),
    [items, onItemClick]
  );

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
        variant="contained"
        onClick={isOpen ? null : toggleMenu}
        className={cn(compStyles.handle, {
          [compStyles.handleMenuOpen]: isOpen,
        })}
        innerRef={setReferenceElement}
      >
        Actions <IconArrowDown className={compStyles.iconArrowDown} />
      </Button>
      {isOpen && (
        <Menu
          items={menuItems}
          onClickOutside={closeMenu}
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
  items: PT.arrayOf(
    PT.shape({
      label: PT.string,
      action: PT.func,
      separator: PT.bool,
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
const Menu = ({ items, onClickOutside, referenceElement, strategy }) => {
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

  useClickOutside(popperElement, onClickOutside, []);

  return (
    <div
      className={compStyles.popover}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      <div className={compStyles.items}>{items}</div>
      <div
        ref={setArrowElement}
        style={styles.arrow}
        className={compStyles.popoverArrow}
      />
    </div>
  );
};

Menu.propTypes = {
  items: PT.array.isRequired,
  onClickOutside: PT.func.isRequired,
  referenceElement: PT.object,
  strategy: PT.oneOf(["absolute", "fixed"]),
};
