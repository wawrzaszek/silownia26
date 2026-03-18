import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

/**
 * Komponent ExternalLink służy do otwierania linków zewnętrznych.
 * Na platformach natywnych (iOS/Android) otwiera link wewnątrz aplikacji (In-App Browser),
 * zamiast wychodzić do domyślnej przeglądarki systemowej.
 */
export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Zapobiegamy domyślnemu zachowaniu (otwarciu w Safari/Chrome)
          event.preventDefault();
          // Otwieramy link w przeglądarce wbudowanej w aplikację.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
