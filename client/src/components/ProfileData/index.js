import React from "react";
import { Link, useParams, Redirect } from 'react-router-dom'
import Auth from "../../utils/auth";

//import { pluralize } from "../../utils/helpers"
//import { useStoreContext } from "../../utils/GlobalState";
import { useSelector, useDispatch } from 'react-redux'
import {
    Button,
    Container,
    Popup,
    Rating,
    Header,
    Image,
    Icon,
    Card
  } from 'semantic-ui-react';
import CreateJob from '../CreateJob';
import Upload from "../../utils/upload";

function ProfileData(item) {
  const state = useSelector(state => state)
  const dispatch = useDispatch()
  const userID = Auth.getProfile().data._id;
  const urlID = useParams().id;
  let subString = "amazon";
  
//This is important so any local images will load in both the User Profile AND the other User profile
  if (urlID == userID) {
      return <Redirect to='/profile' />
  }
    if (item.image){
      if (!(item.image.includes(subString))){
        item = {...item, image: "." + item.image};
        console.log("hello");
      }  
    };
    
  

 // item = {...item, image: "hello" + item.image};
  const {
      _id,
      firstName,
      lastName,
      description,
      address,
      email,
      image,
      ratingAvg,
      type,
      hideJobButton
  } = item;
 
 
 

  return (
      
    <div className="profileimg">
      <div className="profilePicContainer">
        <div className="centerprofileimg">
          <Image src={image} alt={description} size='medium' circular />
        </div>
        {/*conditionaly render the image upload only if it is the USERS own page profile */}
        {_id === userID &&
        <div className="editPic"><Popup content='Upload new profile image' trigger={<a>< Upload /></a>} /></div>
        }
    </div>
    <Container className="card-container">
        {/* <img
          alt={description}
          src={`/images/${image}`}
        /> */}
        <h1>{type}</h1>
        <p>{firstName} {lastName}</p>
        <Rating icon='star' defaultRating={ratingAvg} maxRating={5} disabled={true}/>
        {/*conditionaly render the Rating upload only if it is NOT USERS own page profile */}
        {!(_id === userID) &&  
        <Popup content={'Give a rating for '+firstName} trigger={<Button icon='add' />} />
        }
        <p>{description}</p>
        <p>{email}</p>
        <p>{address}</p>
        <div>
          {!hideJobButton && <CreateJob />}
          {/* <button class="ui inverted orange button">Post Job</button> */}
        </div>
        
    </Container>
    </div>
  );
}

export default ProfileData;