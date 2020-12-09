import React from "react";
import { useForm } from "react-hook-form";
import "./style/Login.scss";

const required = "Ce champs est requis";

const errorMessage = (error) => {
  return <div className="invalid-feedback">{error}</div>;
};

const LoginF = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="container">
      <div className="box">
        <h3>Se connecter</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-wrapper">
            <div className="field">
              <input
                className="form-control"
                type="email"
                placeholder="Email"
                name="Email"
                ref={register({ required: true, pattern: /^\S+@\S+$/i })}
              />
              {errors.Email &&
                errors.Email.type === "required" &&
                errorMessage(required)}

              <input
                className="form-control"
                type="password"
                placeholder="Password"
                name="Password"
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
