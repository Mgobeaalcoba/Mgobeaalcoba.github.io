'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TransitionLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  children: React.ReactNode;
}

export default function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If the user did a cmd-click, right click, or auxiliary click, let the default behavior run
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
      if (onClick) onClick(e);
      return;
    }

    e.preventDefault();

    if (onClick) {
      onClick(e);
    }

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
