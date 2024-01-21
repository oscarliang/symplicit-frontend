import * as React from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface ConfirmProps {
  body: string;
  isOpen: boolean;
  onClickClose: () => void;
  onClickYesButton: () => void;
  title: string;
}

function Confirm({
  body,
  isOpen,
  onClickClose,
  onClickYesButton,
  title,
}: ConfirmProps) {
  return (
    <Modal isOpen={isOpen} toggle={onClickClose}>
      <ModalHeader toggle={onClickClose}>{title}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={onClickYesButton}>
          Yes
        </Button>{' '}
        <Button color='secondary' onClick={onClickClose}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default Confirm;
