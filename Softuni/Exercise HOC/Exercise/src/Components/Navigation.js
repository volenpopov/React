import React from 'react';
import withWarning from './WarningHOC';

const Navigation = () => {
    return (
        <nav>
            <header><span class="title">Navigation</span></header>
            <ul>
                <li><a href="https://google.com">Home</a></li>
                <li><a href="https://google.com">Catalog</a></li>
                <li><a href="https://google.com">About</a></li>
                <li><a href="https://google.com">Contact Us</a></li>
            </ul>
        </nav>
    );
}

const NavigationWithWarning = withWarning(Navigation);

export {Navigation};
export {NavigationWithWarning}