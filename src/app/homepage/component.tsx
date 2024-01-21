'use client';

// import validator from 'validator';
import { clsx } from 'clsx';
import { normalize } from 'normalizr';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
} from 'reactstrap';

import CarsTable from '../../components/common/DataTable/CarsTable';
import {
  addCarAction,
  updateAllOfCarsAction,
  updateCarAction,
} from '../../ducks/cars';
import { updateMessage } from '../../ducks/global';
import { updatePermissions } from '../../ducks/permission';
import { carListSchema } from '../../schema';
import {
  saveCarService,
  updateCarService,
  updateMessageService,
} from '../../service/car-service';
import { useAppDispatch, useAppSelector } from '../../store';
import { Car, CarRequest, NormalizedCarsEntity } from '../../types/car';
import { Permission } from '../../types/permission';

interface HomepageContainerProps {
  allCars: Car[];
  roleModules: Record<string, number>;
}

function HomepageContainer({
  allCars,
  roleModules,
}: HomepageContainerProps): React.ReactElement {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [drive2wd, setDrive2wd] = useState(false);
  const [drive4wd, setDrive4wd] = useState(false);
  const [driveawd, setDriveawd] = useState(false);
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [cars, setCars] = useState<Record<number, CarRequest>>({});
  const [isAddCarEnabled, setIsAddCarEnabled] = useState(true);
  const [isUpdateCarEnabled, setIsUpdateCarEnabled] = useState(false);
  const dispatch = useAppDispatch();

  const allOfCars = useAppSelector((state) => state.cars);
  const { message } = useAppSelector((state) => state.global);
  const { selectedCar } = useAppSelector((state) => state.global);

  // Hook
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function usePrevious(value: any) {
    // The ref object is a generic container whose current property is mutable
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();

    // Store current value in ref
    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ref.current = value;
    }, [value]); // Only re-run if value changes

    // Return previous value (happens before update in useEffect above)
    return ref.current;
  }
  const prevSelectedCar = usePrevious(selectedCar);

  useEffect(() => {
    const carsEntity = normalize(
      allCars,
      carListSchema,
    ) as NormalizedCarsEntity;
    dispatch(updateAllOfCarsAction(carsEntity));
    dispatch(updatePermissions(roleModules as unknown as Permission[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCars(allOfCars);
  }, [allOfCars]);

  useEffect(() => {
    if (!prevSelectedCar) return;

    if (prevSelectedCar !== selectedCar) {
      setName(selectedCar.name);
      setBrand(selectedCar.brand);
      const { drive } = selectedCar;
      if (drive !== '') {
        setDrive2wd(drive.indexOf('2wd') !== -1);
        setDrive4wd(drive.indexOf('4wd') !== -1);
        setDriveawd(drive.indexOf('awd') !== -1);
      }
      setPrice(selectedCar.price);
      setImage(selectedCar.imageUrl);
      setIsUpdateCarEnabled(true);
      setIsAddCarEnabled(false);
    }
  }, [
    selectedCar,
    name,
    brand,
    drive2wd,
    drive4wd,
    driveawd,
    price,
    prevSelectedCar,
  ]);

  const onclickSubmit = () => {
    let drive = '';
    drive += drive2wd ? '2wd|' : '';
    drive += drive4wd ? '4wd|' : '';
    drive += driveawd ? 'awd|' : '';
    const car = {
      brand,
      drive,
      id:
        Math.floor(
          // eslint-disable-next-line rulesdir/prefer-use-date
          new Date().valueOf() / 1000000,
        ) + Math.floor(Math.random() * 10000),
      imageUrl: image,
      name,
      price,
    };

    saveCarService(car)
      .then((carResp: Car) => {
        dispatch(addCarAction(carResp));
        dispatch(updateMessage(`${carResp.name} has been added`));
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          updateMessage(
            'Oops! It seems to be some error. Please contact the admin',
          ),
        );
      });
  };

  const updateCar = () => {
    let drive = '';
    drive += drive2wd ? '2wd|' : '';
    drive += drive4wd ? '4wd|' : '';
    drive += driveawd ? 'awd|' : '';
    const car: CarRequest = {
      _id: selectedCar._id,
      brand,
      drive,
      id: selectedCar.id,
      imageUrl: image,
      name,
      price,
    };

    updateCarService(car)
      .then((carObj) => {
        dispatch(updateCarAction(carObj as Car));
        dispatch(updateMessage(`${car.name} has been updated`));
      })
      .catch(() => {
        dispatch(
          updateMessage(
            'Oops! It seems to be some error. Please contact the admin',
          ),
        );
      });
  };

  const onClickReset = () => {
    setIsUpdateCarEnabled(false);
    setIsAddCarEnabled(true);
    setName('');
    setBrand('');
    setDrive2wd(false);
    setDrive4wd(false);
    setDriveawd(false);
    setPrice('');
    setImage('');
    dispatch(updateMessageService(''));
  };

  const handleChangeName = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleChangeBrand = (e: React.FormEvent<HTMLInputElement>) => {
    setBrand(e.currentTarget.value);
  };

  const handleChangeImage = (e: React.FormEvent<HTMLInputElement>) => {
    setImage(e.currentTarget.value);
  };

  const handleChangeDrive2wd = (e: React.FormEvent<HTMLInputElement>) => {
    setDrive2wd(e.currentTarget.checked);
  };

  const handleChangeDrive4wd = (e: React.FormEvent<HTMLInputElement>) => {
    setDrive4wd(e.currentTarget.checked);
  };

  const handleChangeDriveawd = (e: React.FormEvent<HTMLInputElement>) => {
    setDriveawd(e.currentTarget.checked);
  };

  const handlePriceChange = (e: React.FormEvent<HTMLInputElement>) => {
    const currentPrice = e.currentTarget.value;
    // if (!validator.isNumeric(currentPrice)) {
    //   currentPrice = ''
    // }
    setPrice(currentPrice);
  };

  const showHideAlert = () =>
    message !== '' && (
      <div>
        <Alert color='primary'>{message}</Alert>
      </div>
    );

  const renderAddCar = () => (
    <Col>
      <Card>
        <CardHeader>
          <strong>Car</strong> Management
        </CardHeader>
        <CardBody>
          <Form action='' className='form-horizontal' method='post'>
            <FormGroup className='required' row>
              <Col md='3'>
                <Label htmlFor='hf-name required'>Name</Label>
              </Col>
              <Col md='9' xs='12'>
                <Input
                  className={name === '' ? 'is-invalid' : ''}
                  id='hf-name'
                  name='name'
                  onChange={handleChangeName}
                  placeholder='Enter Car Name...'
                  type='text'
                  value={name}
                />
                <FormText className='help-block'>
                  Please enter car name
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup className='required' row>
              <Col md='3'>
                <Label htmlFor='hf-brand'>Brand</Label>
              </Col>
              <Col md='9' xs='12'>
                <Input
                  className={clsx('form-control', {
                    'is-invalid': brand === '',
                  })}
                  id='hf-brand'
                  name='brand'
                  onChange={handleChangeBrand}
                  type='select'
                  value={brand.toUpperCase()}
                >
                  <option value=''>Please select</option>
                  <option value='PORSCHE'>PORSCHE</option>
                  <option value='BMW'>BMW</option>
                  <option value='AUDI'>AUDI</option>
                </Input>
                <FormText className='help-block'>
                  Please enter car brand
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup className='required' row>
              <Col md='3'>
                <Label htmlFor='hf-drive'>Drive</Label>
              </Col>
              <Col className='required' md='9' xs='12'>
                <Col
                  className={
                    !drive2wd && !drive4wd && !driveawd
                      ? 'is-invalid form-control'
                      : ''
                  }
                  md='9'
                >
                  <FormGroup check inline>
                    <Input
                      checked={drive2wd}
                      className='form-check-input'
                      id='inline-2WD'
                      name='drive2wd'
                      onChange={handleChangeDrive2wd}
                      type='checkbox'
                    />
                    <Label
                      check
                      className='form-check-label'
                      htmlFor='inline-2WD'
                    >
                      2WD
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      checked={drive4wd}
                      className='form-check-input'
                      id='inline-4WD'
                      name='drive4wd'
                      onChange={handleChangeDrive4wd}
                      type='checkbox'
                    />
                    <Label
                      check
                      className='form-check-label'
                      htmlFor='inline-4WD'
                    >
                      4WD
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Input
                      checked={driveawd}
                      className='form-check-input'
                      id='inline-AWD'
                      name='driveawd'
                      onChange={handleChangeDriveawd}
                      type='checkbox'
                    />
                    <Label
                      check
                      className='form-check-label'
                      htmlFor='inline-AWD'
                    >
                      AWD
                    </Label>
                  </FormGroup>
                </Col>
              </Col>
            </FormGroup>
            <FormGroup className='required' row>
              <Col md='3'>
                <Label htmlFor='hf-price'>Price</Label>
              </Col>
              <Col className='required' md='9' xs='12'>
                <Input
                  className={price === '' ? 'is-invalid' : ''}
                  id='hf-price'
                  name='price'
                  onChange={handlePriceChange}
                  placeholder='Enter Price...'
                  type='text'
                  value={price}
                />
                <FormText className='help-block'>
                  Please enter car price.
                  <strong className="ml-2">Note</strong>: only allow input numbers
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md='3'>
                <Label htmlFor='hf-image'>Image Url</Label>
              </Col>
              <Col md='9' xs='12'>
                <Input
                  id='hf-image'
                  name='image'
                  onChange={handleChangeImage}
                  placeholder='Enter Image Url...'
                  type='text'
                  value={image}
                />
                <FormText className='help-block'>
                  Please enter image url.
                  <strong className="ml-2">Note</strong>: only allow web image url
                </FormText>
              </Col>
            </FormGroup>
          </Form>
          {showHideAlert()}
        </CardBody>
        <CardFooter>
          <Button
            color='primary'
            data-testid='add-car-btn'
            disabled={!isAddCarEnabled}
            onClick={onclickSubmit}
            size='sm'
            type='submit'
          >
            <i className='fa fa-dot-circle-o' /> Add Car
          </Button>
          <Button
            className='offset-sm-1'
            color='primary'
            data-testid='update-car-btn'
            disabled={!isUpdateCarEnabled}
            onClick={updateCar}
            size='sm'
            type='submit'
          >
            <i className='fa fa-dot-circle-o' /> Update Car
          </Button>
          <Button
            className='offset-sm-1 float-right'
            color='danger'
            data-testid='reset-car-btn'
            onClick={onClickReset}
            size='sm'
            type='submit'
          >
            <i className='fa fa-dot-circle-o' /> Reset
          </Button>
        </CardFooter>
      </Card>
    </Col>
  );
  return (
    <>
      {renderAddCar()}
      {Object.keys(cars).length > 0 && <CarsTable allCars={cars} />}
    </>
  );
}

export default HomepageContainer;
