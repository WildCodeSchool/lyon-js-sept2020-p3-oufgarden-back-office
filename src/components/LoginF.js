import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./style/Login.scss";
import axios from "axios";

require("dotenv").config();

const required = "Ce champs est requis";

const errorMessage = (error) => {
  return <div className="invalid-feedback">{error}</div>;
};

const LoginF = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const url = process.env.REACT_APP_API_BASE_URL;

  const onSubmit = (data) => {
    axios
      .post(`${url}/login`, data)
      .then((res) => {
        console.log(res.data);
        if (res.data === "logged") {
          props.history.push("/adherents");
          setIsLogged(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      <div className="box">
        <h3>Log in</h3>
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
                errors.Email.type === "required" &&
                errorMessage(required)}

              <input
                onChange={(event) => setPassword(event.target.value)}
                value={password}
                className="form-control"
                type="password"
                placeholder="Password"
                name="password"
                ref={register({ required: true })}
              />
              {errors.Password &&
                errors.Password.type === "required" &&
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
