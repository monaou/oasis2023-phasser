```mermaid
graph TD
    A(Route53)
    B(ALB: Load Balancer)
    C(CDN: chache server)
    D(App: EC2)
    E(Backend: EC2)
    F(DB: mysql)
    G(MCHverse)
    H(NAT instance)
    
    A -->|HTTP/HTTPS, TCP 3000| B
    B -->|*/public/| C
    B -->|TCP 3000| D
    D -->|TCP 3000| E
    E -->|myswl 3306| F
    E -->|TCP 3300| H
    H -->|https| G
    
    subgraph "Public Subnet"
        B
        C
        D
    end
    
    subgraph "Private Subnet"
        E
        F
        H
    end

    subgraph "BlockChain"
        G
    end
