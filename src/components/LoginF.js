import React, { useState } from 'react';
/* import { useQuery } from 'react-query'; */
import { useForm } from 'react-hook-form';
import './style/Login.scss';
import API from '../services/API';

const required = 'Ce champs est requis';

const errorMessage = (error) => {
  return <div className="invalid-feedback">{error}</div>;
};

const LoginF = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isLogged, setIsLogged] = useState(false);

  const onSubmit = (data) => {
    API.post('/login', data)
      .then((res) => {
        console.log(res.data);
        if (res.data === 'logged') {
          props.history.push('/adherents');
          setIsLogged(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="containerLogin">
      <div className="boxLogin">
        <h3>Se connecter</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-wrapper">
            <div className="field">
              <input
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                className="form-control"
                type="email"
                placeholder="Email"
                name="email"
                ref={register({ required: true, pattern: /^\S+@\S+$/i })}
              />
              {errors.Email &&
                errors.Email.type === 'required' &&
                errorMessage(required)}

              <input
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className="form-control"
                type="password"
                placeholder="Mot de passe"
                name="password"
                ref={register({ required: true })}
              />
              {errors.Password &&
                errors.Password.type === 'required' &&
                errorMessage(required)}

              <div className="form-group">
                <button type="submit" className="button">
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
