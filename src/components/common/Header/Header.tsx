import * as React from 'react';
import LoadingBar from 'react-redux-loading-bar';
/**
 * The header of the site
 */
function Header() {
  const sidebarToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  };

  const mobileSidebarToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  };

  // const asideToggle = (e) => {
  // 	e.preventDefault();
  // 	document.body.classList.toggle("aside-menu-hidden");
  // };

  return (
    <header className='app-header navbar'>
      <LoadingBar className='loading' showFastActions />
      <button
        className='navbar-toggler mobile-sidebar-toggler d-lg-none'
        onClick={mobileSidebarToggle}
        type='button'
      >
        &#9776;
      </button>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a aria-label='empty' className='navbar-brand' href='#'>
        &nbsp;
      </a>
      <ul className='nav navbar-nav d-none d-lg-block'>
        <li className='nav-item'>
          <button
            className='nav-link navbar-toggler sidebar-toggler'
            onClick={sidebarToggle}
            type='button'
          >
            &#9776;
          </button>
        </li>
      </ul>
    </header>
  );
}

export default Header;
