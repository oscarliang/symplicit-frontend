'use client';

import '../../public/css/font-awesome.css';
import '../../public/css/glyphicons.css';
import '../../public/css/glyphicons-social.css';
import '../../public/css/simple-line-icons.css';
import '../../public/scss/style.scss';

import 'core-js/es/promise';
import 'core-js/features/object/from-entries';
import 'core-js/features/string/replace-all';
import { Provider } from 'react-redux';

import { store } from '../store';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <title>symplicit - Test</title>
        <meta content='symplicit - Test' name='description' />
        <meta content='Oscar Liang' name='author' />
        <meta
          content='Bootstrap,Admin,Template,Open,Source,React,jQuery,CSS,HTML,Dashboard'
          name='keywords'
        />
      </head>
      <body className='app header-fixed sidebar-fixed aside-menu-fixed aside-menu-hidden'>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
