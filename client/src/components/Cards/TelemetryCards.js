import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function BMP(prps) {
  
    return (
        <Card style={{ margin: "5px", width: "100%" }}>
      <Card.Header>BMP</Card.Header>
      <ListGroup>
        <ListGroup.Item>Temperature </ListGroup.Item>
        <ListGroup.Item>Perssure </ListGroup.Item>
      </ListGroup>
    </Card>
    );
}