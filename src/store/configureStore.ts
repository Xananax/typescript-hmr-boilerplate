
const configureStore = __DEV__ ? 
	require('./configureStore.dev').default : 
	require('./configureStore.prod').default
;

export default configureStore;