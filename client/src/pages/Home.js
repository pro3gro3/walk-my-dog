import React from "react";
import { Link } from "react-router-dom";
import HomepageBanner from "../components/HompageBanner";
import {
  Button,
  Container,
  Header,
  Icon,
} from 'semantic-ui-react';
import JobList from "../components/JobList"
import Auth from "../utils/auth";
import UserList from "../components/UserList";


const Home = () => {
  if(Auth.loggedIn()) {
    return (
      <div className="job-container">
        <div className="flex-child live-jobs">
          <h1 style={{textAlign:'center'}}>Live Jobs</h1>
          <JobList status="Live" 
                    apply="any" 
                    submit= "any" 
                    select="any" 
                    selectme="any" 
                    walker="false"
          />
        </div>
        <div className="flex-child top-walkers">
          <h1 style={{textAlign:'center'}}>Top Walkers</h1>

                    {/* working on this part  */}
          <JobList status="Live" 
                    apply="any" 
                    submit= "any" 
                    select="any" 
                    selectme="any" 
                    walker="true"
                    />
                    {/* working on this part  */}
        </div>
        
      </div>

    );
  } else {
    return (
      <HomepageBanner />
    );
  }
};

export default Home;
