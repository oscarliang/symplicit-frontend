'use client';

import { AxiosError, AxiosResponse } from 'axios';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import { normalize } from 'normalizr';
import React, { ReactElement, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import useSWRMutation from 'swr/mutation';

import { fetchAllCars, fetchAllCarsRestful } from '../../api/car-api';
import CarsTable from '../../components/common/DataTable/CarsTable';
import { updateAllOfCarsAction } from '../../ducks/cars';
import { updateMessage } from '../../ducks/global';
import { updatePermissions } from '../../ducks/permission';
import { carListSchema } from '../../schema';
import {
  findCarByBrandService,
  findCarByDriveService,
  findCarByNameService,
} from '../../service/car-service';
import { logOffService } from '../../service/login-service';
import { useAppDispatch, useAppSelector } from '../../store';
import { NormalizedCarsEntity, RestfulResponse } from '../../types/car';
import { ApiError } from '../../types/common';
import { Permission } from '../../types/permission';
import { keysToCamel } from '../../utils/utils';

function findCarByBrand(url, { arg }: { arg: string }) {
  return findCarByBrandService(arg);
}

function findCarByDrive(url, { arg }: { arg: string }) {
  return findCarByDriveService(arg);
}

function findCarByName(url, { arg }: { arg: string }) {
  return findCarByNameService(arg);
}

function findAllCarService() {
  return fetchAllCars();
}

function SearchPageContainer(): React.ReactElement {
  const [valid, setValid] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [drive2wd, setDrive2wd] = useState(false);
  const [drive4wd, setDrive4wd] = useState(false);
  const [driveAwd, setDriveAwd] = useState(false);
  const [filter, setFilter] = useState('');
  const dispatch = useAppDispatch();
  const allOfCars = useAppSelector((state) => state.cars);
  const router = useRouter();

  // A useSWR + mutate like API, but it will not start the request automatically.
  const { trigger: findCarByBrandTrigger } = useSWRMutation(
    '/findCarByBrand',
    findCarByBrand,
  );
  const { trigger: findCarByDriveTrigger } = useSWRMutation(
    '/findCarByDrive',
    findCarByDrive,
  );
  const { trigger: findCarByNameTrigger } = useSWRMutation(
    '/findCarByName',
    findCarByName,
  );
  const { trigger: findAllCarTrigger } = useSWRMutation(
    '/findAllCar',
    findAllCarService,
  );

  useEffect(() => {
    if (Object.keys(allOfCars).length === 0) {
      fetchAllCarsRestful()
        .then((data) => {
          const resp = keysToCamel(data.data) as RestfulResponse;
          const { allCars } = resp.data;
          if (allCars) {
            const carsEntity = normalize(
              allCars,
              carListSchema,
            ) as NormalizedCarsEntity;
            dispatch(updateAllOfCarsAction(carsEntity));
          }

          const { modules } = resp;
          if (modules) {
            dispatch(updatePermissions(modules as unknown as Permission[]));
          }
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            const apiError = (error.response as AxiosResponse).data as ApiError;
            if (apiError.statusCode === 401) {
              logOffService();
              dispatch(updateMessage(apiError.message));
              // eslint-disable-next-line no-void
              void router.push('/login');
            }
          } else {
            // it was some other kind of error, handle it appropriately
          }
        });
    }
  }, [allOfCars, dispatch, findAllCarTrigger, router]);

  useEffect(() => {
    if (
      !valid &&
      ((name !== '' && filter === 'name') ||
        (brand !== '' && filter === 'brand') ||
        ((drive2wd || drive4wd || driveAwd) && filter === 'drive'))
    ) {
      setValid(true);
    }

    if (
      valid &&
      ((name === '' && filter === 'name') ||
        (brand === '' && filter === 'brand') ||
        (!drive2wd && !drive4wd && !driveAwd && filter === 'drive'))
    ) {
      setValid(false);
    }
  }, [name, brand, drive2wd, drive4wd, driveAwd, valid, filter]);

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleChangeBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrand(e.target.value);
  };

  const handleChangeDrive2wd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrive2wd(e.target.checked);
  };

  const handleChangeDrive4wd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrive4wd(e.target.checked);
  };

  const handleChangeDriveawd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriveAwd(e.target.checked);
  };

  const onClickReset = () => {
    findAllCarTrigger()
      .then((resp) => {
        if (resp) {
          const respData = resp.data.data;
          if (respData) {
            const cars: NormalizedCarsEntity = normalize(
              respData.allCars,
              carListSchema,
            );
            dispatch(updateAllOfCarsAction(cars));
          }
        }
      })
      .catch(() => {
        dispatch(
          updateMessage(
            'Oops! It seems to be some error. Please contact the admin',
          ),
        );
      });
  };

  const onClickSearch = async (): Promise<void> => {
    let drive = '';
    // eslint-disable-next-line default-case
    switch (filter) {
      case 'name':
        try {
          const data = await findCarByNameTrigger(drive);
          const normalizedCars = data?.cars;
          if (normalizedCars) {
            dispatch(updateAllOfCarsAction(normalizedCars));
          }
        } catch (err) {
          dispatch(
            updateMessage(
              'Oops! It seems to be some error. Please contact the admin',
            ),
          );
        }
        break;
      case 'brand':
        try {
          const data = await findCarByBrandTrigger(brand);
          const normalizedCars = data?.cars;
          dispatch(updateAllOfCarsAction(normalizedCars));
        } catch (err) {
          dispatch(
            updateMessage(
              'Oops! It seems to be some error. Please contact the admin',
            ),
          );
        }
        break;
      case 'drive':
        drive += drive2wd ? '2wd|' : '';
        drive += drive4wd ? '4wd|' : '';
        drive += driveAwd ? 'awd|' : '';
        try {
          const data = await findCarByDriveTrigger(drive);
          const normalizedCars = data?.cars;
          if (normalizedCars) {
            dispatch(updateAllOfCarsAction(normalizedCars));
          }
        } catch (err) {
          dispatch(
            updateMessage(
              'Oops! It seems to be some error. Please contact the admin',
            ),
          );
        }
        break;
    }
  };

  const renderFilters = (): ReactElement[] => {
    const filters: string[] = ['name', 'brand', 'drive'];
    return filters.map((filterName: string) => (
      <option key={filterName} value={filterName}>
        {filterName}
      </option>
    ));
  };

  return (
    <>
      <Col xs='12'>
        <Card>
          <CardHeader>
            <strong>Car Search</strong>
            <small> Management</small>
          </CardHeader>
          <CardBody>
            <Row>
              <Col sm='4' xs='12'>
                <FormGroup>
                  <Label htmlFor=''>Find By</Label>
                  <Input
                    className='form-control'
                    id='filter'
                    name='filter'
                    onChange={handleChangeFilter}
                    type='select'
                    value={filter}
                  >
                    <option value=''>Please select</option>
                    {renderFilters()}
                  </Input>
                </FormGroup>
              </Col>
              <Col sm='4' xs='12'>
                <FormGroup>
                  <Label htmlFor=''>Value</Label>
                  <Input
                    className={filter === 'name' ? 'animated fadeIn' : 'd-none'}
                    id='hf-name'
                    name='name'
                    onChange={handleChangeName}
                    type='text'
                    value={name}
                  />
                  <Input
                    className={clsx('form-control', {
                      'animated fadeIn': filter === 'brand',
                      'd-none': filter !== 'brand',
                    })}
                    id='hf-brand'
                    name='brand'
                    onChange={handleChangeBrand}
                    type='select'
                  >
                    <option value=''>Please select</option>
                    <option value='PORSCHE'>PORSCHE</option>
                    <option value='BMW'>BMW</option>
                    <option value='AUDI'>AUDI</option>
                  </Input>
                  <Col
                    className={
                      filter === 'drive' ? 'animated fadeIn' : 'd-none'
                    }
                    md='9'
                  >
                    <FormGroup check inline>
                      <Input
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
                </FormGroup>
              </Col>
              <Col sm='4' xs='12'>
                <FormGroup>
                  <Label htmlFor=''>&nbsp;</Label>
                  <div>
                    <Button
                      color='primary'
                      disabled={!valid}
                      onClick={onClickSearch}
                      type='submit'
                    >
                      Search
                    </Button>
                    <Button
                      className='ml-3'
                      color='danger'
                      onClick={onClickReset}
                      type='reset'
                    >
                      <i className='fa fa-ban' /> Reset
                    </Button>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
      <CarsTable allCars={allOfCars} />
    </>
  );
}

export default SearchPageContainer;
