import React from "react";
//import { Link } from "react-router-dom";

//import { useQuery } from '@apollo/react-hooks';
//import { QUERY_USER } from "../utils/queries";
import JobList from "../components/JobList";
import UserList from "../components/UserList";
//import Cart from "../components/Cart";

import {
  Button,
  Container,
  Header,
  Icon,
} from 'semantic-ui-react'

function Jobs(){
  return (
<<<<<<< HEAD
    <Container text>
 
      <JobList status="Live"/>
      <UserList type="walker"/>
=======
    <Container>
      <JobList status="Live"/>
      <UserList type="Dog Walker"/>

>>>>>>> neeko
   
    </Container>
     
  );
};

export default Jobs;
