import { useState, useRef, useEffect } from 'react';
import { Button, Flex, Text, View } from '@aws-amplify/ui-react';
import { IconChevron } from '@/components/Icons';
import { frameworks } from '@/constants/frameworks';
import Link from 'next/link';
import classNames from 'classnames';
import { useClickOutside } from '@/utils/useClickOutside';
import { VersionSwitcher } from '../VersionSwitcher';
import { PLATFORM_VERSIONS, PLATFORM_DISPLAY_NAMES } from '@/data/platforms';

export function PlatformNavigator({ currentPlatform, isPrev }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const platformTitle = PLATFORM_DISPLAY_NAMES[currentPlatform];

  const contentRef = useClickOutside((e) => {
    if (triggerRef.current && !triggerRef.current.contains(e.target)) {
      if (isOpen) {
        setIsOpen(false);
      }
    }
  });

  useEffect(() => {
    if (isOpen) {
      contentRef?.current?.focus();
    }
  }, [isOpen]);

  const platformItem = frameworks.filter((platform) => {
    return platform.title === platformTitle;
  })[0];

  return (
    <>
      <View className={`platform-navigator`}>
        <Text fontWeight="bold" paddingBottom="small">
          Choose your framework/language
        </Text>
        <Flex alignItems="center">
          <Button
            className={`platform-navigator__button`}
            aria-expanded={isOpen}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            isFullWidth={true}
            fontWeight="normal"
            ref={triggerRef}
            flex="1 1 0"
            paddingRight="xs"
          >
            <Flex as="span" alignItems="center" gap="small">
              {platformItem.icon}
              {platformTitle}
            </Flex>
            <IconChevron className={isOpen ? '' : 'icon-rotate-90-reverse'} />
          </Button>
          {PLATFORM_VERSIONS[currentPlatform] && <VersionSwitcher platform={currentPlatform} isPrev={isPrev} flex="1 1 0" />}
        </Flex>
        <View
          className={classNames('popover', {
            'popover--expanded': isOpen
          })}
          as="nav"
          tabIndex={0}
          ref={contentRef}
          ariaLabel="Platform navigation"
        >
          <ul className="popover-list">
            {frameworks.map((platform, index) => {
              const title = platform.title;
              const current = title === platformTitle;
              return (
                <li
                  className={classNames('popover-list__item', {
                    'platform-navigator__dropdown__item--current': current
                  })}
                  key={`platform-${index}`}
                >
                  <Link
                    className="popover-list__link"
                    href={platform.href}
                    onClick={() => setIsOpen(false)}
                  >
                    {platform.icon}
                    {platform.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </View>
      </View>
    </>
  );
}