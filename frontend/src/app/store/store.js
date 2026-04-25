import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/authSlice';
import researchReducer from '../../features/research/researchSlice';
import eventReducer from '../../features/events/eventSlice';
import newsReducer from '../../features/news/newsSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        research: researchReducer,
        events: eventReducer,
        news: newsReducer,
    }
});

export default store;