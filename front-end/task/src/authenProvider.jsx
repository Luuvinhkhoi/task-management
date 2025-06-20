import { Authenticator} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import { AuthContext } from './authContext';
import "@aws-amplify/ui-react/styles.css"

Amplify.configure({
    Auth:{
        Cognito:{
            userPoolId:import.meta.env.VITE_COGNITO_USER_POOL_ID,
            userPoolClientId:import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
            loginWith: {
              username: false,
              email: true,
            },
        }
        
    }
})

const formFields = {
  signUp: {
    given_name: {
      order: 1,
      placeholder: "Enter your firstname",
      label: "Firstname",
      inputProps: { required: true },
    },
    family_name: {
      order: 2, // Đảm bảo lastname có order khác firstname
      placeholder: "Enter your lastname",
      label: "Lastname",
      inputProps: { required: true },
    },
    email: {
      order: 3,
      placeholder: "Enter your email address",
      label: "Email",
      inputProps: { type: "email", required: true },
    },
    password: {
      order: 4,
      placeholder: "Enter your password",
      label: "Password",
      inputProps: { type: "password", required: true },
    },
    confirm_password: {
      order: 5,
      placeholder: "Confirm your password",
      label: "Confirm Password",
    },
    username: {
      order: 6,
      // Ẩn trường username
      style: { display: 'none' },
      label:'',
      inputProps: { type: "username", required: true },
    },
  },
};

export const AuthProvider = ({ children }) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Thêm custom styles */}
      
      <Authenticator formFields={formFields}>
        {({user, signOut})=>
          user?(
            <AuthContext.Provider value={{ user, signOut }}>
              {children}
            </AuthContext.Provider>
          ):(
              <h1>Please sign in below:</h1>
        )}
    </Authenticator>
    </div>
  )
}