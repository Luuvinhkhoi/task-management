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
    email: {
      order: 0,
      placeholder: "Enter your email",
      label: "Email", 
      inputProps: { required: true },
    },
    given_name: {
      order: 1,
      placeholder: "Enter your firstname",
      label: "Firstname", 
      inputProps: { required: true },
    },
    family_name: {
      order: 2,
      placeholder: "Enter your lastname",
      label: "Lastname",
      inputProps: { required: true },
    },
    password: {
      order:3,
      placeholder: "Enter your password",
      label: "Password",
      inputProps: { type: "password", required: true },
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password", 
      label: "Confirm Password",
      inputProps: { type: "password", required: true },
    },
  },
};

export const AuthProvider = ({ children }) => {
  return (
    <div style={{height:'100vh', overflow:'auto', marginTop: '1rem' }}>
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