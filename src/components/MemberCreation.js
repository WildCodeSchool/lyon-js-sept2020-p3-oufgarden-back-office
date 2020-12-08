import React from "react";
import { useForm } from "react-hook-form";

// Messages
const required = "This field is required";
const maxLength = "Your input exceed maximum length";

// Error Component
const errorMessage = (error) => {
  return <div className="invalid-feedback">{error}</div>;
};

const MemberCreation = () => {
  const { register, errors, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  console.log(errors);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>First Name :</label>
        <input
          type="text"
          name="Firstname"
          ref={register({ required: true, maxLength: 80 })}
        />
        {errors.Firstname &&
          errors.Firstname.type === "required" &&
          errorMessage(required)}
        {errors.Firstname &&
          errors.Firstname.type === "maxLength" &&
          errorMessage(maxLength)}

        <label>Last name</label>
        <input
          type="text"
          name="Lastname"
          ref={register({ required: true, maxLength: 100 })}
        />
        {errors.Lastname &&
          errors.Lastname.type === "required" &&
          errorMessage(required)}
        {errors.Lastname &&
          errors.Lastname.type === "maxLength" &&
          errorMessage(maxLength)}

        <label>Email</label>
        <input
          type="text"
          name="Email"
          ref={register({
            required: true,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
        />
        {errors.Email &&
          errors.Email.type === "required" &&
          errorMessage(required)}

        <input type="submit" />
      </form>
    </div>
  );
};

export default MemberCreation;
