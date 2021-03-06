import React, { useEffect } from "react";
import { Card, Icon, Image, Button, Rating } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { useMutation, useQuery } from "@apollo/react-hooks";
import { idbPromise } from "../../utils/helpers";
import { useSelector, useDispatch } from "react-redux";
import { QUERY_WALKERJOBS } from "../../utils/queries";
import { SELECT_WALKER } from "../../utils/mutations";
import Auth from "../../utils/auth";
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_WALKERJOBS,
} from "../../utils/actions";

function UserItem(item) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const { loading, data } = useQuery(QUERY_WALKERJOBS);
  const [selectWalker] = useMutation(SELECT_WALKER);

  // Gets from DB and updates the jobwalkers info in the global state and indexed db
  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_WALKERJOBS,
        walkerjobs: data.walkerjobs,
      });
      data.walkerjobs.forEach((walkerjob) => {
        idbPromise("walkerjobs", "put", walkerjob);
      });
    } else if (!loading) {
      idbPromise("walkerjobs", "get").then((walkerjobs) => {
        dispatch({
          type: UPDATE_WALKERJOBS,
          walkerjobs: walkerjobs,
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
    ratingAvg,
    image,
    type,
    appliedJobs,
  } = item;

  // check if the user being displayed applied to the job
  function updateappliedB() {
    if (!appliedJobs) {
      return false;
    }
    let appliedB = false;
    for (var i = 0; i < appliedJobs.length; i++) {
      if (appliedJobs[i] == job_id) {
        appliedB = true;
      }
    }
    return appliedB;
  }

  //check if the user was selected for the job
  function userSelected() {
    let walkerjob = state.walkerjobs.filter((walkerjob) => {
      return walkerjob.job_id == job_id && walkerjob.walker_id == _id;
    });
    if (walkerjob) {
      return walkerjob[0]?.select || false;
    } else {
      return false;
    }
  }

  //check if the user was selected for the job
  function jobStatus() {
    let job = state.jobs.filter((job) => {
      return job._id == job_id;
    });
    if (job) {
      return job[0]?.status || false;
    } else {
      return false;
    }
  }

  // creates the jobwalker element to be added to the global state and the indexed db in case of change (add/withdraw)
  function initialwalkerjob() {
    let walkerjob = {
      _id: "new" + _id + job_id,
      walker_id: _id,
      job_id: job_id,
      apply: true,
      select: false,
    };
    if (updateappliedB() == true) {
      walkerjob = state.walkerjobs.filter((walkerjob) => {
        return walkerjob.job_id == job_id && walkerjob.walker_id == _id;
      });
    }
    return walkerjob;
  }

  function newwalkerjob() {
    return { ...initialwalkerjob(), select: true };
  }

  // gets the previously selected walker for the job
  function initialpreviouslyselected() {
    let walkerjob = state.walkerjobs.filter((walkerjob) => {
      return walkerjob.job_id == job_id && walkerjob.select == "true";
    });
    return walkerjob;
  }

  function newpreviouslyselected() {
    return { ...initialpreviouslyselected(), select: false };
  }

  //selected user in cart
  function inCart() {
    if (state.cart.length) {
      for (var i = 0; i < state.cart.length; i++) {
        if ((state.cart[i]._id == _id, state.cart[i].job_id == job_id)) {
          return true;
        } else return false;
      }
    } else return false;
  }

  // Select a walker for a job
  const selectWalkerForJob = async () => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }
    try {
      await selectWalker({
        variables: { walker_id: _id, job_id: job_id },
      });

      // change the previously selected walker to being not selected
      if (initialpreviouslyselected().length) {
        dispatch({
          type: UPDATE_WALKERJOBS,
          walkerjobs: state.walkerjobs.filter((walkerjob) => {
            return walkerjob._id !== initialpreviouslyselected()._id;
          }),
        });
        idbPromise("walkerjobs", "delete", initialpreviouslyselected());

        dispatch({
          type: UPDATE_WALKERJOBS,
          walkerjobs: [...state.walkerjobs, newpreviouslyselected()],
        });
        idbPromise("walkerjobs", "put", newpreviouslyselected());
      }

      // change the currently selected walker to become selected
      dispatch({
        type: UPDATE_WALKERJOBS,
        walkerjobs: state.walkerjobs.filter((walkerjob) => {
          return walkerjob.job_id !== job_id && walkerjob.walker_id !== _id;
        }),
      });

      idbPromise("walkerjobs", "delete", initialwalkerjob()[0]);
      dispatch({
        type: UPDATE_WALKERJOBS,
        walkerjobs: [...state.walkerjobs, newwalkerjob()],
      });
      idbPromise("walkerjobs", "put", newwalkerjob()[0]);

      window.location.reload(false);
    } catch (e) {
      console.error(e);
    }
    window.location.reload(false);
  };

  // Add items to cart

  let newcartitem = {
    image: image,
    name: firstName + " " + lastName,
    _id: _id,
    job_id: job_id,
    price: job_price,
    quantity: 1,
  };
  const { cart } = state;

  const addToCart = () => {
    dispatch({
      type: ADD_TO_CART,
      user: { ...newcartitem },
    });
    idbPromise("cart", "put", { ...newcartitem });
    //}
  };

  const removeFromCart = (item) => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: item._id,
    });
    idbPromise("cart", "delete", { ...item });
  };

  function filterUser() {
    if (apply == "any" || (apply == "true" && updateappliedB())) {
      return true;
    } else {
      return false;
    }
  }

  if (!filterUser()) {
    return null;
  }

  return (
    <>
      <Card style={{ margin: "10px 0" }}>
        <Card.Content>
          <Image
            floated="right"
            size="mini"
            src={image ? image : "https://placeimg.com/50/50/people/grayscale"}
          />
          <Link to={`/profile/${_id}`}>
            <Card.Header>{`${firstName}  ${lastName}`}</Card.Header>
          </Link>
          <Rating
            icon="star"
            defaultRating={ratingAvg}
            maxRating={5}
            disabled={true}
          />
          <Card.Meta>{email}</Card.Meta>
          <Card.Description>{description}</Card.Description>
        </Card.Content>

        {Auth.loggedIn() && (
          <Card.Content extra>
            <div className="ui two buttons">
              {userSelected() == true && apply == "true" && (
                <Button basic color="green" disabled>
                  {" "}
                  Selected
                </Button>
              )}
              {jobStatus() == "Live" &&
                userSelected() == true &&
                apply == "true" &&
                inCart() == false && (
                  <Button color="green" onClick={addToCart}>
                    {" "}
                    Add to Cart
                  </Button>
                )}
              {jobStatus() == "Live" &&
                userSelected() == true &&
                apply == "true" &&
                inCart() == true && (
                  <Button
                    color="red"
                    onClick={() => removeFromCart(newcartitem)}
                  >
                    {" "}
                    Remove from Cart
                  </Button>
                )}
              {jobStatus() == "Live" &&
                userSelected() == false &&
                apply == "true" && (
                  <Button color="green" onClick={selectWalkerForJob}>
                    {" "}
                    Select Walker
                  </Button>
                )}
            </div>
          </Card.Content>
        )}
      </Card>
    </>
  );
}

export default UserItem;
