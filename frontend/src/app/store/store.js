import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import researchReducer from '../../features/research/researchSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        research: researchReducer,
    }
});

export default store;