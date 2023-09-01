import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { rewardContract } from '../shared_json/RewardPool.json';
import { Button, Form, Container, Row, Col, Card, FormControl, FormLabel } from 'react-bootstrap';

function CrateStage({ address, provider }) {
  const [name, setName] = useState('');
  const [entry, setEntry] = useState('');
  const [incentive, setIncentive] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [type, setType] = useState('');
  const [data, setData] = useState([]);

  const handleAdd = () => {
    setData(prevData => [...prevData, { x, y, type }]);
    setX('');
    setY('');
    setType('');
  };

  const handleSaveAllData = async () => {
    if (!provider) {
      console.log("No provider is set");
      return;
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(rewardContract.address, rewardContract.abi, signer);

    // Convert the JSON string from textarea to an array of objects
    const dataStr = JSON.stringify(data);
    const extraDataArr = JSON.parse(dataStr).map(item => [
      Number(item.x),
      Number(item.y),
      item.type
    ]);

    try {
      const tx = await contract.setAllData(name, Number(entry), Number(incentive), extraDataArr);
      await tx.wait();
      console.log('Data has been saved successfully', { name, data });
    } catch (err) {
      console.error("An error occurred while saving the data", err);
    }
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  return (
    <Container fluid>
      <Row>
        <Form>
          <Form.Group className="mb-3">
            <Row>
              <Col>
                <FormLabel>X:</FormLabel>
                <FormControl type="text" value={x} onChange={e => setX(e.target.value)} />
              </Col>
              <Col>
                <FormLabel>Y:</FormLabel>
                <FormControl type="text" value={y} onChange={e => setY(e.target.value)} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Row>
              <Col>
                <FormLabel>Type:</FormLabel>
                <Form.Select value={type} onChange={handleTypeChange}>
                  <option value="">--choose an option--</option>
                  <option value="obstacle">Obstacle</option>
                  <option value="enemy">Enemy_a</option>
                  <option value="enemy_b">Enemy_b</option>
                  <option value="enemy_boss">Enemy_Boss</option>
                  <option value="goal">Goal</option>
                  <option value="coin">Coin</option>
                  <option value="stone">Stone</option>
                </Form.Select>
              </Col>
              <Col className="d-flex align-items-center">
                <Button onClick={handleAdd}>Add</Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>

        <Form>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <FormLabel>Name:</FormLabel>
                <FormControl type="text" value={name} onChange={e => setName(e.target.value)} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <FormLabel>Entry:</FormLabel>
                <FormControl type="text" value={entry} onChange={e => setEntry(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <FormLabel>Incentive:</FormLabel>
                <FormControl type="text" value={incentive} onChange={e => setIncentive(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>

        </Form>
        <Button onClick={handleSaveAllData} disabled={!account}>
          Save
        </Button>
        <Col sm={6}>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Text>
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container >
  );

}

export default CrateStage;
