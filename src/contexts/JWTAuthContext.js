import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

const initialAuthState = {
  isInitialized: false,
};

const handlers = {
  INITIALIZE: (state, action) => {
    return {
      ...state,
      isInitialized: true,
    };
  },
  
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
  ...initialAuthState,
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = async () => {  
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
            }
          });
        
      }

    initialize();
  }, []);

  
  return (
    <AuthContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
