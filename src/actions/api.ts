import assign from '../utils/assign';

const api = 
	{ async:(payload,meta,getState,actions,dispatch)=>
		{
			const {app_id,app_secret,page_name} = payload;
			function sendErr(field){
				return actions.error(`${field} is required`,{field});
			}
			if(!app_id){return sendErr('app_id');}
			if(!app_secret){return sendErr('app_secret');}
			if(!page_name){return sendErr('page_name');}
			const access_token = `${app_id}|${app_secret}`;
			const url = `https://graph.facebook.com/${page_name}/?access_token=${access_token}`;
			return fetch(url).then(res=>res.json());
		}
	,	state:
		{ answer: false
		, app_id:true
		, app_secret:true
		, page_name:true
		}
	,	actions:
			{ success(state,payload,meta)
				{
					return (
						{ answer:payload
						, app_id:true
						, app_secret:true
						, page_name:true
						}
					)
				}
			, error(state,payload,meta)
				{
					const {field} = meta;
					return {[field]:false}
				}
			}
	};

export default api;