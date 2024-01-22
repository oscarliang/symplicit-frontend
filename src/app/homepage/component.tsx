'use client';

// import validator from 'validator';
import { clsx } from 'clsx';
import { normalize } from 'normalizr';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
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

type FormValues = {
  brand: string;
  drive: string[];
  imageUrl: string;
  name: string;
  price: string;
};

function HomepageContainer({
  allCars,
  roleModules,
}: HomepageContainerProps): React.ReactElement {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<FormValues>();
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
      setValue('name', selectedCar.name);
      setValue('brand', selectedCar.brand);
      const { drive } = selectedCar;
      if (drive !== '') {
        const models = drive.split('|');
        setValue('drive', models);
      }
      setValue('price', selectedCar.price);
      setValue('imageUrl', selectedCar.imageUrl);
      setIsUpdateCarEnabled(true);
      setIsAddCarEnabled(false);
    }
  }, [selectedCar, prevSelectedCar, setValue]);

  const atLeastOneMediumChecked = (selectedMediums: string[]) =>
    selectedMediums.length > 0;

  const onclickSubmit = (data: FormValues) => {
    const driveTypes = data.drive.join('|');
    const car = {
      brand: data.brand,
      drive: driveTypes,
      id:
        Math.floor(
          // eslint-disable-next-line rulesdir/prefer-use-date
          new Date().valueOf() / 1000000,
        ) + Math.floor(Math.random() * 10000),
      imageUrl: data.imageUrl,
      name: data.name,
      price: data.price,
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

  const updateCar = (data: FormValues) => {
    const driveTypes = data.drive.join('|');
    const car = {
      _id: selectedCar._id,
      brand: data.brand,
      drive: driveTypes,
      id: selectedCar.id,
      imageUrl: data.imageUrl,
      name: data.name,
      price: data.price,
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
    reset();
    dispatch(updateMessageService(''));
  };

  const showHideAlert = () =>
    message !== '' && (
      <div>
        <Alert color='primary' isOpen>
          {message}
        </Alert>
      </div>
    );

  const renderAddCar = () => (
    <Col>
      <Card>
        <CardHeader>
          <strong>Car</strong> Management
        </CardHeader>
        <CardBody>
          <Form className='form-horizontal'>
            <FormGroup className='required' row>
              <Col md='3'>
                <Label htmlFor='hf-name required'>Name</Label>
              </Col>
              <Col md='9' xs='12'>
                <input
                  className={clsx('form-control', {
                    'is-invalid': errors.name,
                  })}
                  placeholder='Enter Car Name...'
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...register('name', { required: true })}
                  type='text'
                />
                <div className='invalid-feedback'>
                  {errors.name && <span>This field is required</span>}
                </div>
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
                <select
                  className={clsx('form-control', {
                    'is-invalid': errors.brand,
                  })}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...register('brand', { required: true })}
                >
                  <option value=''>Please select</option>
                  <option value='PORSCHE'>PORSCHE</option>
                  <option value='BMW'>BMW</option>
                  <option value='AUDI'>AUDI</option>
                </select>
                <div className='invalid-feedback'>
                  {errors.brand && <span>This field is required</span>}
                </div>
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
                  className={errors.drive ? 'is-invalid form-control' : ''}
                  md='9'
                >
                  <FormGroup check inline>
                    <input
                      className='form-check-input'
                      /* eslint-disable-next-line react/jsx-props-no-spreading */
                      {...register('drive', {
                        validate: atLeastOneMediumChecked,
                      })}
                      type='checkbox'
                      value='2wd'
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
                    <input
                      className='form-check-input'
                      /* eslint-disable-next-line react/jsx-props-no-spreading */
                      {...register('drive', {
                        validate: atLeastOneMediumChecked,
                      })}
                      type='checkbox'
                      value='4wd'
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
                    <input
                      className='form-check-input'
                      /* eslint-disable-next-line react/jsx-props-no-spreading */
                      {...register('drive', {
                        validate: atLeastOneMediumChecked,
                      })}
                      type='checkbox'
                      value='awd'
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
                <div className='invalid-feedback'>
                  {errors.drive && (
                    <span>At least one drive selection is required</span>
                  )}
                </div>
              </Col>
            </FormGroup>
            <FormGroup className='required' row>
              <Col md='3'>
                <Label htmlFor='hf-price'>Price</Label>
              </Col>
              <Col className='required' md='9' xs='12'>
                <input
                  className={clsx('form-control', {
                    'is-invalid': errors.price,
                  })}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...register('price', { required: true })}
                  type='text'
                />
                <div className='invalid-feedback'>
                  {errors.price && <span>This field is required</span>}
                </div>
                <FormText className='help-block'>
                  Please enter car price.
                  <strong className='ml-2'>Note</strong>: only allow input
                  numbers
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md='3'>
                <Label htmlFor='hf-image'>Image Url</Label>
              </Col>
              <Col md='9' xs='12'>
                <input
                  className={clsx('form-control', {
                    'is-invalid': errors.imageUrl,
                  })}
                  /* eslint-disable-next-line react/jsx-props-no-spreading */
                  {...register('imageUrl', { required: true })}
                  type='text'
                />
                <div className='invalid-feedback'>
                  {errors.imageUrl && <span>This field is required</span>}
                </div>
                <FormText className='help-block'>
                  Please enter image url.
                  <strong className='ml-2'>Note</strong>: only allow web image
                  url
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
            onClick={handleSubmit(onclickSubmit)}
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
            onClick={handleSubmit(updateCar)}
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
