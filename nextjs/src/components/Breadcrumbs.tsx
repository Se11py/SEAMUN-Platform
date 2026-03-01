'use client';

import Link from 'next/link';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className="breadcrumbs">
            <ol className="breadcrumbs-list" itemScope itemType="https://schema.org/BreadcrumbList">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li
                            key={index}
                            className={`breadcrumbs-item${isLast ? ' breadcrumbs-item--current' : ''}`}
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                        >
                            {isLast || !item.href ? (
                                <span itemProp="name" aria-current={isLast ? 'page' : undefined}>
                                    {item.label}
                                </span>
                            ) : (
                                <Link href={item.href} itemProp="item">
                                    <span itemProp="name">{item.label}</span>
                                </Link>
                            )}
                            <meta itemProp="position" content={String(index + 1)} />
                            {!isLast && (
                                <span className="breadcrumbs-separator" aria-hidden="true">
                                    ›
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
