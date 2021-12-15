import React from "react";
import { Row, Col, Icon, Text } from "atomize";
import Moment from "react-moment";
import moment from "moment";

const data = [
  {
    id: 1,
    name: "RhinoPod-001",
    timestamp: "2021-12-15T11:28:13Z",
  },
  {
    id: 2,
    name: "RhinoPod-002",
    timestamp: "2021-12-15T09:15:13Z",
  },
  {
    id: 3,
    name: "RhinoPod-002",
    timestamp: "2021-12-15T11:10:13Z",
  },
  {
    id: 4,
    name: "SmartParks-001",
    timestamp: "2021-12-15T11:05:13Z",
  },
  {
    id: 5,
    name: "MicroTracker-5FA",
    timestamp: "2021-12-15T11:02:13Z",
  },
  {
    id: 6,
    name: "MicroTracker-0A1",
    timestamp: "2021-12-15T10:55:13Z",
  },
];

function SensorList({ config }) {
  return (
    <Col>
      <Row justify="center">Sensors</Row>
      {data.map((sensor, index) => {
        return (
          <Row
            key={sensor.id}
            hoverBg="info300"
            align="center"
            bg={index % 2 === 0 ? "info100" : "info200"}
            cursor="pointer"
          >
            <Col size="2">
              <Icon
                name="Dot"
                size="20px"
                color={
                  moment().diff(sensor.timestamp, "minutes") < 10
                    ? "green"
                    : moment().diff(sensor.timestamp, "minutes") < 60
                    ? "orange"
                    : "red"
                }
              />
            </Col>
            <Col size="6">
              <Text textSize="tiny">{sensor.name}</Text>
            </Col>
            <Col size="4">
              <Text textSize="tiny">
                <Moment fromNow>{sensor.timestamp}</Moment>
              </Text>
            </Col>
          </Row>
        );
      })}
    </Col>
  );
}

export default SensorList;
