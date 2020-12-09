import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './style/Login.scss';
import axios from 'axios';

require('dotenv').config();

const required = 'Ce champs est requis';

const errorMessage = (error) => {
  return <div className='invalid-feedback'>{error}</div>;
};

const LoginF = () => {
  const { register, handleSubmit, errors } = useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const url = process.env.REACT_APP_API_BASE_URL;

  const onSubmit = (data) => {
    console.log(data);
    axios.post(`${url}/login`).then((res) => {
      res
        .status(200)
        .send('loged')
        .catch((err) => {
          console.log('error log');
        });
    });
  };

  return (
    <div className='container'>
      <div className='box'>
        <h3>Se connecter</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='input-wrapper'>
            <div className='field'>
              <input
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                className='form-control'
                type='email'
                placeholder='Email'
                name='Email'
                ref={register({ required: true, pattern: /^\S+@\S+$/i })}
              />
              {errors.Email &&
                errors.Email.type === 'required' &&
                errorMessage(required)}

              <input
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className='form-control'
                type='password'
                placeholder='Password'
                name='Password'
                ref={register({ required: true })}
              />
              {errors.Password &&
                errors.Password.type === 'required' &&
                errorMessage(required)}

              <div className='form-group'>
                <button type='submit' className='button'>
                  connexion
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginF;
