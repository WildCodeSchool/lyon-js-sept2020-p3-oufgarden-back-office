import React, { useState } from 'react';
/* import { useQuery } from 'react-query'; */
import { useForm } from 'react-hook-form';
import './style/Login.scss';
import API from '../services/API';
// import { UserContext } from './_context/UserContext';

const required = 'Ce champs est requis';

const errorMessage = (error) => {
  return <div className="invalid-feedback">{error}</div>;
};

const Login = (props) => {
  // const { setIsAdmin } = useContext(UserContext);
  const { register, handleSubmit, errors } = useForm();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isLogged, setIsLogged] = useState(false);

  const onSubmit = (data) => {
    API.post('/login', data)
      .then((res) => {
        if (res.data === 'logged') {
          // setIsAdmin(true);
          setIsLogged(true);

          props.history.push('/adherents');
        }
      })
      .catch((err) => {
        console.error(err);
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
              <div className="stay-connected-container">
                <div className="stay-connected">
                  <label htmlFor="stayConnected">
                    <input
                      ref={register}
                      name="stayConnected"
                      id="stayConnected"
                      type="checkbox"
                    />
                    Stay connected ?
                  </label>
                </div>
              </div>

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

export default Login;
