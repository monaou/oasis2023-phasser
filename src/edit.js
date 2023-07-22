import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { IDRegistryABI, contractAddress } from './constants';
import { Button, Form, Container, Row, Col, Card, ListGroup, InputGroup, FormControl, FormLabel } from 'react-bootstrap';

function EditPage() {
  const [name, setName] = useState('');
  const [entry, setEntry] = useState('');
  const [incentive, setIncentive] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [size_x, setSizeX] = useState('');
  const [size_y, setSizeY] = useState('');
  const [type, setType] = useState('');
  const [data, setData] = useState([]);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [stages, setStages] = useState([]);
  const [stage_names, setStageNames] = useState([]);

  const handleAdd = () => {
    setData(prevData => [...prevData, { x, y, size_x, size_y, type }]);
    setX('');
    setY('');
    setSizeX('');
    setSizeY('');
    setType('');
  };

  const handleSaveAllData = async () => {
    if (!provider) {
      console.log("No provider is set");
      return;
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, IDRegistryABI, signer);
    const _stageID = Math.floor(Math.random() * 1000000);

    // Convert the JSON string from textarea to an array of objects
    const dataStr = JSON.stringify(data);
    const extraDataArr = JSON.parse(dataStr).map(item => [
      Number(item.x),
      Number(item.y),
      Number(item.size_x),
      Number(item.size_y),
      item.type
    ]);

    try {
      const tx = await contract.setAllData(_stageID, account, name, Number(entry), Number(incentive), extraDataArr);
      await tx.wait();
      console.log('Data has been saved successfully', { name, data });
    } catch (err) {
      console.error("An error occurred while saving the data", err);
    }
  };

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            1: "https://mainnet.infura.io/v3/YOUR_INFURA_ID"
          }
        }
      }
    }
  });

  // Handle connecting to the wallet
  const connectWallet = async () => {
    const provider = await web3Modal.connect();
    setProvider(new ethers.providers.Web3Provider(provider));
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    setProvider(null);
    setAccount('');
  };

  // Fetch the wallet address once the provider is available
  useEffect(() => {
    if (provider) {
      provider.listAccounts().then(accounts => setAccount(accounts[0]));
    }
  }, [provider]);

  const showStages = async () => {
    if (!provider) {
      console.log("No provider is set");
      return;
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, IDRegistryABI, signer);
    console.log(contract)
    try {
      const accountStages = await contract.getAccountStages(account);
      const accountNames = await contract.getAccountNames(account);

      console.log('Account stages:', accountStages);
      console.log('Account names:', accountNames);
      setStages(accountStages);
      setStageNames(accountNames);
    } catch (err) {
      console.error("An error occurred while fetching stages", err);
    }
  };


  // Connect to the wallet when the Connect button is clicked
  const handleConnectWallet = () => {
    connectWallet();
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  return (
    <Container fluid>
      <Row>
        <Col sm={6}>
          <div style={{ marginTop: "20px" }}>
            {account ? (
              <>
                <Button variant="danger" onClick={disconnectWallet}>
                  Disconnect Wallet
                </Button>
                <p>Connected to: {account}</p>
              </>
            ) : (
              <Button variant="success" onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
            )}
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
                    <FormLabel>Size X:</FormLabel>
                    <FormControl type="text" value={size_x} onChange={e => setSizeX(e.target.value)} />
                  </Col>
                  <Col>
                    <FormLabel>Size Y:</FormLabel>
                    <FormControl type="text" value={size_y} onChange={e => setSizeY(e.target.value)} />
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
            <Button onClick={showStages} disabled={!account}>
              Show Stages
            </Button>
            <h2>Stages:</h2>
            <ListGroup>
              {stages.map((stageId, index) => (
                <ListGroup.Item key={stageId.toString()}>
                  Stage ID: {stageId.toString()}, Stage Name: {stage_names[index]}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>
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

export default EditPage;
