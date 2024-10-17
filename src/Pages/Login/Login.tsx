import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { auth } from "../../Firebase/FirebaseSDK";
import {
  FirebaseError,
  FirebaseErrorCodes,
} from "../../types/FirebaseAuthTypes";
import "./Login.css";
import { useNotification } from "../../context/NotificationContext";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .max(40, "The maximum length of 40 characters has been exceeded"),
  password: z
    .string()
    .min(8, "The password must contain at least 8 characters")
    .max(40, "The maximum length of 40 characters has been exceeded"),
});

function Login() {
  const { showNotification } = useNotification();

  const [firebaseStatus, setFirebaseStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const handleFirebaseError = (error: FirebaseError) => {
    switch (error.code) {
      case FirebaseErrorCodes.UserNotFound:
        setFirebaseStatus("The email does not exist.");
        break;
      case FirebaseErrorCodes.WrongPassword:
        setFirebaseStatus("Wrong password.");
        break;
      case FirebaseErrorCodes.TooManyRequests:
        setFirebaseStatus("Too many requests. Please try again later.");
        break;
      case FirebaseErrorCodes.InvalidCredential:
        setFirebaseStatus("Invalid login or password. Please try again later");
        break;
      default:
        console.error(error);
        setFirebaseStatus("An unexpected error occurred. Please try again.");
    }
  };

  async function handleLoginSubmit(data: FieldValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const trimmedEmail = data.email.trim();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        trimmedEmail,
        data.password
      );
      reset();
      if (userCredential.user) {
        navigate("/");
        showNotification("Signed in successfully!", {
          backgroundColor: "green",
          textColor: "white",
          duration: 3000,
        });
      } else {
        setFirebaseStatus("User not found. Please try again.");
      }
    } catch (error) {
      const err = error as FirebaseError;
      if (err.code) {
        console.error(err.message);
        handleFirebaseError(err);
      } else {
        console.error(err);
        setFirebaseStatus("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-container">
      <form
        onSubmit={handleSubmit(handleLoginSubmit)}
        noValidate
        className="login-form"
      >
        <h1 className="form-title">Sign in</h1>
        <input
          autoComplete="email"
          placeholder="e-mail"
          {...register("email")}
          type="email"
          className="form-input"
        />
        {errors.email && (
          <p className="error-text">{errors.email.message?.toString()}</p>
        )}
        <input
          autoComplete="current-password"
          placeholder="password"
          {...register("password")}
          type="password"
          className="form-input"
        />
        {errors.password && (
          <p className="error-text">{errors.password.message?.toString()}</p>
        )}
        <div>
          <button
            onClick={() => setFirebaseStatus(null)}
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            Sign in
          </button>
        </div>
        <p className="error-text">{firebaseStatus}</p>
      </form>
    </main>
  );
}

export default Login;
