import React from "react";
import { Link } from "react-router-dom";
import {
    Button,
    Container,
    Header,
    Icon,
    Image
} from 'semantic-ui-react';

const HomepageBanner = () =>{
    return(
        <div className="background-image">
            <Container text
                style={{
                    paddingTop:'10em',
                    paddingLeft:'30em',
                    paddingBottom:'2em'
                }}
            >
                <Header
                    as='h1'
                    content='Dog Dash'
                    style={{
                        fontSize: '4em',
                        fontWeight: 'bold',
                        marginBottom: 0,
                        paddingTop: '1em',
                        color:'lightseagreen',
                        fontFamily: 'Roboto Mono,sans-serif'
                    }}
                />
                <p style={{
                    fontWeight: 'normal',
                    color:'white',
                    fontSize: '1em',
                    
                   
                }}>
                    Can't find the time to walk your fur friend? <br/> 
                    Dog Dash is here to assist you with finding a suitable walker for your dog!
                </p>

                <Link to="/login">
                    <Button color='teal' size='huge' fontFamily= 'Roboto Mono,sans-serif'>
                        Register
                        <Icon name='right arrow' />
                    </Button>
                </Link>            
            </Container>
        </div>

    )
}

export default HomepageBanner;