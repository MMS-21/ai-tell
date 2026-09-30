import { useId, isValidElement, cloneElement, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { Info } from 'lucide-react';

type HelpTipProps = {
  /** The help text, always taken from the central translations. */
  text: string;
  /** Bubble alignment relative to the anchor: 'start' (default) or 'end' (near the right/left viewport edge). */
  align?: 'start' | 'end';
  /**
   * Optional target to wrap. Hovering or focusing the target reveals the tip and
   * `aria-describedby` is injected into it, so keyboard and screen-reader users
   * get the same information. Omit it to render a standalone '?' trigger button.
   */
  children?: ReactNode;
  /** Lay the wrapper out as a full-width block (for buttons that stretch to 100%). */
  block?: boolean;
  style?: CSSProperties;
};

/**
 * Accessible tooltip: the bubble stays in the DOM (CSS `opacity` — not
 * `visibility` — so `aria-describedby` keeps resolving for assistive tech),
 * shows on hover and on keyboard focus (`:focus-within`), respects RTL through
 * logical CSS properties, and honors `prefers-reduced-motion`.
 */
export function HelpTip({ text, align = 'start', children, block = false, style }: HelpTipProps) {
  const id = useId();

  const bubble = <span role="tooltip" id={id} className="help-tip-bubble">{text}</span>;
  const className = `help-tip${align === 'end' ? ' help-tip--end' : ''}${block ? ' help-tip--block' : ''}`;

  if (children !== undefined) {
    // Inject the description onto the focusable target itself (descriptions on
    // a wrapping <span> are not announced when the inner control takes focus).
    const target = isValidElement(children)
      ? cloneElement(children as ReactElement<any>, { 'aria-describedby': id })
      : children;
    return (
      <span className={className} style={style}>
        {target}
        {bubble}
      </span>
    );
  }

  return (
    <span className={className} style={style}>
      <button
        type="button"
        className="help-tip-trigger"
        aria-label={text}
        aria-describedby={id}
      >
        <Info size={14} aria-hidden="true" />
      </button>
      {bubble}
    </span>
  );
}

export default HelpTip;
