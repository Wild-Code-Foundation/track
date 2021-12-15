import React from "react";
import Map from './Map';
import AddOrganisation from './AddOrganisation';
import { gql, useQuery } from "@apollo/client";

const GET_ORG = gql`
{
    OrganizationUsers {
      Organization {
        name
        config
      }
    }
  }
`;

function TrackApp() {
    const {data, loading, error} = useQuery(GET_ORG);
    if (loading) return "Loading Wild Code Track...";
    if (error) return JSON.stringify(error);
    if (data.OrganizationUsers.length) {
        return <Map config={data.OrganizationUsers[0].Organization.config} />
    } else {
        return (
            <AddOrganisation />
        );
    }
    
};

export default TrackApp;