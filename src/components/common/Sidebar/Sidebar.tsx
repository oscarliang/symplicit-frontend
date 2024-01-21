import Link from 'next/link';
import * as React from 'react';
import { connect } from 'react-redux';

import { loginOutAction } from '../../../ducks/login';
import { RootState, useAppDispatch } from '../../../store';
import { PermissionType } from '../../../types/permission';
import { ACCESS_TOKEN_KEY, removeCookie } from '../../../utils/cookies';
import { hasPermission } from '../../../utils/permissions';

export interface SidebarProps {
  permissions: Record<string, number>;
}

function Sidebar({ permissions }: SidebarProps): React.ReactElement {
  const dispatch = useAppDispatch();

  const onclickLogOff = () => {
    removeCookie(`${ACCESS_TOKEN_KEY}`);
    dispatch(loginOutAction());
  };

  return (
    <div className='sidebar'>
      <nav className='sidebar-nav'>
        <ul className='nav'>
          {hasPermission(permissions, 'carModule', [PermissionType.READ]) && (
            <li className='nav-item'>
              <Link className='nav-link' href='/homepage'>
                <i className='icon-home' /> Home Page{' '}
              </Link>
            </li>
          )}
          {hasPermission(permissions, 'searchModule', [
            PermissionType.CREATE,
          ]) && (
            <li className='nav-item'>
              <Link className='nav-link' href='/search'>
                <i className='icon-magnifier' /> Search{' '}
              </Link>
            </li>
          )}
          <li className='nav-item'>
            <Link className='nav-link' href='/login' onClick={onclickLogOff}>
              <i className='icon-logout' /> Log Off{' '}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  permissions: state.permissions,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
