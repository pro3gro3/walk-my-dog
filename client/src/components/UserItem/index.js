import React, { useEffect } from "react";
import { Card, Icon } from 'semantic-ui-react';
import { Link } from "react-router-dom";
//import { pluralize } from "../../utils/helpers"
//import { useStoreContext } from "../../utils/GlobalState";
import { useMutation, useQuery } from '@apollo/react-hooks';
import { idbPromise } from "../../utils/helpers";
import { useSelector, useDispatch } from 'react-redux'
import { QUERY_WALKERJOBS} from '../../utils/queries';
import { SELECT_WALKER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import { ADD_TO_CART,  UPDATE_WALKERJOBS } from "../../utils/actions";


function UserItem(item) {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const { loading, data } = useQuery(QUERY_WALKERJOBS);

  // Gets from DB and updates the jobwalkers info in the global state and indexed db
  useEffect(() => {
    if(data) {
      dispatch({
          type: UPDATE_WALKERJOBS,
          walkerjobs: data.walkerjobs
        });
        data.walkerjobs.forEach((walkerjob) => {
         idbPromise('walkerjobs', 'put', walkerjob);
         });
    } else if (!loading) {
       idbPromise('walkerjobs', 'get').then((walkerjobs) => {
         dispatch({
           type: UPDATE_WALKERJOBS,
           walkerjobs: walkerjobs
        });
       });
    }
  }, [data, loading, dispatch]);

  const {
      apply,
      job_id,
      job_price,
      selectedUser,
      _id,
      firstName,
      lastName,
      description,
      address,
      email,
      image,
      type,
      appliedJobs
  } = item;

  const [selectWalker] = useMutation(SELECT_WALKER);

   // check if the user being displayed applied to the job
function updateappliedB() {
  if (!appliedJobs) {return false}
  let appliedB = false
  for (var i = 0; i < appliedJobs.length; i++) {
    
        if ( appliedJobs[i]== job_id  ) 
            {appliedB= true}
    }
  return appliedB
}

//check if the user was selected for the job
function userSelected() {
  let walkerjob= state.walkerjobs.filter(walkerjob => {
    return (walkerjob.job_id == job_id && walkerjob.walker_id == _id );
    })
  if (walkerjob) 
  {return walkerjob[0]?.select || false} 
  else {return false}
} 


// creates the jobwalker element to be added to the global state and the indexed db in case of change (add/withdraw)
function initialwalkerjob() {
  let walkerjob = {
    _id:"new"+_id+job_id,
    walker_id: _id,
    job_id:job_id,
    apply:true,
    select:false
  }
if (updateappliedB() ==true) {
        walkerjob= state.walkerjobs.filter(walkerjob => {
              return (walkerjob.job_id == job_id && walkerjob.walker_id == _id );
              }
)};
return walkerjob
}

function newwalkerjob() {
return {...initialwalkerjob(),select:true }
}

// gets the previously selected walker for the job
function initialpreviouslyselected() {
let walkerjob= state.walkerjobs.filter(walkerjob => {
              return (walkerjob.job_id == job_id && walkerjob.select == "true" );
        })
return walkerjob;
};

function newpreviouslyselected() {
  return {...initialpreviouslyselected(),select:false }
  }
  

// Select a walker for a job
const selectWalkerForJob = async () => {
  const token = Auth.loggedIn() ? Auth.getToken() : null;
      if (!token) {
        return false;
      }
      try {
        await selectWalker({
          variables: { walker_id:_id, job_id:job_id}
        });

        // change the previously selected walker to being not selected
        if(initialpreviouslyselected().length){
            dispatch({
              type: UPDATE_WALKERJOBS,
              walkerjobs:  state.walkerjobs.filter(walkerjob => {
                              return (walkerjob._id !== initialpreviouslyselected()._id );
                            })
            });
            idbPromise('walkerjobs', 'delete', initialpreviouslyselected() );
            
            dispatch({
              type: UPDATE_WALKERJOBS,
              walkerjobs:  [...state.walkerjobs, newpreviouslyselected()]
            });
            idbPromise('walkerjobs', 'put', newpreviouslyselected());
        }
    
        // change the currently selected walker to become selected
        dispatch({
          type: UPDATE_WALKERJOBS,
          walkerjobs:  state.walkerjobs.filter(walkerjob => {
                          return (walkerjob.job_id !== job_id && walkerjob.walker_id !== _id );
                        })
        });
 
        idbPromise('walkerjobs', 'delete', initialwalkerjob()[0] );
        dispatch({
          type: UPDATE_WALKERJOBS,
          walkerjobs:  [...state.walkerjobs, newwalkerjob()]
        });
         idbPromise('walkerjobs', 'put', newwalkerjob()[0]);
      } catch (e) {
        console.error(e);
      }
};


function filterUser() {
  if (apply=="any" || (apply=="true" && updateappliedB()))
  {return true}
  else {return false}
}

// Add items to cart

let newcartitem ={
  image: image,
    name: firstName + " " + lastName,
    _id: _id,
    price: job_price,
    quantity: 1
}
const { cart } = state

const addToCart = () => {
  /*const itemInCart = cart.find((cartItem) => cartItem._id === _id)
  if (itemInCart) {
    dispatch({
      type: UPDATE_CART_QUANTITY,
      _id: _id,
      purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
    });
    idbPromise('cart', 'put', {
      ...itemInCart,
      purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
    });
  } else {*/
    dispatch({
      type: ADD_TO_CART,
      user: { ...newcartitem }
    });
    idbPromise('cart', 'put', { ...newcartitem });
  //}
}


if (!filterUser()){return null}

  return (
    //<Link to={`/users/${_id}`}></Link>
    <>
    <Card
        image={image ? image : 'https://placedog.net/500'}
        header = {email} 
        meta={`${firstName}  ${lastName}`}
        description={description}
        
      />
      { (Auth.loggedIn() && userSelected()== true && (apply=="true")) ? 
          (<button>Selected</button>)
          :null
      }
      { (Auth.loggedIn() && userSelected()== true && (apply=="true")) ? 
          (<button onClick={addToCart}>Add to cart</button>)
          :null
      }
      { (Auth.loggedIn() && userSelected()== false && (apply=="true")) ? 
        (<button onClick={selectWalkerForJob}>Select</button>):null
      }
    </>
    
  );
}

export default UserItem;


