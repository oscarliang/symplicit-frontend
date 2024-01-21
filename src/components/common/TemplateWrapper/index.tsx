import * as React from 'react';
import { Container } from 'reactstrap';

import Aside from '../Aside/Aside';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';

interface TemplateWrapperProps {
  children?: React.ReactNode;
}

export default function TemplateWrapper({
  children,
}: TemplateWrapperProps): React.ReactElement {
  return (
    <div className='app'>
      <Header />
      <div className='app-body'>
        <Sidebar />
        <main className='main'>
          <Container fluid>{children}</Container>
        </main>
        <Aside />
      </div>
      <Footer />
    </div>
  );
}
