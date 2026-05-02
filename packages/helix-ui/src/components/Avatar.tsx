import { forwardRef, useState, useEffect, type HTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Image URL. If the image fails to load or `src` is omitted,
   * the component falls back to initials derived from `name`.
   */
  src?: string;

  /**
   * The full name of the person/entity. Used to:
   * 1. Generate initials when the image is unavailable
   * 2. Set `alt` text on the image for screen readers
   */
  name: string;

  /**
   * Size of the avatar.
   * @default 'md'
   */
  size?: AvatarSize;
}

/**
 * Generates 1-2 letter initials from a name string.
 * Examples: "Zoriah Cocio" -> "ZC", "Anthropic" -> "A", "Mary Jane Watson" -> "MW"
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return '?';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}

/**
 * Avatar — image with deterministic initials fallback.
 *
 * Three states:
 *   1. Image loads successfully → shows image
 *   2. Image fails (404, network) → shows initials
 *   3. No `src` provided → shows initials
 *
 * The fallback is automatic — no extra props needed.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', className, ...rest },
  ref
) {
  const [imageFailed, setImageFailed] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  const showImage = src && !imageFailed;

  return (
    <span
      ref={ref}
      className={cx('helix-avatar', `helix-avatar--${size}`, className)}
      {...rest}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageFailed(true)}
          className="helix-avatar__img"
        />
      ) : (
        <span className="helix-avatar__initials" aria-label={name}>
          {getInitials(name)}
        </span>
      )}
    </span>
  );
});
