import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import rewardContract from '../shared_json/RewardPool.json';
import { ERC20_ABI } from '../shared_json/Erc20_abi';
import currency from '../shared_json/currency.json';
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

    const incentiveValue = (Number(incentive) * 1000000).toString();
    const oasContract = new ethers.Contract(currency.sandverse, ERC20_ABI, signer);  // NOTE: ERC20トークンのABIにはapproveメソッドが含まれている必要があります
    try {
      const tx = await oasContract.approve(rewardContract.address, ethers.utils.parseUnits(incentiveValue, 6));  // USDCは小数点以下6桁なので、6を指定
      await tx.wait();
      console.log("Allowance set successfully");
    } catch (err) {
      console.error("An error occurred while setting the allowance", err);
    }

    try {
      const tx = await contract.stakeReward(name, Number(entry * 1000000), Number(incentive * 1000000), extraDataArr);
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
        <Button onClick={handleSaveAllData} disabled={!address}>
          Save
        </Button>
        <Col sm={6}>
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container >
  );
}

export default CrateStage;
