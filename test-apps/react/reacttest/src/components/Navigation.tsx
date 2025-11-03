import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../utils/constants';
import type { NavigationItem } from '../types';

export function Navigation() {
    const [isOpen, setIsOpen] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(
        new Set(['Charts', 'Interactive', 'UI Components', 'Advanced'])
    );

    const toggleSection = (title: string) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(title)) {
                next.delete(title);
            } else {
                next.add(title);
            }
            return next;
        });
    };

    const renderNavItem = (item: NavigationItem) => {
        if (item.path) {
            return (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `nav-link ${isActive ? 'active' : ''}`
                    }
                >
                    {item.title}
                </NavLink>
            );
        }

        const isExpanded = expandedSections.has(item.title);

        return (
            <div key={item.title} className="nav-section">
                <button
                    className="nav-section-header"
                    onClick={() => toggleSection(item.title)}
                >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    <span>{item.title}</span>
                </button>
                {isExpanded && item.items && (
                    <div className="nav-section-items">
                        {item.items.map((subItem) => renderNavItem(subItem))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <button
                className="nav-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle navigation"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <nav className={`navigation ${isOpen ? 'open' : 'closed'}`}>
                <div className="nav-header">
                    <h1>TSIChart Test App</h1>
                    <p className="nav-subtitle">React Component Testing</p>
                </div>

                <div className="nav-items">
                    {NAVIGATION_ITEMS.map((item) => renderNavItem(item))}
                </div>
            </nav>
        </>
    );
}
