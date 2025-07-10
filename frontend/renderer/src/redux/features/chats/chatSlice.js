import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [], // last 2 days
    // TODO: Adding Load state that loads more data of the user 
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);

        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
});

export const { addMessage, setMessages, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
