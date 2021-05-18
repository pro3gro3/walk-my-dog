import React, { useEffect } from "react";
import UserItem from "../UserItem";
//import { useStoreContext } from "../../utils/GlobalState";
import { useSelector, useDispatch } from 'react-redux'
import { UPDATE_USERS } from "../../utils/actions";
import { useQuery } from '@apollo/react-hooks';
import { QUERY_USERS } from "../../utils/queries";
import { idbPromise } from "../../utils/helpers";
import spinner from "../../assets/spinner.gif"


function UserList(props) {

  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const { loading, data } = useQuery(QUERY_USERS);

  useEffect(() => {
    if(data) {
      dispatch({
          type: UPDATE_USERS,
          users: data.users
        });
        data.users.forEach((user) => {
          idbPromise('users', 'put', user);
        });
    } else if (!loading) {
      idbPromise('users', 'get').then((users) => {
        dispatch({
          type: UPDATE_USERS,
          users: users
       });
      });
    }
  }, [data, loading, dispatch]);

  function filterUsers() {
    return state.users.filter(user => user.type === props.type);
  }


  return (
    <div className="my-2">
   
      {state.users.length ? (
        <div className="flex-row"> 
            {filterUsers().map(user => (
                <UserItem type={props.type} 
                          job_id={props.job_id} 
                          job_price={props.job_price}  
                          selectedUser={props.selectedUser}
                  key= {user._id}
                  _id={user._id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  description={user.description}
                  address={user.address}
                  email={user.email}
                  image={user.image}
                  type={user.type}
                  appliedJobs={user.appliedJobs}
                />
            ))}
        </div>
      ) : (
        <h3>You haven't added any users yet!</h3>
      )}
      { loading ? 
      <img src={spinner} alt="loading" />: null}
    </div>
  );
}

export default UserList;
