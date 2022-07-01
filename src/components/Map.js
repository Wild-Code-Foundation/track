import React, { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { Row, Col, Div, Button, Icon, Input, Modal, Text, Notification } from "atomize";
import logo from "../logo.jpeg";
import SensorList from "./SensorList";
import { gql, useMutation } from "@apollo/client";

const UPDATE_ORG_CONFIG = gql`
  mutation updateConfig($config: jsonb!, $id: Int!) {
    update_Organization_by_pk(_set: {config: $config}, pk_columns: {id: $id}) {
      config
    }
  }`
;

const SetLocationModal = ({ isOpen, onClose, setShowLocationUpdateNotification, viewport, id }) => {
  const [updateConfig, {loading, data, error}] = useMutation(UPDATE_ORG_CONFIG, {
    onCompleted: () => {
      onClose();
      setShowLocationUpdateNotification(true)
    }
  });
  const handleMutation = () => {
    updateConfig({
      variables: {
        id, 
        config: viewport
      }
    })
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} align="start" rounded="md">
      <Icon
        name="Cross"
        pos="absolute"
        top="1rem"
        right="1rem"
        size="16px"
        onClick={onClose}
        cursor="pointer"
      />
      <Div d="flex" m={{ b: "4rem" }}>
        <Icon
          name="AlertSolid"
          color="warning700"
          m={{ t: "0.35rem", r: "0.5rem" }}
        />
        <Text p={{ l: "0.5rem", t: "0.25rem" }} textSize="subheader">
          This will set the new map location and zoom level to what is currently displayed.
        </Text>
      </Div>
      <Div d="flex" justify="flex-end">
        <Button
          onClick={onClose}
          bg="gray200"
          textColor="medium"
          disabled={loading}
          m={{ r: "1rem" }}
        >
          Cancel
        </Button>
        <Button onClick={handleMutation} bg="info700">
          {loading ? "Loading..." : "Yes, continue"}
        </Button>
      </Div>
    </Modal>
  );
};

function MapEvents({ setViewport, viewport }) {
  const map = useMapEvents({
    moveend() {
      setViewport({
        center: map.getCenter(),
        zoom: map.getZoom(),
      });
    },
    
  });
  return null;
}

const setPreferences = (view) => {};

function Map({ organisation: {config, id, name} }) {
  const [showSetLocationModal, setShowLocationModal] = useState(false);
  const [showLocationUpdateNotification, setShowLocationUpdateNotification] = useState(false);
  const [map, setMap] = useState(null)
  const [viewport, setViewport] = useState(config);
  return (
    <>
      <SetLocationModal
          viewport={viewport}
          id={id}
          isOpen={showSetLocationModal}
          setShowLocationUpdateNotification={setShowLocationUpdateNotification}
          onClose={() => setShowLocationModal(false)}
        />
        <Notification
          bg="success100"
          textColor="success800"
          isOpen={showLocationUpdateNotification}
          onClose={() => setShowLocationUpdateNotification(false)}
          prefix={
            <Icon
              name="Success"
              color="success800"
              size="18px"
              m={{ r: "0.5rem" }}
            />
          }
        >
          Location updated successfully
        </Notification>
      <Row>
        <Col size="2">
          <Div p="1rem" minH={{ xs: "auto", md: "100vh" }}>
            <Div bgImg={logo} bgSize="cover" bgPos="center" h="10rem" />
            <Div p="1rem">
              <Input
                placeholder="Search"
                suffix={
                  <Icon
                    name="Search"
                    size="20px"
                    cursor="pointer"
                    onClick={() => console.log("clicked")}
                    pos="absolute"
                    top="50%"
                    right="1rem"
                    transform="translateY(-50%)"
                  />
                }
              />
            </Div>
            <SensorList />
            <Div p="1rem" pos="fixed" bottom="0">
              <Row>
                <Col>
                  <Button
                    h="2rem"
                    w="2rem"
                    bg="warning700"
                    hoverBg="warning600"
                    rounded="circle"
                    m={{ r: "1rem" }}
                    shadow="2"
                    hoverShadow="4"
                    onClick={() =>
                      setShowLocationModal({ showSetLocationModal: true })
                    }
                  >
                    <Icon name="Location" size="20px" color="white" />
                  </Button>
                </Col>
                <Col>
                  <Button
                    h="2rem"
                    w="2rem"
                    bg="success700"
                    hoverBg="success600"
                    rounded="circle"
                    m={{ r: "1rem" }}
                    shadow="2"
                    hoverShadow="4"
                    onClick={() => map.setView(config.center, config.zoom)}
                  >
                    <Icon name="Home" size="20px" color="white" />
                  </Button>
                </Col>
                <Col>
                  <Button
                    h="2rem"
                    w="2rem"
                    bg="info700"
                    hoverBg="info600"
                    rounded="circle"
                    m={{ r: "1rem" }}
                    shadow="2"
                    hoverShadow="4"
                  >
                    <Icon name="Timestamp" size="20px" color="white" />
                  </Button>
                </Col>
                <Col>
                  <Button
                    h="2rem"
                    w="2rem"
                    bg="brand700"
                    hoverBg="brand600"
                    rounded="circle"
                    m={{ r: "1rem" }}
                    shadow="2"
                    hoverShadow="0"
                  >
                    <Icon name="User" size="20px" color="white" />
                  </Button>
                </Col>
              </Row>
            </Div>
          </Div>
        </Col>
        <Col size="10">
          <Div bg="warning500">
            <MapContainer center={config.center} zoom={config.zoom} id="map" whenCreated={setMap}>
            <MapEvents
              setViewport={setViewport}
              viewport={viewport}
              setPreferences={setPreferences}
            />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>
          </Div>
        </Col>
      </Row>
    </>
  );
}

export default Map;
