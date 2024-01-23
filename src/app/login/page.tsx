'use client';

import { AxiosError, AxiosResponse } from 'axios';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'reactstrap';

import { updateMessage } from '../../ducks/global';
import { loginAction } from '../../ducks/login';
import { updatePermissions } from '../../ducks/permission';
import { logOffService, loginService } from '../../service/login-service';
import { useAppDispatch, useAppSelector } from '../../store';
import { ApiError } from '../../types/common';
import { User } from '../../types/login';
import { Permission } from '../../types/permission';
import useToken from '../../utils/hooks';

function LoginContainer(): React.ReactElement {
  const { message } = useAppSelector((state) => state.global);
  const { isAuthenticated } = useAppSelector((state) => state.authenticated)
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm();
  const { setToken } = useToken();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/homepage')
    }
  },[isAuthenticated, router])

  const onclickSubmit = (data) => {
    const user = data as User;
    loginService(user)
      .then((login) => {
        if (!login.accessToken) {
          // eslint-disable-next-line no-void
          void router.push('/login');
        }

        setToken(login.accessToken);
        dispatch(updateMessage(''));
        dispatch(updatePermissions(login.modules as unknown as Permission[]));
        dispatch(loginAction(true));
      })
      .catch((error: Error | AxiosError) => {
        logOffService();
        if (error instanceof AxiosError) {
          const apiError = (error.response as AxiosResponse).data as ApiError;
          if (apiError.statusCode === 401) {
            dispatch(updateMessage(apiError.message));
          }
        } else {
          // it was some other kind of error, handle it appropriately
        }
      });
  };

  return (
    <div className='app flex-row align-items-center'>
      <Container>
        <Row className='justify-content-center'>
          <Col md='8'>
            <Form onSubmit={handleSubmit(onclickSubmit)}>
              <CardGroup className='mb-4'>
                <Card className='p-4'>
                  <CardBody>
                    <h1>Login</h1>
                    <p className='text-muted'>Sign In to your account</p>
                    <InputGroup className='mb-3'>
                      <div className='input-group-prepend'>
                        <span className='input-group-text'>
                          <i className='icon-user' />
                        </span>
                      </div>
                      <input
                        className={clsx('form-control', {
                          'is-invalid': errors.username,
                        })}
                        name='username'
                        placeholder='Username'
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...register('username', { required: true })}
                        type='text'
                      />
                      <div className='invalid-feedback'>
                        {errors.username && <span>This field is required</span>}
                      </div>
                    </InputGroup>
                    <InputGroup className='mb-4'>
                      <div className='input-group-prepend'>
                        <span className='input-group-text'>
                          <i className='icon-lock' />
                        </span>
                      </div>
                      <input
                        autoComplete='on'
                        className={clsx('form-control', {
                          'is-invalid': errors.password,
                        })}
                        name='password'
                        placeholder='Password'
                        type='password'
                        /* eslint-disable-next-line react/jsx-props-no-spreading */
                        {...register('password', {
                          pattern:
                            // eslint-disable-next-line max-len
                            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&~])[A-Za-z\d@$!%*#?&~]{8,}$/,
                          required: true,
                        })}
                      />
                      <div className='invalid-feedback'>
                        {errors.password && (
                          <span>
                            Minimum eight characters, at least one letter, one
                            number and one special character
                          </span>
                        )}
                      </div>
                    </InputGroup>
                    <Row>
                      <Col xs='6'>
                        <Button className='px-4' color='primary' type='submit'>
                          Login
                        </Button>
                      </Col>
                      <Col className='text-right' xs='6'>
                        <Button className='px-0' color='link'>
                          Forgot password?
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card
                  className='text-white bg-primary py-5 d-md-down-none'
                  style={{ width: `${44}%` }}
                >
                  <CardBody className='text-center'>
                    <div>
                      <h2>Sign up</h2>
                      <p>
                        Our world is in flux, this constant change creates
                        ever-rising demands along with ever-emerging
                        opportunities. We partner with you to navigate the new,
                        conquer the complexity, evolve your experience to
                        expectations. We’ll help you stay ahead.
                      </p>
                      <Button active className='mt-3' color='primary'>
                        Register Now!
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Form>
            {message && <Alert color='primary'>{message}</Alert>}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginContainer;
