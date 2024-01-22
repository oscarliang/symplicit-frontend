import * as React from 'react';
import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
} from 'reactstrap';

import { removeCarAction } from '../../../ducks/cars';
import { SelectCarType, updateMessage } from '../../../ducks/global';
import { deleteCarService, selectCar } from '../../../service/car-service';
import { useAppDispatch } from '../../../store';
import { Car, CarRequest } from '../../../types/car';
import Confirm from '../Confirm/Confirm';

export interface CarsTableProps {
  allCars: Record<number, CarRequest>; // inherit from the home-page=containers
}

function CarsTable({ allCars }: CarsTableProps): React.ReactElement {
  const [isActive, setIsActive] = useState(-1);
  const dispatch = useAppDispatch();

  const [selectDeleteCar, setSelectDeleteCar] = useState<CarRequest | null>(
    null,
  );
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const pageSize = 6;

  const onClickConfirmDelete = (car: CarRequest) => {
    setOpen(true);
    setConfirmTitle('Warning');
    setConfirmMessage(`Are you sure to delete ${car.name}?`);
    setSelectDeleteCar(car);
  };

  const handlePageClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setCurrentPage(index);
  };

  const onClickCloseConfirm = () => {
    setOpen(false);
  };

  const onClickYesButton = () => {
    setOpen(false);
    if (selectDeleteCar) {
      deleteCarService(selectDeleteCar)
        .then((carObj: Car) => {
          dispatch(removeCarAction(carObj));
          dispatch(updateMessage(`${carObj.name} has been deleted`));
        })
        .catch((err) => {
          console.error(err);
          dispatch(
            updateMessage(
              'Oops! It seems to be some error. Please contact the admin',
            ),
          );
        });
    }
  };

  const onClickCar = (index: number, car: SelectCarType) => {
    dispatch(selectCar(car));

    // update the select row
    setIsActive(index);
  };

  const renderTableBody = () => {
    const cars = Object.values(allCars) as unknown as SelectCarType[];
    return cars.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(
      (car: SelectCarType, index: number) =>
        car && (
          <tr
            className={isActive === index ? 'table-info' : ''}
            data-testid={`car-${index}`}
            key={car.id}
            onClick={() => onClickCar(index, car)}
          >
            <td>
              <img
                alt={car.name}
                className='rounded car-img animated bounceIn'
                src={car.imageUrl}
              />
            </td>
            <td>{car.name}</td>
            <td>{car.brand.toUpperCase()}</td>
            <td>{car.drive.replace(/\|/g, ' ').toUpperCase()}</td>
            <td aria-label='price'>
              <NumericFormat
                displayType='text'
                prefix='$'
                thousandSeparator
                value={car.price}
              />
            </td>
            <td
              aria-label='delete button'
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                onClickConfirmDelete(car);
              }}
            >
              <i className='fa fa-times' />
            </td>
          </tr>
        ),
    );
  };

  return (
    <Col>
      <Row>
        <Card>
          <CardHeader>
            <i className='fa fa-align-justify' /> All Cars
          </CardHeader>
          <CardBody>
            <Table bordered hover responsive size='sm' striped>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Price</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </Table>
          </CardBody>
        </Card>
        <Confirm
          body={confirmMessage}
          isOpen={open}
          onClickClose={onClickCloseConfirm}
          onClickYesButton={onClickYesButton}
          title={confirmTitle}
        />
      </Row>
      <Row>
        <Col>
          <Pagination>
            {Array.from({
              length: Math.floor(Object.values(allCars).length / pageSize) + 1,
            }).map((page, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <PaginationItem active={i === currentPage} key={i}>
                <PaginationLink href='#' onClick={(e) => handlePageClick(e, i)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Col>
  );
}

export default CarsTable;
