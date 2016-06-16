import assign from '../utils/assign';

const notes =
	{ state:
		{ notes:
			[0, 1, 2]
		, notesById:
			[
				{ id: 0
				, name: 'ddddddd'
				}
			,	{ id: 1
				, name: 'Dr.Dre'
				}
			,	{ id: 2
				, name: 'Big Pun'
				}
			]
		}
	, actions:
		{ add(state,payload)
			{
				const len = state.notes.length ? state.notes.length : 1;
				const newId = (state.notes[len - 1] + 1) || 0;
				return (
					{ notes: state.notes.concat(newId)
					, notesById: 
						[ ...state.notesById
						,	{ id:newId
							, name:payload.name
							, starred:false
							}
						]
					}
				);
			}
		, remove(state,payload)
			{
				return (
					{ notes: state.notes.filter((id) => id !== payload.id)
					, notesById: state.notesById.filter((note) => note.id !== payload.id)
					}
				);
			}
		, star(state,payload)
			{
				return (
					{ notesById:
						state.notesById.map
							( note => 
								( note.id === payload.id ) ? 
									assign(note,{starred: !note.starred}) : 
									note 
							)
					}
				)
			}
		}
	}

export default notes;