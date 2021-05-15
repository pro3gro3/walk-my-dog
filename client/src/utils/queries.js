import gql from 'graphql-tag';


export const QUERY_JOBS = gql`
  {
    jobs {
      _id
      user_id
      description
      price
      date
      status
      appliedUsers
      selectedUser
   
    }
  }
`;

export const QUERY_USERS = gql`
  {
    users {
      _id
      firstName
      lastName
      description
      address
      email
      image
      type
      submittedJobs{
        description
        price
        date
        status
      }
      appliedJobs{
        description
        price
        date
        status
      }
      selectedJobs{
        description
        price
        date
        status
      }
      orders {
        _id
        purchaseDate
        jobs {
          _id
          description
          price
          date
          status
        }
      }
    }
  }
`;



export const QUERY_CHECKOUT = gql`
  query getCheckout($jobs: [ID]!) {
    checkout(jobs: $jobs) {
      session
    }
  }
`;



export const QUERY_USER = gql`
{
  user {
    firstName
    lastName
    orders {
      _id
      purchaseDate
    }
  }
}
`;